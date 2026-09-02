const mongoose = require('mongoose');
const { ACTIVITY_TYPES } = require('../constants/leadStatus');

const leadActivitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

leadActivitySchema.index({ leadId: 1, createdAt: -1 });

const LeadActivity = mongoose.model('LeadActivity', leadActivitySchema);
module.exports = LeadActivity;
