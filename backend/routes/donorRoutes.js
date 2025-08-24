const express = require('express');
const { 
  createDonorProfile, 
  getDonorProfile, 
  updateDonorProfile,
  getAllDonors,
  getDonorById,
  deleteDonor
} = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, donorOrAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// User routes - create and manage own donor profile
router.post('/create', protect, createDonorProfile);
router.get('/profile', protect, donorOrAdmin, getDonorProfile);
router.put('/profile', protect, donorOrAdmin, updateDonorProfile);

// Admin routes - manage all donors
router.get('/', protect, adminOnly, getAllDonors);
router.get('/:id', protect, adminOnly, getDonorById);
router.delete('/:id', protect, adminOnly, deleteDonor);

module.exports = router;