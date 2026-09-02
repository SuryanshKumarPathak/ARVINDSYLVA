const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes must not exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

followUpSchema.index({ leadId: 1, scheduledAt: 1 });
followUpSchema.index({ scheduledAt: 1, isCompleted: 1 });
followUpSchema.index({ createdBy: 1 });

const FollowUp = mongoose.model('FollowUp', followUpSchema);
module.exports = FollowUp;
