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

// Create admin user - used only for initial setup)
const createAdmin = async (req, res) => {
    const { name, email, password, adminSecret } = req.body;
    
    // Check admin secret 
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

// Admin: Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

// Admin: Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

// Admin: Update user
const updateUserByAdmin = async (req, res) => {
    try {
        const { name, email, role, affiliation, address } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email: email.toLowerCase() });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email.toLowerCase().trim();
        }

        // Update other fields
        if (name !== undefined) user.name = name.trim();
        if (role !== undefined) user.role = role;
        if (affiliation !== undefined) user.affiliation = affiliation;
        if (address !== undefined) user.address = address;

        const updatedUser = await user.save();
        
        // Return user without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user' });
    }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user.id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getProfile, 
    createAdmin,
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    deleteUser
};
