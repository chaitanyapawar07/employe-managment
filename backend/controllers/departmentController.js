const pool = require('../db');

const getDepartments = async (req, res) => {
  console.log('[DEPARTMENTS] GET request received');
  try {
    console.log('[DEPARTMENTS] Querying database...');
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    console.log('[DEPARTMENTS] Query successful, rows:', result.rows.length);
    res.json({
      message: 'Departments fetched successfully!',
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('[DEPARTMENTS] Error fetching departments:', error.message);
    console.error('[DEPARTMENTS] Full error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch departments',
      error: error.message 
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM departments WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({
      message: 'Department fetched successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ 
      message: 'Failed to fetch department',
      error: error.message 
    });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById
};
