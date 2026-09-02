const { ROLE_PERMISSIONS, ROLE_HIERARCHY } = require('../constants/roles');
const { sendError } = require('../utils/responseUtils');

/**
 * Authorize by role hierarchy
 * Allows the given roles and all higher roles
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, { statusCode: 401, message: 'Authentication required.' });
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = Math.min(...allowedRoles.map((r) => ROLE_HIERARCHY[r] || 99));

    if (userRoleLevel < requiredLevel) {
      return sendError(res, {
        statusCode: 403,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * Authorize by specific permission
 */
const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, { statusCode: 401, message: 'Authentication required.' });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    if (!userPermissions.includes(permission)) {
      return sendError(res, {
        statusCode: 403,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

module.exports = { authorizeRoles, authorizePermission };
