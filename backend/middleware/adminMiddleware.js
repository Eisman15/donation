const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

const donorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'donor' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Donor or admin privileges required.' });
  }
};

module.exports = {
  adminOnly,
  donorOrAdmin
};