
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware checks if the user is logged in before they can access protected routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
            // Find the user in database and attach to request (without password for security)
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            // If token is invalid or expired, send error
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token was provided, deny access
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
