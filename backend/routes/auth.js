const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
      [name, email, hashedPassword]
    );
    const verifyToken = crypto.randomBytes(32).toString('hex');
await pool.query(
  `INSERT INTO password_reset (user_id, token, expires_at) 
   VALUES ($1, $2, $3)`,
  [newUser.rows[0].id, verifyToken, new Date(Date.now() + 24 * 60 * 60 * 1000)]
);
await transporter.sendMail({
  to: email,
  subject: 'Verify Your Email',
  html: `<a href="http://localhost:5173/verify/${verifyToken}">
           Click here to verify your email
         </a>`
});
    res.status(201).json({ message: "User Registered", user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const accessToken = jwt.sign(
  { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const refreshToken = crypto.randomBytes(64).toString('hex');

await pool.query(
  'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
  [user.rows[0].id, refreshToken]
);

res.json({ 
  message: 'Login Success', 
  token: accessToken, 
  refreshToken 
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id=$1",
      [decoded.id]
    );
    res.json(user.rows[0]);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (user.rows.length === 0) {
      return res.json({ message: 'If email exists, link will be sent!' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query(
      'INSERT INTO password_reset (user_id, token, expires_at) VALUES ($1,$2,$3)',
      [user.rows[0].id, token, expires]
    );
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<a href="http://localhost:5173/reset/${token}">Reset Password (15 min valid)</a>`
    });
    res.json({ message: 'Reset link sent!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await pool.query(
      'SELECT * FROM password_reset WHERE token=$1 AND expires_at > NOW()',
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Link expired or invalid!' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password=$2 WHERE id=$1',
      [result.rows[0].user_id, hashed]
    );
    await pool.query('DELETE FROM password_reset WHERE token=$1', [token]);
    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const result = await pool.query(
      'SELECT * FROM password_reset WHERE token=$1 AND expires_at > NOW()',
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Link expired or invalid!' });
    }
    await pool.query(
      'UPDATE users SET verified=true WHERE id=$1',
      [result.rows[0].user_id]
    );
    await pool.query(
      'DELETE FROM password_reset WHERE token=$1', [token]
    );
    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token=$1',
      [refreshToken]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token!' });
    }
    const user = await pool.query(
      'SELECT * FROM users WHERE id=$1',
      [result.rows[0].user_id]
    );
    const accessToken = jwt.sign(
  { 
    id: user.rows[0].id, 
    name: user.rows[0].name, 
    email: user.rows[0].email,
    role: user.rows[0].role
  },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);
    res.json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await pool.query(
      'DELETE FROM refresh_tokens WHERE token=$1',
      [refreshToken]
    );
    res.json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const checkRole = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/admin', authMiddleware, checkRole('admin'), async (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

router.post('/setup-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const result = await pool.query(
      `UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, name, email, role`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'Admin role assigned!', 
      user: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
