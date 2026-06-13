const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const employeesResult = await pool.query('SELECT COUNT(*) FROM employee_profiles');
    const departmentsResult = await pool.query('SELECT COUNT(*) FROM departments');
    const skillsResult = await pool.query('SELECT COUNT(*) FROM skills');
    const imagesResult = await pool.query('SELECT COUNT(*) FROM employee_images');

    res.json({
      totalEmployees: parseInt(employeesResult.rows[0].count),
      totalDepartments: parseInt(departmentsResult.rows[0].count),
      totalSkills: parseInt(skillsResult.rows[0].count),
      totalImages: parseInt(imagesResult.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
