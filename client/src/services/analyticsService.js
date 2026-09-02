import api from './api';

export const getOverview = () => api.get('/analytics/overview');

export const getLeadsByDay = (days = 30) =>
  api.get('/analytics/leads', { params: { days } });

export const getLeadsBySource = () => api.get('/analytics/sources');

export const getLeadsByCampaign = () => api.get('/analytics/campaigns');

export const getConversionFunnel = () => api.get('/analytics/funnel');

export const getLeadsByCity = () => api.get('/analytics/cities');

export const getLeadsByConfiguration = () => api.get('/analytics/configurations');

export const getLeadsByStatus = () => api.get('/analytics/status');
