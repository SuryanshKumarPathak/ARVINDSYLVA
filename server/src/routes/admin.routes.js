const express = require('express');
const router = express.Router();
const { getAdmins, createAdmin, updateAdmin, deleteAdmin, getSalesUsers, getFollowUps } = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles, authorizePermission } = require('../middleware/authorize.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createAdminValidation, updateAdminValidation } = require('../validators/admin.validator');
const { ROLES, PERMISSIONS } = require('../constants/roles');

router.use(authenticate);

router.get('/sales-users', getSalesUsers);
router.get('/follow-ups', getFollowUps);
router.get('/', authorizePermission(PERMISSIONS.MANAGE_ADMINS), getAdmins);
router.post('/', authorizeRoles(ROLES.SUPER_ADMIN), validate(createAdminValidation), createAdmin);
router.patch('/:id', authorizePermission(PERMISSIONS.MANAGE_ADMINS), validate(updateAdminValidation), updateAdmin);
router.delete('/:id', authorizeRoles(ROLES.SUPER_ADMIN), deleteAdmin);

module.exports = router;
