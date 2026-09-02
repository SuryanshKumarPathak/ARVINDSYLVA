const { body, query, param } = require('express-validator');
const { LEAD_STATUS_VALUES, CONFIGURATION_VALUES, CONTACT_TIME_VALUES, LEAD_PRIORITY_VALUES } = require('../constants/leadStatus');

const createLeadValidation = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'.-]+$/).withMessage('Name must contain only letters, spaces, hyphens, dots or apostrophes'),

  // Email is optional – some visitors prefer to share only phone
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 200 }).withMessage('Email must not exceed 200 characters'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+91|91|0)?[6-9]\d{9}$/).withMessage('Please provide a valid Indian mobile number'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),

  // State is optional on the wire – we default it server-side if missing
  body('state')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('State must be between 2 and 100 characters'),

  body('preferredConfiguration')
    .optional({ nullable: true })
    .isIn([...CONFIGURATION_VALUES, null, '']).withMessage('Invalid configuration option'),

  body('preferredContactTime')
    .optional({ nullable: true })
    .isIn([...CONTACT_TIME_VALUES, null, '']).withMessage('Invalid contact time option'),

  body('message')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Message must not exceed 1000 characters'),

  // Consent – accept boolean true or string 'true'
  body('consent')
    .notEmpty().withMessage('Consent is required')
    .custom((value) => {
      if (value === true || value === 'true') return true;
      throw new Error('You must provide consent to submit this form');
    }),

  // Marketing fields (optional, sanitized)
  body('source').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase(),
  body('medium').optional({ nullable: true, checkFalsy: true }).trim().toLowerCase(),
  body('campaign').optional({ nullable: true, checkFalsy: true }).trim(),
  body('term').optional({ nullable: true, checkFalsy: true }).trim(),
  body('content').optional({ nullable: true, checkFalsy: true }).trim(),
  body('gclid').optional({ nullable: true, checkFalsy: true }).trim(),
  body('fbclid').optional({ nullable: true, checkFalsy: true }).trim(),
  body('landingPage').optional({ nullable: true, checkFalsy: true }).trim(),
  body('referrer').optional({ nullable: true, checkFalsy: true }).trim(),
  body('consentTimestamp').optional({ nullable: true, checkFalsy: true }),
];

const updateLeadStatusValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(LEAD_STATUS_VALUES).withMessage('Invalid status value'),
];

const updateLeadPriorityValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(LEAD_PRIORITY_VALUES).withMessage('Invalid priority value'),
];

const addNoteValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Note content is required')
    .isLength({ max: 2000 }).withMessage('Note must not exceed 2000 characters'),
];

const scheduleFollowUpValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('scheduledAt')
    .notEmpty().withMessage('Follow-up date is required')
    .isISO8601().withMessage('Please provide a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) throw new Error('Follow-up date must be in the future');
      return true;
    }),
  body('notes').optional().trim().isLength({ max: 500 }),
];

const assignLeadValidation = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('assignedTo')
    .notEmpty().withMessage('Assignee is required')
    .isMongoId().withMessage('Invalid user ID'),
];

const getLeadsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(LEAD_STATUS_VALUES),
  query('priority').optional().isIn(LEAD_PRIORITY_VALUES),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

module.exports = {
  createLeadValidation,
  updateLeadStatusValidation,
  updateLeadPriorityValidation,
  addNoteValidation,
  scheduleFollowUpValidation,
  assignLeadValidation,
  getLeadsValidation,
};
