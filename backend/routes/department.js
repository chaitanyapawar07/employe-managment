const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    // Ensure table exists
    await pool.query(
      `CREATE TABLE IF NOT EXISTS departments (
         id SERIAL PRIMARY KEY,
         department_name VARCHAR(255) UNIQUE NOT NULL
       )`
    );

    let result = await pool.query('SELECT * FROM departments ORDER BY id ASC');

    // Seed default departments if empty
    if (result.rows.length === 0) {
      const defaultDepts = ['HR', 'IT', 'Finance', 'Sales', 'Engineering'];
      for (const dept of defaultDepts) {
        await pool.query(
          `INSERT INTO departments (department_name)
           VALUES ($1)
           ON CONFLICT (department_name) DO NOTHING`,
          [dept]
        );
      }
      result = await pool.query('SELECT * FROM departments ORDER BY id ASC');
    }

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { department_name } = req.body;
    
    // Ensure table exists
    await pool.query(
      `CREATE TABLE IF NOT EXISTS departments (
         id SERIAL PRIMARY KEY,
         department_name VARCHAR(255) UNIQUE NOT NULL
       )`
    );

    const result = await pool.query(
      'INSERT INTO departments (department_name) VALUES ($1) RETURNING *',
      [department_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
