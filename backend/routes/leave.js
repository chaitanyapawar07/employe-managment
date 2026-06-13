const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const checkRole = require('../roleMiddleware');
const { applyLeave, getMyLeaves, approveLeave, rejectLeave, getAllLeaves } = require('../controllers/leaveController');
const pool = require('../db');
const { validateLeave } = require('../validate');

/**
 * @swagger
 * /api/leave/types:
 *   get:
 *     summary: Get all leave types
 *     tags: [Leave]
 *     responses:
 *       200:
 *         description: List of leave types
 *
 * /api/leave/apply:
 *   post:
 *     summary: Apply for leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leave applied successfully
 *
 * /api/leave/my-leaves:
 *   get:
 *     summary: Get my leaves
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my leaves
 *
 * /api/leave/all:
 *   get:
 *     summary: Get all leaves (Admin)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all leaves
 */

router.get('/types', async (req, res) => {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS leave_types (
         id SERIAL PRIMARY KEY,
         leave_name VARCHAR(255) NOT NULL
       )`
    );

    let result = await pool.query('SELECT * FROM leave_types');

    if (result.rows.length === 0) {
      await pool.query(
        `INSERT INTO leave_types (leave_name)
         SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE leave_name = $1)`,
        ['Sick Leave']
      );
      await pool.query(
        `INSERT INTO leave_types (leave_name)
         SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE leave_name = $1)`,
        ['Paid Leave']
      );
      await pool.query(
        `INSERT INTO leave_types (leave_name)
         SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE leave_name = $1)`,
        ['Casual Leave']
      );
      result = await pool.query('SELECT * FROM leave_types');
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Leave types load failed:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/apply', authMiddleware, applyLeave);
router.get('/my-leaves', authMiddleware, getMyLeaves);
router.put('/approve/:id', authMiddleware, approveLeave);
router.put('/reject/:id', authMiddleware, rejectLeave);
router.get('/all', authMiddleware, getAllLeaves);
router.post('/apply', authMiddleware, validateLeave, applyLeave);
router.put('/final-approve/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const result = await pool.query(
      'UPDATE leave_applications SET status=$1 WHERE id=$2 RETURNING *',
      ['final_approved', id]
    );
    await pool.query(
      `INSERT INTO approval_history (leave_id, approved_by, action, remarks, created_at)
       VALUES ($1,$2,$3,$4,NOW())`,
      [id, req.user.id, 'final_approved', remarks]
    );
    res.json({ message: 'Final approval done!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
