const pool = require('../config/db');

const checkBalance = async (employeeId, leaveTypeId) => {
  const result = await pool.query(
    'SELECT * FROM leave_balance WHERE employee_id=$1 AND leave_type_id=$2',
    [employeeId, leaveTypeId]
  );
  return result.rows[0];
};

const applyLeave = async (data) => {
  const { employee_id, leave_type_id, from_date, to_date, total_days, reason, status } = data;
  const result = await pool.query(
    `INSERT INTO leave_applications 
     (employee_id, leave_type_id, from_date, to_date, total_days, reason, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
    [employee_id, leave_type_id, from_date, to_date, total_days, reason, status]
  );
  return result.rows[0];
};

const getMyLeaves = async (employeeId) => {
  const result = await pool.query(
    `SELECT la.*, lt.leave_name 
     FROM leave_applications la
     JOIN leave_types lt ON la.leave_type_id = lt.id
     WHERE la.employee_id = $1
     ORDER BY la.created_at DESC`,
    [employeeId]
  );
  return result.rows;
};

const approveLeave = async (leaveId, approverId, remarks) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const leave = await client.query(
      'UPDATE leave_applications SET status=$1 WHERE id=$2 RETURNING *',
      ['approved', leaveId]
    );
    await client.query(
      'UPDATE leave_balance SET available_days = available_days - $1 WHERE employee_id=$2 AND leave_type_id=$3',
      [leave.rows[0].total_days, leave.rows[0].employee_id, leave.rows[0].leave_type_id]
    );
    await client.query(
      `INSERT INTO approval_history (leave_id, approved_by, action, remarks, created_at)
       VALUES ($1,$2,$3,$4,NOW())`,
      [leaveId, approverId, 'approved', remarks]
    );
    await client.query('COMMIT');
    return leave.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const rejectLeave = async (leaveId, approverId, remarks) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const leave = await client.query(
      'UPDATE leave_applications SET status=$1 WHERE id=$2 RETURNING *',
      ['rejected', leaveId]
    );
    await client.query(
      `INSERT INTO approval_history (leave_id, approved_by, action, remarks, created_at)
       VALUES ($1,$2,$3,$4,NOW())`,
      [leaveId, approverId, 'rejected', remarks]
    );
    await client.query('COMMIT');
    return leave.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllLeaves = async () => {
  const result = await pool.query(
    `SELECT la.*, lt.leave_name, u.name as employee_name
     FROM leave_applications la
     JOIN leave_types lt ON la.leave_type_id = lt.id
     JOIN users u ON la.employee_id = u.id
     ORDER BY la.created_at DESC`
  );
  return result.rows;
};

module.exports = { checkBalance, applyLeave, getMyLeaves, approveLeave, rejectLeave, getAllLeaves };