const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Get my notifications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark as read
router.put('/read/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read=true WHERE id=$1',
      [req.params.id]
    );
    res.json({ message: 'Notification marked as read!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;