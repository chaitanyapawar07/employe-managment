const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all assets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assets ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new asset
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { asset_name, asset_type, serial_number } = req.body;
    const result = await pool.query(
      'INSERT INTO assets (asset_name, asset_type, serial_number) VALUES ($1,$2,$3) RETURNING *',
      [asset_name, asset_type, serial_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Allocate asset to employee
router.post('/allocate', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { asset_id, employee_id } = req.body;
    await client.query('BEGIN');
    
    // Update asset status
    await client.query(
      'UPDATE assets SET status=$1 WHERE id=$2',
      ['allocated', asset_id]
    );
    
    // Create allocation
    const result = await client.query(
      'INSERT INTO asset_allocations (asset_id, employee_id) VALUES ($1,$2) RETURNING *',
      [asset_id, employee_id]
    );
    
    // Add notification
    await client.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1,$2)',
      [employee_id, `Asset allocated to you!`]
    );

    // Audit log
    await client.query(
      'INSERT INTO audit_logs (user_id, action, new_value) VALUES ($1,$2,$3)',
      [req.user.id, 'ASSET_ALLOCATED', `Asset ID: ${asset_id} → Employee ID: ${employee_id}`]
    );

    await client.query('COMMIT');
    res.json({ message: 'Asset allocated!', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

// Return asset
router.put('/return/:id', authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const allocation = await client.query(
      'UPDATE asset_allocations SET returned_at=NOW(), status=$1 WHERE id=$2 RETURNING *',
      ['returned', req.params.id]
    );
    
    await client.query(
      'UPDATE assets SET status=$1 WHERE id=$2',
      ['available', allocation.rows[0].asset_id]
    );

    await client.query(
      'INSERT INTO audit_logs (user_id, action, new_value) VALUES ($1,$2,$3)',
      [req.user.id, 'ASSET_RETURNED', `Allocation ID: ${req.params.id}`]
    );

    await client.query('COMMIT');
    res.json({ message: 'Asset returned!' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
});

// Get all allocations
router.get('/allocations', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT aa.*, a.asset_name, a.asset_type, a.serial_number, u.name as employee_name
       FROM asset_allocations aa
       JOIN assets a ON aa.asset_id = a.id
       JOIN users u ON aa.employee_id = u.id
       ORDER BY aa.allocated_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;