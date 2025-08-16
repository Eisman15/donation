const Cause = require('../models/Cause');

const getCauses = async (req, res) => {
  try {
    const causes = await Cause.find({ isActive: true }).populate('createdBy', 'username email');
    res.json(causes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCauseById = async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id).populate('createdBy', 'username email');
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    res.json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCause = async (req, res) => {
  const { title, description, goalAmount, image, category } = req.body;
  try {
    const cause = await Cause.create({
      title,
      description,
      goalAmount,
      image,
      category,
      createdBy: req.user.id
    });
    res.status(201).json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCause = async (req, res) => {
  const { title, description, goalAmount, image, category, isActive } = req.body;
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    
    if (cause.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this cause' });
    }

    cause.title = title || cause.title;
    cause.description = description || cause.description;
    cause.goalAmount = goalAmount || cause.goalAmount;
    cause.image = image || cause.image;
    cause.category = category || cause.category;
    cause.isActive = isActive ?? cause.isActive;
    cause.updatedAt = Date.now();

    const updatedCause = await cause.save();
    res.json(updatedCause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCause = async (req, res) => {
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    
    if (cause.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this cause' });
    }

    await cause.remove();
    res.json({ message: 'Cause deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const donateToCause = async (req, res) => {
  const { amount } = req.body;
  try {
    const cause = await Cause.findById(req.params.id);
    if (!cause) return res.status(404).json({ message: 'Cause not found' });
    
    if (!cause.isActive) {
      return res.status(400).json({ message: 'Cannot donate to inactive cause' });
    }

    cause.currentAmount += amount;
    cause.updatedAt = Date.now();
    
    const updatedCause = await cause.save();
    res.json(updatedCause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getCauses, 
  getCauseById, 
  addCause, 
  updateCause, 
  deleteCause, 
  donateToCause 
};