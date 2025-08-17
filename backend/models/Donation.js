const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: true
  },
  cause: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cause',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  paymentInfo: {
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal'],
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'paypal', 'square', 'bank'],
      required: true
    },
    currency: {
      type: String,
      default: 'USD',
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    required: true
  },
  receipt: {
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    receiptUrl: {
      type: String
    },
    taxDeductible: {
      type: Boolean,
      default: true
    },
    taxDeductibleAmount: {
      type: Number,
      min: 0
    }
  },
  metadata: {
    isAnonymous: {
      type: Boolean,
      default: false
    },
    donorMessage: {
      type: String,
      maxlength: 500
    },
    campaignSource: {
      type: String,
      trim: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  timeline: {
    initiatedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    failedAt: {
      type: Date
    },
    refundedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ cause: 1, createdAt: -1 });
donationSchema.index({ status: 1 });
donationSchema.index({ 'paymentInfo.transactionId': 1 });
donationSchema.index({ 'receipt.receiptNumber': 1 });
donationSchema.index({ createdAt: -1 });

// Pre-save middleware to generate receipt number
donationSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.receipt.receiptNumber) {
    this.receipt.receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    this.receipt.taxDeductibleAmount = this.receipt.taxDeductible ? this.amount : 0;
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);