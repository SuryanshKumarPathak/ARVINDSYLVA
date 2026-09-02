const { v4: uuidv4 } = require('uuid');

/**
 * Generates a human-readable lead ID.
 * Format: AS-YYYYMMDD-XXXX (AS = Arvind Sylva)
 */
const generateLeadId = () => {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = uuidv4().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `AS-${datePart}-${randomPart}`;
};

module.exports = { generateLeadId };
