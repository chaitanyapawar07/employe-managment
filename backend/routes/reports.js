const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../authMiddleware');

router.get('/joins', authMiddleware, async (req, res) => {
  try {
    // Join 1: Employees and Departments
    const join1 = await pool.query(`
      SELECT u.name, d.department_name
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id;
    `);

    // Join 2: Employees and Skills
    const join2 = await pool.query(`
      SELECT u.name, s.skill_name
      FROM employee_skills es
      INNER JOIN employee_profiles ep ON es.employee_id = ep.id
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN skills s ON es.skill_id = s.id;
    `);

    res.json({
      join1: join1.rows,
      join2: join2.rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
