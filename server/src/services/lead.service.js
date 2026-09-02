const leadRepository = require('../repositories/lead.repository');
const leadActivityRepository = require('../repositories/leadActivity.repository');
const followUpRepository = require('../repositories/followUp.repository');
const { generateLeadId } = require('../utils/generateLeadId');
const { LEAD_STATUS, ACTIVITY_TYPES } = require('../constants/leadStatus');
const emailService = require('./email.service');
const auditService = require('./audit.service');
const logger = require('../config/logger');

// Normalize Indian phone number to 10-digit format
const normalizePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) return cleaned.slice(2);
  if (cleaned.length === 11 && cleaned.startsWith('0')) return cleaned.slice(1);
  return cleaned.slice(-10);
};

const getDeviceType = (userAgent = '') => {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (ua) return 'desktop';
  return 'unknown';
};

class LeadService {
  async createLead(data, { ip, userAgent } = {}) {
    const normalizedPhone = normalizePhone(data.phone);

    // Duplicate detection: same phone within 48 hours
    const existingLead = await leadRepository.findRecentByPhone(normalizedPhone, 48);

    if (existingLead) {
      // Update existing lead with new campaign attribution if it has better data
      const updateData = {
        submissionCount: (existingLead.submissionCount || 1) + 1,
        updatedAt: new Date(),
      };
      // Update UTM if new submission has attribution data
      if (data.source && !existingLead.source) updateData.source = data.source;
      if (data.campaign && !existingLead.campaign) updateData.campaign = data.campaign;
      if (data.gclid && !existingLead.gclid) updateData.gclid = data.gclid;
      if (data.fbclid && !existingLead.fbclid) updateData.fbclid = data.fbclid;

      await leadRepository.updateById(existingLead._id, updateData);

      // Log duplicate activity
      await leadActivityRepository.create({
        leadId: existingLead._id,
        action: ACTIVITY_TYPES.LEAD_CREATED,
        description: `Duplicate submission received (submission #${updateData.submissionCount})`,
        metadata: { source: data.source, campaign: data.campaign, ip },
      });

      // Return existing lead as success (don't leak duplicate info to public)
      return existingLead;
    }

    // Create new lead
    const leadId = generateLeadId();
    const deviceType = getDeviceType(userAgent);

    // Normalize consent: accept boolean true or string 'true'
    const consentGiven = data.consent === true || data.consent === 'true';
    const consentTimestamp = data.consentTimestamp ? new Date(data.consentTimestamp) : new Date();

    const leadData = {
      leadId,
      fullName: data.fullName,
      email: data.email || null,
      phone: normalizedPhone,
      city: data.city,
      state: data.state || 'Karnataka', // Default to Karnataka (project location)
      preferredConfiguration: data.preferredConfiguration || null,
      preferredContactTime: data.preferredContactTime || null,
      message: data.message || null,
      source: data.source || null,
      medium: data.medium || null,
      campaign: data.campaign || null,
      term: data.term || null,
      content: data.content || null,
      gclid: data.gclid || null,
      fbclid: data.fbclid || null,
      landingPage: data.landingPage || null,
      referrer: data.referrer || null,
      deviceType,
      userAgent: userAgent ? userAgent.slice(0, 500) : null,
      ipAddress: ip,
      status: LEAD_STATUS.NEW,
      consent: {
        given: consentGiven,
        timestamp: consentTimestamp,
        ipAddress: ip,
      },
    };

    const lead = await leadRepository.create(leadData);

    // Create initial activity
    await leadActivityRepository.create({
      leadId: lead._id,
      action: ACTIVITY_TYPES.LEAD_CREATED,
      description: `New lead created via ${data.source || 'direct'} / ${data.medium || 'unknown'}`,
      metadata: { leadId: lead.leadId, campaign: data.campaign },
    });

    // Send email notification (non-blocking)
    emailService.sendNewLeadNotification(lead).catch((err) =>
      logger.error(`Email notification failed for lead ${lead.leadId}: ${err.message}`)
    );

    // Audit log
    auditService.log({
      action: 'LEAD_CREATED',
      resource: 'Lead',
      resourceId: lead.leadId,
      details: { phone: normalizedPhone, source: data.source, campaign: data.campaign },
      ipAddress: ip,
      userAgent,
    });

    return lead;
  }

  async getLeads({ filter = {}, page = 1, limit = 20, sort = { createdAt: -1 }, search } = {}) {
    const query = { ...filter };

    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { leadId: searchRegex },
      ];
    }

    return leadRepository.findAll({ filter: query, page, limit, sort });
  }

  async getLeadById(id) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
    return lead;
  }

  async updateLeadStatus(leadId, newStatus, userId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const oldStatus = lead.status;
    const update = { status: newStatus };

    if (newStatus === 'CONTACTED') update.lastContactedAt = new Date();

    const updated = await leadRepository.updateById(leadId, update);

    await leadActivityRepository.create({
      leadId: lead._id,
      userId,
      action: ACTIVITY_TYPES.STATUS_CHANGED,
      description: `Status changed from ${oldStatus} to ${newStatus}`,
      oldValue: oldStatus,
      newValue: newStatus,
    });

    return updated;
  }

  async updateLeadPriority(leadId, newPriority, userId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const oldPriority = lead.priority;
    const updated = await leadRepository.updateById(leadId, { priority: newPriority });

    await leadActivityRepository.create({
      leadId: lead._id,
      userId,
      action: ACTIVITY_TYPES.PRIORITY_CHANGED,
      description: `Priority changed from ${oldPriority} to ${newPriority}`,
      oldValue: oldPriority,
      newValue: newPriority,
    });

    return updated;
  }

  async assignLead(leadId, assignedTo, userId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const updated = await leadRepository.updateById(leadId, { assignedTo });

    await leadActivityRepository.create({
      leadId: lead._id,
      userId,
      action: ACTIVITY_TYPES.ASSIGNED,
      description: `Lead assigned`,
      newValue: assignedTo,
      oldValue: lead.assignedTo,
    });

    return updated;
  }

  async addNote(leadId, content, userId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const note = { content, createdBy: userId, createdAt: new Date() };
    const updated = await leadRepository.pushNote(leadId, note);

    await leadActivityRepository.create({
      leadId: lead._id,
      userId,
      action: ACTIVITY_TYPES.NOTE_ADDED,
      description: `Note added`,
      metadata: { note: content },
    });

    return updated;
  }

  async scheduleFollowUp(leadId, { scheduledAt, notes }, userId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const followUp = await followUpRepository.create({
      leadId: lead._id,
      scheduledAt: new Date(scheduledAt),
      notes,
      createdBy: userId,
    });

    await leadRepository.updateById(leadId, { nextFollowUpAt: new Date(scheduledAt) });

    await leadActivityRepository.create({
      leadId: lead._id,
      userId,
      action: ACTIVITY_TYPES.FOLLOW_UP_SCHEDULED,
      description: `Follow-up scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      metadata: { scheduledAt, notes },
    });

    return followUp;
  }

  async getLeadTimeline(leadId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });

    const [activities, followUps] = await Promise.all([
      leadActivityRepository.findByLeadId(lead._id),
      followUpRepository.findByLeadId(lead._id),
    ]);

    return { activities, followUps };
  }

  async deleteLead(leadId, userId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
    await leadRepository.deleteById(leadId);

    auditService.log({
      userId,
      action: 'LEAD_DELETED',
      resource: 'Lead',
      resourceId: lead.leadId,
    });

    return lead;
  }

  async getLeadsForExport(filter = {}) {
    return leadRepository.findForExport(filter);
  }
}

module.exports = new LeadService();
