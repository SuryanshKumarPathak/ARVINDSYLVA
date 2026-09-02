const Lead = require('../models/Lead.model');

class LeadRepository {
  async create(data) {
    const lead = new Lead(data);
    return lead.save();
  }

  async findById(id) {
    return Lead.findById(id).populate('assignedTo', 'name email role');
  }

  async findByLeadId(leadId) {
    return Lead.findOne({ leadId }).populate('assignedTo', 'name email role');
  }

  async findByPhone(phone) {
    return Lead.findOne({ phone }).sort({ createdAt: -1 });
  }

  async findByEmail(email) {
    return Lead.findOne({ email }).sort({ createdAt: -1 });
  }

  async findRecentByPhone(phone, withinHours = 24) {
    const since = new Date(Date.now() - withinHours * 60 * 60 * 1000);
    return Lead.findOne({ phone, createdAt: { $gte: since } }).sort({ createdAt: -1 });
  }

  async findAll({ filter = {}, page = 1, limit = 20, sort = { createdAt: -1 } } = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Lead.find(filter)
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);
    return { data, total };
  }

  async findForExport(filter = {}) {
    return Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateById(id, update) {
    return Lead.findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true })
      .populate('assignedTo', 'name email role');
  }

  async pushNote(id, note) {
    return Lead.findByIdAndUpdate(
      id,
      { $push: { notes: note } },
      { new: true }
    );
  }

  async incrementSubmissionCount(phone) {
    return Lead.findOneAndUpdate(
      { phone },
      { $inc: { submissionCount: 1 }, $set: { updatedAt: new Date() } },
      { new: true, sort: { createdAt: -1 } }
    );
  }

  async deleteById(id) {
    return Lead.findByIdAndDelete(id);
  }

  async countByFilter(filter = {}) {
    return Lead.countDocuments(filter);
  }

  async aggregatePipeline(pipeline) {
    return Lead.aggregate(pipeline);
  }
}

module.exports = new LeadRepository();
