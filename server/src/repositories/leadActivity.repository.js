const LeadActivity = require('../models/LeadActivity.model');

class LeadActivityRepository {
  async create(data) {
    const activity = new LeadActivity(data);
    return activity.save();
  }

  async findByLeadId(leadId, { limit = 50 } = {}) {
    return LeadActivity.find({ leadId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

module.exports = new LeadActivityRepository();
