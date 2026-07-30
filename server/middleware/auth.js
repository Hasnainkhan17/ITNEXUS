const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const tokenHeader = req.header('Authorization');

  // Check if no token
  if (!tokenHeader) {
    return res.status(401).json({ message: 'No authorization token, access denied' });
  }

  try {
    // Expecting token in bearer format: "Bearer <token>"
    const token = tokenHeader.startsWith('Bearer ') ? tokenHeader.split(' ')[1] : tokenHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'itnexus_super_secret_jwt_key_123!');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token signature is invalid or expired' });
  }
};
