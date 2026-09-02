const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User.model');
const { sendError } = require('../utils/responseUtils');
const logger = require('../config/logger');

const authenticate = async (req, res, next) => {
  try {
    // Extract token from HTTP-only cookie first, then Authorization header
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, { statusCode: 401, message: 'Authentication required. Please log in.' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return sendError(res, { statusCode: 401, message: 'Session expired. Please log in again.' });
    }

    const user = await User.findById(decoded.userId).select('+isActive +role');
    if (!user || !user.isActive) {
      return sendError(res, { statusCode: 401, message: 'Account not found or has been deactivated.' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return sendError(res, { statusCode: 500, message: 'Authentication error.' });
  }
};

module.exports = { authenticate };
