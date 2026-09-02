const leadService = require('../services/lead.service');
const exportService = require('../services/export.service');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseUtils');
const auditService = require('../services/audit.service');

const createLead = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const lead = await leadService.createLead(req.body, { ip, userAgent });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Thank you for your interest in Arvind Sylva. Our team will contact you shortly.',
      data: { leadId: lead.leadId },
    });
  } catch (err) {
    next(err);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, search, status, priority, source, campaign,
      city, state, assignedTo, startDate, endDate, sort = 'createdAt', order = 'desc',
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;
    if (campaign) filter.campaign = campaign;
    if (city) filter.city = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (state) filter.state = new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (assignedTo) filter.assignedTo = assignedTo;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) { const end = new Date(endDate); end.setHours(23, 59, 59, 999); filter.createdAt.$lte = end; }
    }

    // Sales executives only see assigned leads
    if (req.user.role === 'SALES_EXECUTIVE') {
      filter.assignedTo = req.user.userId;
    }

    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const { data, total } = await leadService.getLeads({
      filter, page: parseInt(page), limit: parseInt(limit), sort: sortObj, search,
    });

    return sendPaginated(res, { data, page: parseInt(page), limit: parseInt(limit), total });
  } catch (err) {
    next(err);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);

    // Sales executives can only view assigned leads
    if (req.user.role === 'SALES_EXECUTIVE' && String(lead.assignedTo?._id) !== String(req.user.userId)) {
      return sendError(res, { statusCode: 403, message: 'Access denied.' });
    }

    const { activities, followUps } = await leadService.getLeadTimeline(req.params.id);
    return sendSuccess(res, { data: { lead, activities, followUps } });
  } catch (err) {
    next(err);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const lead = await leadService.updateLeadStatus(req.params.id, req.body.status, req.user.userId);
    auditService.log({ userId: req.user.userId, userEmail: req.user.email, action: 'STATUS_CHANGED', resource: 'Lead', resourceId: lead.leadId, details: { status: req.body.status }, ipAddress: req.ip });
    return sendSuccess(res, { message: 'Lead status updated', data: { lead } });
  } catch (err) {
    next(err);
  }
};

const updateLeadPriority = async (req, res, next) => {
  try {
    const lead = await leadService.updateLeadPriority(req.params.id, req.body.priority, req.user.userId);
    return sendSuccess(res, { message: 'Lead priority updated', data: { lead } });
  } catch (err) {
    next(err);
  }
};

const assignLead = async (req, res, next) => {
  try {
    const lead = await leadService.assignLead(req.params.id, req.body.assignedTo, req.user.userId);
    auditService.log({ userId: req.user.userId, userEmail: req.user.email, action: 'LEAD_ASSIGNED', resource: 'Lead', resourceId: lead.leadId, details: { assignedTo: req.body.assignedTo }, ipAddress: req.ip });
    return sendSuccess(res, { message: 'Lead assigned', data: { lead } });
  } catch (err) {
    next(err);
  }
};

const addNote = async (req, res, next) => {
  try {
    const lead = await leadService.addNote(req.params.id, req.body.content, req.user.userId);
    return sendSuccess(res, { message: 'Note added', data: { lead } });
  } catch (err) {
    next(err);
  }
};

const scheduleFollowUp = async (req, res, next) => {
  try {
    const followUp = await leadService.scheduleFollowUp(req.params.id, req.body, req.user.userId);
    return sendSuccess(res, { statusCode: 201, message: 'Follow-up scheduled', data: { followUp } });
  } catch (err) {
    next(err);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    await leadService.deleteLead(req.params.id, req.user.userId);
    return sendSuccess(res, { message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const exportLeads = async (req, res, next) => {
  try {
    const { format = 'csv', ...filterParams } = req.query;

    auditService.log({
      userId: req.user.userId, userEmail: req.user.email,
      action: 'EXPORT_GENERATED', resource: 'Lead',
      details: { format, filterParams }, ipAddress: req.ip,
    });

    if (format === 'excel') {
      const { buffer, count } = await exportService.exportToExcel(filterParams);
      const filename = `arvind-sylva-leads-${new Date().toISOString().slice(0, 10)}.xlsx`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('X-Total-Count', count);
      return res.send(buffer);
    }

    // Default CSV
    const { content, count } = await exportService.exportToCSV(filterParams);
    const filename = `arvind-sylva-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('X-Total-Count', count);
    return res.send(content);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLead, getLeads, getLeadById, updateLeadStatus, updateLeadPriority,
  assignLead, addNote, scheduleFollowUp, deleteLead, exportLeads,
};
