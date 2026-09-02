const AuditLog = require('../models/AuditLog.model');
const logger = require('../config/logger');

class AuditService {
  log({ userId = null, userEmail = 'system', action, resource, resourceId = null, details = {}, ipAddress, userAgent, success = true, errorMessage = null }) {
    // Non-blocking fire-and-forget
    AuditLog.create({
      userId,
      userEmail,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : null,
      details,
      ipAddress,
      userAgent: userAgent ? String(userAgent).slice(0, 500) : null,
      success,
      errorMessage,
    }).catch((err) => logger.error(`Audit log write failed: ${err.message}`));
  }
}

module.exports = new AuditService();
