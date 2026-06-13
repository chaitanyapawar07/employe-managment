const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { files: 5 } });

// Create Employee
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, department_id, phone, address, designation, salary, skills } = req.body;
    const result = await pool.query(
      `INSERT INTO employee_profiles (user_id, department_id, phone, address, designation, salary)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, department_id, phone, address, designation, salary]
    );
    const employee = result.rows[0];
    if (skills && skills.length > 0) {
      for (const skill_id of skills) {
        await pool.query(
          'INSERT INTO employee_skills (employee_id, skill_id) VALUES ($1,$2)',
          [employee.id, skill_id]
        );
      }
    }
    res.status(201).json({ message: 'Employee created!', data: employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Employees
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ep.*, u.name, u.email, d.department_name
       FROM employee_profiles ep
       JOIN users u ON ep.user_id = u.id
       JOIN departments d ON ep.department_id = d.id
       ORDER BY ep.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Employee
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ep.*, u.name, u.email, d.department_name
       FROM employee_profiles ep
       JOIN users u ON ep.user_id = u.id
       JOIN departments d ON ep.department_id = d.id
       WHERE ep.id = $1`,
      [req.params.id]
    );
    const skills = await pool.query(
      `SELECT s.* FROM employee_skills es
       JOIN skills s ON es.skill_id = s.id
       WHERE es.employee_id = $1`,
      [req.params.id]
    );
    res.json({ ...result.rows[0], skills: skills.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload Images
router.post('/upload/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    for (const file of req.files) {
      await pool.query(
        'INSERT INTO employee_images (employee_id, image_url) VALUES ($1,$2)',
        [id, `/uploads/${file.filename}`]
      );
    }
    res.json({ message: 'Images uploaded!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Employee
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM employee_skills WHERE employee_id=$1', [req.params.id]);
    await pool.query('DELETE FROM employee_images WHERE employee_id=$1', [req.params.id]);
    await pool.query('DELETE FROM employee_profiles WHERE id=$1', [req.params.id]);
    res.json({ message: 'Employee deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
