const analyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../utils/responseUtils');

const getOverview = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getLeadsByDay = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const data = await analyticsService.getLeadsByDay(parseInt(days));
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getLeadsBySource = async (req, res, next) => {
  try {
    const data = await analyticsService.getLeadsBySource();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getLeadsByCampaign = async (req, res, next) => {
  try {
    const data = await analyticsService.getLeadsByCampaign();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getConversionFunnel = async (req, res, next) => {
  try {
    const data = await analyticsService.getConversionFunnel();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getLeadsByCity = async (req, res, next) => {
  try {
    const data = await analyticsService.getLeadsByCity();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getLeadsByConfiguration = async (req, res, next) => {
  try {
    const data = await analyticsService.getLeadsByConfiguration();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

const getLeadsByStatus = async (req, res, next) => {
  try {
    const data = await analyticsService.getLeadsByStatus();
    return sendSuccess(res, { data });
  } catch (err) { next(err); }
};

module.exports = {
  getOverview, getLeadsByDay, getLeadsBySource, getLeadsByCampaign,
  getConversionFunnel, getLeadsByCity, getLeadsByConfiguration, getLeadsByStatus,
};
