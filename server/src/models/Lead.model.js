const mongoose = require('mongoose');
const {
  LEAD_STATUS_VALUES, LEAD_STATUS,
  LEAD_PRIORITY_VALUES, LEAD_PRIORITY,
  CONFIGURATION_VALUES,
  CONTACT_TIME_VALUES,
} = require('../constants/leadStatus');

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    // ─── Personal Info ───────────────────────────────────────────────────
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },

    // ─── Preferences ─────────────────────────────────────────────────────
    preferredConfiguration: {
      type: String,
      enum: [...CONFIGURATION_VALUES, null],
      default: null,
    },
    preferredContactTime: {
      type: String,
      enum: [...CONTACT_TIME_VALUES, null],
      default: null,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message must not exceed 1000 characters'],
    },

    // ─── Marketing Attribution ───────────────────────────────────────────
    source: { type: String, trim: true, lowercase: true },
    medium: { type: String, trim: true, lowercase: true },
    campaign: { type: String, trim: true },
    term: { type: String, trim: true },
    content: { type: String, trim: true },
    gclid: { type: String, trim: true },
    fbclid: { type: String, trim: true },
    landingPage: { type: String, trim: true },
    referrer: { type: String, trim: true },

    // ─── Device Info ─────────────────────────────────────────────────────
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown',
    },
    userAgent: { type: String, trim: true },
    ipAddress: { type: String, trim: true },

    // ─── Lead Management ─────────────────────────────────────────────────
    status: {
      type: String,
      enum: LEAD_STATUS_VALUES,
      default: LEAD_STATUS.NEW,
    },
    priority: {
      type: String,
      enum: LEAD_PRIORITY_VALUES,
      default: LEAD_PRIORITY.MEDIUM,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ─── Notes ───────────────────────────────────────────────────────────
    notes: [
      {
        content: { type: String, required: true, trim: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ─── Timestamps ───────────────────────────────────────────────────────
    lastContactedAt: { type: Date, default: null },
    nextFollowUpAt: { type: Date, default: null },

    // ─── Duplicate Tracking ───────────────────────────────────────────────
    isDuplicate: { type: Boolean, default: false },
    originalLeadId: { type: String, default: null },
    submissionCount: { type: Number, default: 1 },

    // ─── Consent ─────────────────────────────────────────────────────────
    consent: {
      given: { type: Boolean, required: true },
      timestamp: { type: Date, required: true },
      ipAddress: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
leadSchema.index({ phone: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ campaign: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ city: 1 });
leadSchema.index({ state: 1 });
leadSchema.index({ nextFollowUpAt: 1 });
leadSchema.index({ status: 1, createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;
