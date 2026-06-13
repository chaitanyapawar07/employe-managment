const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Expect token in `Authorization` header, optionally prefixed with "Bearer "
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user payload to request for downstream handlers
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
