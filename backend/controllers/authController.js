
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// This function creates a JWT token for the user after login or registration
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// Register new user
const registerUser = async (req, res) => {
    // Get the user data from the request body
    const { name, email, password } = req.body;
    
    // Check if all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }
    
    // Make sure password is at least 6 characters long
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password too short' });
    }
    
    try {
        // Check if a user with this email already exists in the database
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Create a new user in the database
        const user = await User.create({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password 
        });

        // Send back the user information with a JWT token
        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email,
            role: user.role, 
            token: generateToken(user.id, user.role) 
        });
    } catch (error) {
        // Handle duplicate email error from database
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(500).json({ message: 'Registration failed' });
    }
};

// This function handles user login
const loginUser = async (req, res) => {
    // Get email and password from the request
    const { email, password } = req.body;
    
    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    
    try {
        // Find the user in the database by email
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
            // Send error if credentials are wrong
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
      // Find the user by ID from the authenticated request
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send back the user profile information
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

// This function allows users to update their profile information
const updateUserProfile = async (req, res) => {
    try {
        // Find the user by ID from the authenticated request
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get the new data from request body
        const { name, email, affiliation, address } = req.body;
        // Update only the fields that are provided, keep existing ones if not
        user.name = name || user.name;
        user.email = email || user.email;
        user.affiliation = affiliation || user.affiliation;
        user.address = address || user.address;

        // Save the updated user to database
        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, affiliation: updatedUser.affiliation, address: updatedUser.address, role: updatedUser.role, token: generateToken(updatedUser.id, updatedUser.role) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create admin user (should be protected and used only for initial setup)
const createAdmin = async (req, res) => {
    // Get admin details from request body
    const { name, email, password, adminSecret } = req.body;
    
    // Check admin secret (you should set this in environment variables)
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
    }
    
    try {
        // Check if someone already has this email address
        const adminExists = await User.findOne({ email: email.toLowerCase() });
        if (adminExists) return res.status(400).json({ message: 'User already exists with this email' });

        // Create a new admin user in the database
        const admin = await User.create({ 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password,
            role: 'admin'
        });

        // Send back the admin information with JWT token
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
