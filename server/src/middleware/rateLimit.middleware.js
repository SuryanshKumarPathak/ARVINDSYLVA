const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const createLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded: ${req.ip} on ${req.path}`);
      res.status(429).json({
        success: false,
        message: options.message || 'Too many requests. Please try again later.',
      });
    },
    ...options,
  });

// General API limiter
const generalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Aggressive limiter for lead submission
const leadLimiter = createLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_LEADS) || 5,
  message: 'Too many submissions. Please try again in a few minutes.',
  keyGenerator: (req) => req.ip,
});

// Login limiter
const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_LOGIN) || 10,
  message: 'Too many login attempts. Please try again after 15 minutes.',
  skipSuccessfulRequests: true,
});

// Export limiter
const exportLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Export limit reached. Please try again in an hour.',
});

module.exports = { generalLimiter, leadLimiter, loginLimiter, exportLimiter };
