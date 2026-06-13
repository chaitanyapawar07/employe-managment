const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const pool = require('../db');

// GET /api/user/profile
// Returns user info decoded from the JWT (no DB query needed)
router.get('/profile', authMiddleware, (req, res) => {
  const { id, name, email, role } = req.user;
  res.json({
    id,
    name,
    email,
    role: role || 'User',
    lastLogin: new Date().toISOString(),
  });
});

// GET /api/user/all
// Returns all employees (for admin dashboard)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
