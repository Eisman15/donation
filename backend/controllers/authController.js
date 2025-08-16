
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// Register new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validation of forms
    const errors = {};
    
    if (!name || !name.trim()) {
        errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    if (!email || !email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address. Try Again';
    }
    
    if (!password) {
        errors.password = 'Password is required. Try again';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.password = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
    }
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    
    try {
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ message: 'User already exists with this email address' });

        // with validation
        const user = await User.create({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password 
        });

        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email,
            role: user.role, 
            token: generateToken(user.id, user.role) 
        });
    } catch (error) {
        // MongoDB check duplicate user error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists with this email address' });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // Validation
    const errors = {};
    
    if (!email || !email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    
    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email,
                role: user.role, 
                token: generateToken(user.id, user.role) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        affiliation: user.affiliation,
        address: user.address,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, affiliation, address } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.affiliation = affiliation || user.affiliation;
        user.address = address || user.address;

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, affiliation: updatedUser.affiliation, address: updatedUser.address, role: updatedUser.role, token: generateToken(updatedUser.id, updatedUser.role) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create admin user (should be protected and used only for initial setup)
const createAdmin = async (req, res) => {
    const { name, email, password, adminSecret } = req.body;
    
    // Check admin secret (you should set this in environment variables)
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
    }
    
    try {
        const adminExists = await User.findOne({ email: email.toLowerCase() });
        if (adminExists) return res.status(400).json({ message: 'User already exists with this email' });

        const admin = await User.create({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password,
            role: 'admin'
        });

        res.status(201).json({ 
            id: admin.id, 
            name: admin.name, 
            email: admin.email,
            role: admin.role, 
            token: generateToken(admin.id, admin.role) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during admin creation' });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile, createAdmin };
