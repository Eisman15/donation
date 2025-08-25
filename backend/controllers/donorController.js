// controllers/donorController.js
const mongoose = require('mongoose');
const Donor = require('../models/Donor');      // <-- FIX: capital D for Linux/FS
const User = require('../models/User');
let Donation;
try {
  // Optional: only if you track donations
  Donation = require('../models/Donation');
} catch (_) { /* ignore if not present */ }

// Create a new donor profile for the authenticated user
const createDonorProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const {
      firstName,
      lastName,
      phone,
      isAnonymous,
      emailNotifications,
      newsletter,
      preferredPaymentMethod,
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'firstName and lastName are required' });
    }

    const existingDonor = await Donor.findOne({ user: userId }).lean();
    if (existingDonor) {
      return res.status(400).json({ message: 'Donor profile already exists' });
    }

    const donor = await Donor.create({
      user: userId,
      personalInfo: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim(),
      },
      preferences: {
        // only set when provided; otherwise use schema defaults
        ...(isAnonymous !== undefined ? { isAnonymous: !!isAnonymous } : {}),
        ...(emailNotifications !== undefined ? { emailNotifications: !!emailNotifications } : {}),
        ...(newsletter !== undefined ? { newsletter: !!(newsletter) } : {}),
        ...(preferredPaymentMethod ? { preferredPaymentMethod } : {}),
      },
    });

    // Optionally set role to 'donor' (keep admin role if already admin)
    if (req.user.role !== 'admin') {
      await User.findByIdAndUpdate(userId, { role: 'donor' });
    }

    const populatedDonor = await Donor.findById(donor._id).populate('user', 'name email');
    return res.status(201).json(populatedDonor);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to create donor profile' });
  }
};

// Get donor profile for the authenticated user
const getDonorProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const donor = await Donor.findOne({ user: userId }).populate('user', 'name email');
    if (!donor) return res.status(404).json({ message: 'Donor profile not found' });
    return res.json(donor);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch donor profile' });
  }
};

// Update donor profile for the authenticated user
const updateDonorProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      firstName,
      lastName,
      phone,
      isAnonymous,
      emailNotifications,
      newsletter,
      preferredPaymentMethod,
    } = req.body;

    const donor = await Donor.findOne({ user: userId });
    if (!donor) return res.status(404).json({ message: 'Donor profile not found' });

    // Ensure subdocs exist (defensive)
    donor.personalInfo ??= {};
    donor.preferences ??= {};

    if (firstName !== undefined) donor.personalInfo.firstName = firstName.trim();
    if (lastName !== undefined) donor.personalInfo.lastName = lastName.trim();
    if (phone !== undefined) donor.personalInfo.phone = phone?.trim();

    if (isAnonymous !== undefined) donor.preferences.isAnonymous = !!isAnonymous;
    if (emailNotifications !== undefined) donor.preferences.emailNotifications = !!emailNotifications;
    if (newsletter !== undefined) donor.preferences.newsletter = !!newsletter;
    if (preferredPaymentMethod !== undefined) donor.preferences.preferredPaymentMethod = preferredPaymentMethod;

    await donor.save();
    const updatedDonor = await Donor.findById(donor._id).populate('user', 'name email');
    return res.json(updatedDonor);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to update donor profile' });
  }
};

// Admin: get all donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    return res.json(donors);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch donors' });
  }
};

// Admin: get donor by donor._id
const getDonorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid donor id' });
    }
    const donor = await Donor.findById(id).populate('user', 'name email');
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    return res.json(donor);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to fetch donor' });
  }
};

// Admin: delete donor by donor._id (optional cascade)
const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const cascade = req.query.cascade === 'true';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid donor id' });
    }

    const donor = await Donor.findById(id).lean();
    if (!donor) return res.status(404).json({ message: 'Donor not found' });

    // If you track donations, optionally prevent delete unless cascade=true
    if (Donation) {
      const donationCount = await Donation.countDocuments({ donor: id }).catch(() => 0);
      if (donationCount > 0 && !cascade) {
        return res.status(409).json({
          message: 'Cannot delete donor with existing donations. Add ?cascade=true to also delete donations.',
        });
      }
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (Donation && cascade) {
          await Donation.deleteMany({ donor: id }, { session });
        }
        await Donor.deleteOne({ _id: id }, { session });

        // Optionally delete linked User account; comment out if you want to keep users
        if (donor.user) {
          await User.deleteOne({ _id: donor.user }, { session });
        }
      });
      return res.status(204).end();
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete donor' });
  }
};

module.exports = {
  createDonorProfile,
  getDonorProfile,
  updateDonorProfile,
  getAllDonors,
  getDonorById,
  deleteDonor,           
};
