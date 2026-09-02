const User = require('../models/User.model');

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).select('+password +failedLoginAttempts +lockedUntil +refreshTokenHash');
  }

  async findAll({ filter = {}, page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return { data, total };
  }

  async create(data) {
    const user = new User(data);
    return user.save();
  }

  async updateById(id, update) {
    return User.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true });
  }

  async updateLoginSuccess(id, ip) {
    return User.findByIdAndUpdate(id, {
      $set: { lastLoginAt: new Date(), lastLoginIp: ip, failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  async incrementFailedLogin(id) {
    const user = await User.findById(id).select('+failedLoginAttempts +lockedUntil');
    if (!user) return;

    // Temporarily disabled during active testing.
    // Re-enable this feature later when the login flow is stable.
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    // if (user.failedLoginAttempts >= 5) {
    //   user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    // }
    return user.save();
  }

  async storeRefreshTokenHash(id, hash) {
    return User.findByIdAndUpdate(id, { $set: { refreshTokenHash: hash } });
  }

  async clearRefreshToken(id) {
    return User.findByIdAndUpdate(id, { $set: { refreshTokenHash: null } });
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }

  async findAllSalesUsers() {
    return User.find({ isActive: true }).select('name email role').lean();
  }
}

module.exports = new UserRepository();
