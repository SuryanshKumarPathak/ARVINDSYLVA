const express = require('express');
const router = express.Router();
const {
  createLead, getLeads, getLeadById, updateLeadStatus, updateLeadPriority,
  assignLead, addNote, scheduleFollowUp, deleteLead, exportLeads,
} = require('../controllers/lead.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles, authorizePermission } = require('../middleware/authorize.middleware');
const { validate } = require('../middleware/validate.middleware');
const { leadLimiter, exportLimiter } = require('../middleware/rateLimit.middleware');
const {
  createLeadValidation, updateLeadStatusValidation, updateLeadPriorityValidation,
  addNoteValidation, scheduleFollowUpValidation, assignLeadValidation, getLeadsValidation,
} = require('../validators/lead.validator');
const { ROLES } = require('../constants/roles');
const { PERMISSIONS } = require('../constants/roles');

// Public – lead submission
router.post('/', leadLimiter, validate(createLeadValidation), createLead);

// Protected – all below require auth
router.use(authenticate);

// Export (before /:id so it doesn't get caught by param route)
router.get('/export', authorizePermission(PERMISSIONS.EXPORT_LEADS), exportLimiter, exportLeads);

// List
router.get('/', authorizePermission(PERMISSIONS.VIEW_ALL_LEADS), validate(getLeadsValidation), getLeads);

// Single lead
router.get('/:id', authorizeRoles(ROLES.SALES_EXECUTIVE, ROLES.SALES_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN), getLeadById);

// Lead actions
router.patch('/:id/status', validate(updateLeadStatusValidation), authorizePermission(PERMISSIONS.UPDATE_LEAD_STATUS), updateLeadStatus);
router.patch('/:id/priority', validate(updateLeadPriorityValidation), authorizePermission(PERMISSIONS.UPDATE_LEAD_STATUS), updateLeadPriority);
router.patch('/:id/assign', validate(assignLeadValidation), authorizePermission(PERMISSIONS.ASSIGN_LEADS), assignLead);
router.post('/:id/notes', validate(addNoteValidation), authorizePermission(PERMISSIONS.ADD_NOTES), addNote);
router.post('/:id/follow-up', validate(scheduleFollowUpValidation), authorizePermission(PERMISSIONS.ADD_NOTES), scheduleFollowUp);

// Delete – admin+
router.delete('/:id', authorizePermission(PERMISSIONS.DELETE_LEADS), deleteLead);

module.exports = router;
