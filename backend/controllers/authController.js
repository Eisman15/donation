
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// Register new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password too short' });
    }
    
    try {
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

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
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
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
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
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
    1
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
