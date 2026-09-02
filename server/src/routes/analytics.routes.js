const express = require('express');
const router = express.Router();
const {
  getOverview, getLeadsByDay, getLeadsBySource, getLeadsByCampaign,
  getConversionFunnel, getLeadsByCity, getLeadsByConfiguration, getLeadsByStatus,
} = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizePermission } = require('../middleware/authorize.middleware');
const { PERMISSIONS } = require('../constants/roles');

router.use(authenticate, authorizePermission(PERMISSIONS.VIEW_ANALYTICS));

router.get('/overview', getOverview);
router.get('/leads', getLeadsByDay);
router.get('/sources', getLeadsBySource);
router.get('/campaigns', getLeadsByCampaign);
router.get('/funnel', getConversionFunnel);
router.get('/cities', getLeadsByCity);
router.get('/configurations', getLeadsByConfiguration);
router.get('/status', getLeadsByStatus);

module.exports = router;
