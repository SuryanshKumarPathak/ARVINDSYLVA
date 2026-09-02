const FollowUp = require('../models/FollowUp.model');

class FollowUpRepository {
  async create(data) {
    const followUp = new FollowUp(data);
    return followUp.save();
  }

  async findByLeadId(leadId) {
    return FollowUp.find({ leadId })
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email')
      .sort({ scheduledAt: -1 })
      .lean();
  }

  async findUpcoming({ userId, limit = 20 } = {}) {
    const filter = {
      isCompleted: false,
      scheduledAt: { $gte: new Date() },
      ...(userId ? { createdBy: userId } : {}),
    };
    return FollowUp.find(filter)
      .populate('leadId', 'fullName phone status leadId')
      .populate('createdBy', 'name')
      .sort({ scheduledAt: 1 })
      .limit(limit)
      .lean();
  }

  async findOverdue({ userId } = {}) {
    const filter = {
      isCompleted: false,
      scheduledAt: { $lt: new Date() },
      ...(userId ? { createdBy: userId } : {}),
    };
    return FollowUp.find(filter)
      .populate('leadId', 'fullName phone status leadId')
      .populate('createdBy', 'name')
      .sort({ scheduledAt: 1 })
      .lean();
  }

  async findToday({ userId } = {}) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const filter = {
      scheduledAt: { $gte: startOfDay, $lte: endOfDay },
      ...(userId ? { createdBy: userId } : {}),
    };
    return FollowUp.find(filter)
      .populate('leadId', 'fullName phone status leadId')
      .populate('createdBy', 'name')
      .sort({ scheduledAt: 1 })
      .lean();
  }

  async markComplete(id, userId) {
    return FollowUp.findByIdAndUpdate(
      id,
      { $set: { isCompleted: true, completedAt: new Date(), completedBy: userId } },
      { new: true }
    );
  }
}

module.exports = new FollowUpRepository();
