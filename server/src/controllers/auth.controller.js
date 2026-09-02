const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/responseUtils');
const { accessCookieOptions, refreshCookieOptions, clearCookieOptions } = require('../config/cookieOptions');
const logger = require('../config/logger');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken, user } = await authService.login(email, password, { ip, userAgent });

    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    return sendSuccess(res, {
      message: 'Login successful',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    if (req.user?.userId) {
      await authService.logout(req.user.userId);
    }
    res.clearCookie('accessToken', clearCookieOptions);
    res.clearCookie('refreshToken', { ...clearCookieOptions, path: '/api/auth' });
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

    return sendSuccess(res, { message: 'Token refreshed' });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.userId);
    return sendSuccess(res, { data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, refresh, getMe };
