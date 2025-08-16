
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  preferences: {
    isAnonymous: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    preferredPaymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal'],
      default: 'credit_card'
    }
  },
  statistics: {
    totalDonated: {
      type: Number,
      default: 0,
      min: 0
    },
    numberOfDonations: {
      type: Number,
      default: 0,
      min: 0
    },
    causesSupported: {
      type: Number,
      default: 0,
      min: 0
    },
    firstDonationDate: {
      type: Date
    },
    lastDonationDate: {
      type: Date
    }
  },
  taxInfo: {
    taxIdNumber: {
      type: String,
      trim: true
    },
    yearlyTaxDeductible: [{
      year: {
        type: Number,
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      }
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient queries
donorSchema.index({ user: 1 });
donorSchema.index({ 'statistics.totalDonated': -1 });
donorSchema.index({ 'statistics.lastDonationDate': -1 });

module.exports = mongoose.model('Donor', donorSchema);
