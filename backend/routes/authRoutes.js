
const express = require('express');
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    getProfile, 
    createAdmin,
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    deleteUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/admin/create', createAdmin);

// Admin routes for user management
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.get('/admin/users/:id', protect, adminOnly, getUserById);
router.put('/admin/users/:id', protect, adminOnly, updateUserByAdmin);
router.delete('/admin/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
