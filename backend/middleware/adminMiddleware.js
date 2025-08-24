const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // User is admin, let them continue
    next();
  } else {
    // User is not admin, block them
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// This middleware allows both donors and admins to access certain routes
const donorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'donor' || req.user.role === 'admin')) {
    // User has correct role assignment, let them continue
    next();
  } else {
    // User doesn't have the right permissions, block them
    res.status(403).json({ message: 'Access denied. Donor or admin privileges required.' });
  }
};

module.exports = {
  adminOnly,
  donorOrAdmin
};