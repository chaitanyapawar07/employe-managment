function checkRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ 
        message: 'Access denied! You do not have permission.' 
      });
    }
    next();
  };
}

module.exports = checkRole;