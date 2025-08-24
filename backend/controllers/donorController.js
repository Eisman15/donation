const Donor = require('../models/donor');
const User = require('../models/User');

// This function creates a new donor profile for a user
const createDonorProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated request
    const userId = req.user.id;
    // Get all the donor details from request body
    const { firstName, lastName, phone, isAnonymous, emailNotifications, newsletter, preferredPaymentMethod } = req.body;

    // Check if donor profile already exists
    const existingDonor = await Donor.findOne({ user: userId });
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor profile already exists' });
    }

    // Create donor profile
    const donor = await Donor.create({
      user: userId,
      personalInfo: {
        firstName,
        lastName,
        phone
      },
      preferences: {
        isAnonymous,
        emailNotifications,
        newsletter,
        preferredPaymentMethod
      }
    });

    // Update user role to donor
    await User.findByIdAndUpdate(userId, { role: 'donor' });

    // Get the complete donor profile with user information
    const populatedDonor = await Donor.findById(donor._id).populate('user', 'name email');
    
    // Send back the created donor profile
    res.status(201).json(populatedDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function gets the donor profile for the logged-in user
const getDonorProfile = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;
    
    // Find the donor profile for this user
    const donor = await Donor.findOne({ user: userId }).populate('user', 'name email');
    
    // Check if donor profile exists
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    
    // Send back the donor profile
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function updates the donor profile for the logged-in user
const updateDonorProfile = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    // Get updated information from request body
    const { firstName, lastName, phone, isAnonymous, emailNotifications, newsletter, preferredPaymentMethod } = req.body;

    // Find the donor profile for this user
    const donor = await Donor.findOne({ user: userId });
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    // Update donor profile - only change fields that are provided
    donor.personalInfo.firstName = firstName || donor.personalInfo.firstName;
    donor.personalInfo.lastName = lastName || donor.personalInfo.lastName;
    donor.personalInfo.phone = phone || donor.personalInfo.phone;
    donor.preferences.isAnonymous = isAnonymous !== undefined ? isAnonymous : donor.preferences.isAnonymous;
    donor.preferences.emailNotifications = emailNotifications !== undefined ? emailNotifications : donor.preferences.emailNotifications;
    donor.preferences.newsletter = newsletter !== undefined ? newsletter : donor.preferences.newsletter;
    donor.preferences.preferredPaymentMethod = preferredPaymentMethod || donor.preferences.preferredPaymentMethod;

    // Save the updated profile to database
    await donor.save();

    // Get the updated donor profile with user info
    const updatedDonor = await Donor.findById(donor._id).populate('user', 'name email');
    
    // Send back the updated donor profile
    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin functions
// This function gets all donors (admin only)
const getAllDonors = async (req, res) => {
  try {
    // Get all donors from database with user info, sorted by newest first
    const donors = await Donor.find()
      .populate('user', 'name email createdAt')
      .sort({ createdAt: -1 });
    
    // Send back the list of all donors
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function gets a specific donor by their ID (admin only)
const getDonorById = async (req, res) => {
  try {
    // Find donor by ID from URL parameters and include user info
    const donor = await Donor.findById(req.params.id).populate('user', 'name email createdAt');
    
    // Check if donor exists
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    
    // Send back the donor information
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function deletes a donor by their ID (admin only)
const deleteDonor = async (req, res) => {
  try {
    // Find and delete the donor by ID
    const donor = await Donor.findByIdAndDelete(req.params.id);
    
    // Check if donor exists
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    
    // Also reset the user's role back to 'user' if they have one
    if (donor.user) {
      await User.findByIdAndUpdate(donor.user, { role: 'user' });
    }
    
    // Send success response
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDonorProfile,
  getDonorProfile,
  updateDonorProfile,
  getAllDonors,
  getDonorById,
  deleteDonor
};