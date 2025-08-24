// controllers/causeController.js
const mongoose = require('mongoose');
const Cause = require('../models/Cause');
let Donation;
try { Donation = require('../models/Donation'); } catch (_) {} // optional

// ... your existing createCause, getCauses, updateCause

// Hard delete a cause (optional ?cascade=true to remove linked donations)
const deleteCause = async (req, res) => {
  const { id } = req.params;
  const cascade = req.query.cascade === 'true';

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid cause id' });
  }

  const cause = await Cause.findById(id);
  if (!cause) return res.status(404).json({ message: 'Cause not found' });

  // Block delete if donations exist unless cascade=true
  if (Donation) {
    const donationCount = await Donation.countDocuments({ cause: id }).catch(() => 0);
    if (donationCount > 0 && !cascade) {
      return res.status(409).json({
        message: 'Cannot delete cause with existing donations. Add ?cascade=true to also delete those donations.'
      });
    }
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      if (Donation && cascade) {
        await Donation.deleteMany({ cause: id }, { session });
      }
      await Cause.deleteOne({ _id: id }, { session });
    });
    return res.status(204).end(); // No Content
  } catch (err) {
    console.error('deleteCause error:', err);
    return res.status(500).json({ message: 'Failed to delete cause' });
  } finally {
    session.endSession();
  }
};

// Soft delete / archive (sets status instead of removing)
const archiveCause = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid cause id' });
  }
  const cause = await Cause.findByIdAndUpdate(
    id,
    { status: 'archived' }, // or 'inactive' if that’s your enum
    { new: true }
  );
  if (!cause) return res.status(404).json({ message: 'Cause not found' });
  return res.json(cause);
};

module.exports = {
  createCause,
  getCauses,
  updateCause,
  deleteCause   
 
};
