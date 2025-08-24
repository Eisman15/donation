const Donor = require('../models/donor');
const User = require('../models/User');

const createDonorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
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

    const populatedDonor = await Donor.findById(donor._id).populate('user', 'name email');
    
    res.status(201).json(populatedDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDonorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const donor = await Donor.findOne({ user: userId }).populate('user', 'name email');
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDonorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, isAnonymous, emailNotifications, newsletter, preferredPaymentMethod } = req.body;

    const donor = await Donor.findOne({ user: userId });
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }

    // Update donor profile
    donor.personalInfo.firstName = firstName || donor.personalInfo.firstName;
    donor.personalInfo.lastName = lastName || donor.personalInfo.lastName;
    donor.personalInfo.phone = phone || donor.personalInfo.phone;
    donor.preferences.isAnonymous = isAnonymous !== undefined ? isAnonymous : donor.preferences.isAnonymous;
    donor.preferences.emailNotifications = emailNotifications !== undefined ? emailNotifications : donor.preferences.emailNotifications;
    donor.preferences.newsletter = newsletter !== undefined ? newsletter : donor.preferences.newsletter;
    donor.preferences.preferredPaymentMethod = preferredPaymentMethod || donor.preferences.preferredPaymentMethod;

    await donor.save();

    const updatedDonor = await Donor.findById(donor._id).populate('user', 'name email');
    
    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin functions
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find()
      .populate('user', 'name email createdAt')
      .sort({ createdAt: -1 });
    
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('user', 'name email createdAt');
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    
    res.json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    
    if (donor.user) {
      await User.findByIdAndUpdate(donor.user, { role: 'user' });
    }
    
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