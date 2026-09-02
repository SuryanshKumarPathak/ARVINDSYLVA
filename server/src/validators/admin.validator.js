const { body, param } = require('express-validator');
const { ROLES } = require('../constants/roles');

const createAdminValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(Object.values(ROLES)).withMessage('Invalid role'),

  body('phone').optional().trim(),
];

const updateAdminValidation = [
  param('id').isMongoId().withMessage('Invalid admin ID'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role'),
  body('isActive').optional().isBoolean(),
];

module.exports = { createAdminValidation, updateAdminValidation };
