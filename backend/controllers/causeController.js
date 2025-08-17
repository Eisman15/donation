const Cause = require('../models/Cause');

const createCause = async (req, res) => {
  try {
    const { title, description, targetAmount, status } = req.body;
    
    const cause = await Cause.create({
      title,
      description,
      targetAmount,
      status
    });
    
    res.status(201).json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCauses = async (req, res) => {
  try {
    const causes = await Cause.find();
    res.json(causes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCause = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const cause = await Cause.findByIdAndUpdate(id, updates, { new: true });
    
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    
    res.json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCause,
  getCauses,
  updateCause
};