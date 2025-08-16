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

module.exports = {
  createCause,
  getCauses
};