const leaveService = require('../services/leaveService');

const applyLeave = async (req, res) => {
  try {
    const result = await leaveService.applyLeave(req.body, req.user.id);
    res.status(201).json({ message: 'Leave applied successfully!', data: result });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const result = await leaveService.getMyLeaves(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveLeave = async (req, res) => {
  try {
    const result = await leaveService.approveLeave(req.params.id, req.user.id, req.body.remarks);
    res.json({ message: 'Leave approved!', data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const result = await leaveService.rejectLeave(req.params.id, req.user.id, req.body.remarks);
    res.json({ message: 'Leave rejected!', data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const result = await leaveService.getAllLeaves();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getMyLeaves, approveLeave, rejectLeave, getAllLeaves };