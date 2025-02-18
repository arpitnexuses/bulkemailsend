import mongoose from 'mongoose';

// Create the schema first
const campaignHistorySchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true
  },
  campaignName: {
    type: String,
    required: true
  },
  emailsSent: {
    type: Number,
    default: 0
  },
  emailsFailed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  details: {
    type: String
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
    required: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Add middleware to the schema before creating the model
campaignHistorySchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date();
  } else if (!(this.timestamp instanceof Date) || isNaN(this.timestamp)) {
    this.timestamp = new Date(this.timestamp);
  }
  next();
});

// Create the model using the schema
const CampaignHistory = mongoose.models.CampaignHistory || mongoose.model('CampaignHistory', campaignHistorySchema);

export default CampaignHistory; 