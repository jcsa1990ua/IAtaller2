/**
 * Token Mapping Model
 * 
 * This model stores the mappings between anonymized tokens and original PII data
 */

const mongoose = require('mongoose');

const tokenMappingSchema = new mongoose.Schema({
  // The prefixed token (e.g., EMAIL_8004719c, PHONE_40e83067, NAME_c1b4ed05)
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // The original PII data
  original: {
    type: String,
    required: true
  },
  
  // The type of PII (email, phone, name)
  type: {
    type: String,
    required: true,
    enum: ['email', 'phone', 'name'],
    index: true
  },
  
  // The 8-character hash (without prefix)
  hash: {
    type: String,
    required: true
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Last time this token was used for anonymization
  lastUsed: {
    type: Date,
    default: Date.now
  },
  
  // Counter for how many times this token has been used
  usageCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for faster queries
tokenMappingSchema.index({ type: 1, createdAt: -1 });
tokenMappingSchema.index({ token: 1 }, { unique: true });

// Method to update usage statistics
tokenMappingSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Static method to find mapping by token
tokenMappingSchema.statics.findByToken = function(token) {
  return this.findOne({ token });
};

// Static method to get statistics by type
tokenMappingSchema.statics.getStatsByType = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    byType: {
      email: 0,
      phone: 0,
      name: 0
    }
  };
  
  stats.forEach(stat => {
    result.byType[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

// Static method to clear all mappings (useful for testing)
tokenMappingSchema.statics.clearAll = function() {
  return this.deleteMany({});
};

const TokenMapping = mongoose.model('TokenMapping', tokenMappingSchema);

module.exports = TokenMapping;




