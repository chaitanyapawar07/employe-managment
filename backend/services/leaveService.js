const leaveRepository = require('../repositories/leaveRepository');

const applyLeave = async (data, employeeId) => {
  const { leave_type_id, from_date, to_date, reason } = data;

  if (!leave_type_id || !from_date || !to_date || !reason) {
    const error = new Error('Please fill in all required fields.');
    error.status = 400;
    throw error;
  }

  const leaveTypeId = Number(leave_type_id);
  if (Number.isNaN(leaveTypeId)) {
    const error = new Error('Invalid leave type selected.');
    error.status = 400;
    throw error;
  }

  const fromDate = new Date(from_date);
  const toDate = new Date(to_date);
  if (isNaN(fromDate.valueOf()) || isNaN(toDate.valueOf())) {
    const error = new Error('Invalid date format.');
    error.status = 400;
    throw error;
  }

  if (toDate < fromDate) {
    const error = new Error('To date must be the same as or after the from date.');
    error.status = 400;
    throw error;
  }

  const totalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
  if (totalDays <= 0) {
    const error = new Error('Leave duration must be at least one day.');
    error.status = 400;
    throw error;
  }

  const balance = await leaveRepository.checkBalance(employeeId, leaveTypeId);
  if (!balance || balance.available_days < totalDays) {
    const error = new Error('Insufficient leave balance.');
    error.status = 400;
    throw error;
  }

  return await leaveRepository.applyLeave({
    employee_id: employeeId,
    leave_type_id: leaveTypeId,
    from_date,
    to_date,
    total_days: totalDays,
    reason,
    status: 'pending'
  });
};

const getMyLeaves = async (employeeId) => {
  return await leaveRepository.getMyLeaves(employeeId);
};

const approveLeave = async (leaveId, approverId, remarks) => {
  return await leaveRepository.approveLeave(leaveId, approverId, remarks);
};

const rejectLeave = async (leaveId, approverId, remarks) => {
  return await leaveRepository.rejectLeave(leaveId, approverId, remarks);
};

const getAllLeaves = async () => {
  return await leaveRepository.getAllLeaves();
};

module.exports = { applyLeave, getMyLeaves, approveLeave, rejectLeave, getAllLeaves };