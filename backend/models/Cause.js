const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
   
    default: 'active'
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cause', causeSchema);