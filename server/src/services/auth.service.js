const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');
const auditService = require('./audit.service');
const logger = require('../config/logger');

class AuthService {
  async login(email, password, { ip, userAgent } = {}) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      // Generic message to prevent user enumeration
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    if (!user.isActive) {
      throw Object.assign(new Error('Your account has been deactivated. Please contact administrator.'), { statusCode: 403 });
    }

    if (user.isLocked()) {
      const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      throw Object.assign(
        new Error(`Account temporarily locked. Try again in ${minutesLeft} minutes.`),
        { statusCode: 429 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await userRepository.incrementFailedLogin(user._id);
      auditService.log({
        userId: user._id,
        userEmail: user.email,
        action: 'LOGIN_FAILED',
        resource: 'Auth',
        success: false,
        ipAddress: ip,
        userAgent,
      });
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    // Issue tokens
    const tokenPayload = { userId: user._id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store hashed refresh token
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await userRepository.storeRefreshTokenHash(user._id, refreshHash);
    await userRepository.updateLoginSuccess(user._id, ip);

    auditService.log({
      userId: user._id,
      userEmail: user.email,
      action: 'LOGIN_SUCCESS',
      resource: 'Auth',
      ipAddress: ip,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw Object.assign(new Error('Refresh token required'), { statusCode: 401 });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
    }

    const user = await userRepository.findByEmail(decoded.email);
    if (!user || !user.isActive) {
      throw Object.assign(new Error('User not found or inactive'), { statusCode: 401 });
    }

    // Verify stored hash matches
    if (!user.refreshTokenHash) {
      throw Object.assign(new Error('Session expired. Please log in again.'), { statusCode: 401 });
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }

    // Rotate tokens
    const tokenPayload = { userId: user._id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);
    await userRepository.storeRefreshTokenHash(user._id, newRefreshHash);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId) {
    await userRepository.clearRefreshToken(userId);
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
    return user;
  }
}

module.exports = new AuthService();
