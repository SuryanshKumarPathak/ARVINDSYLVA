const userRepository = require('../repositories/user.repository');
const followUpRepository = require('../repositories/followUp.repository');
const { sendSuccess, sendPaginated } = require('../utils/responseUtils');
const auditService = require('../services/audit.service');
const { ROLES } = require('../constants/roles');

const getAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { data, total } = await userRepository.findAll({ page: parseInt(page), limit: parseInt(limit) });
    return sendPaginated(res, { data, page, limit, total });
  } catch (err) { next(err); }
};

const createAdmin = async (req, res, next) => {
  try {
    const user = await userRepository.create({ ...req.body, createdBy: req.user.userId, mustChangePassword: true });
    auditService.log({ userId: req.user.userId, userEmail: req.user.email, action: 'ADMIN_CREATED', resource: 'User', resourceId: user._id, ipAddress: req.ip });
    return sendSuccess(res, { statusCode: 201, message: 'Admin user created', data: { user } });
  } catch (err) { next(err); }
};

const updateAdmin = async (req, res, next) => {
  try {
    // Prevent self-demotion
    if (String(req.params.id) === String(req.user.userId) && req.body.role && req.body.role !== req.user.role) {
      return sendSuccess(res, { statusCode: 400, message: 'You cannot change your own role.' });
    }
    const user = await userRepository.updateById(req.params.id, req.body);
    if (!user) return sendSuccess(res, { statusCode: 404, message: 'User not found.' });
    auditService.log({ userId: req.user.userId, userEmail: req.user.email, action: 'ADMIN_UPDATED', resource: 'User', resourceId: req.params.id, ipAddress: req.ip });
    return sendSuccess(res, { message: 'Admin updated', data: { user } });
  } catch (err) { next(err); }
};

const deleteAdmin = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.userId)) {
      return sendSuccess(res, { statusCode: 400, message: 'You cannot delete your own account.' });
    }
    await userRepository.deleteById(req.params.id);
    auditService.log({ userId: req.user.userId, userEmail: req.user.email, action: 'ADMIN_DELETED', resource: 'User', resourceId: req.params.id, ipAddress: req.ip });
    return sendSuccess(res, { message: 'Admin deleted' });
  } catch (err) { next(err); }
};

const getSalesUsers = async (req, res, next) => {
  try {
    const users = await userRepository.findAllSalesUsers();
    return sendSuccess(res, { data: { users } });
  } catch (err) { next(err); }
};

const getFollowUps = async (req, res, next) => {
  try {
    const userId = req.user.role === 'SALES_EXECUTIVE' ? req.user.userId : undefined;
    const [upcoming, overdue, today] = await Promise.all([
      followUpRepository.findUpcoming({ userId }),
      followUpRepository.findOverdue({ userId }),
      followUpRepository.findToday({ userId }),
    ]);
    return sendSuccess(res, { data: { upcoming, overdue, today } });
  } catch (err) { next(err); }
};

module.exports = { getAdmins, createAdmin, updateAdmin, deleteAdmin, getSalesUsers, getFollowUps };
