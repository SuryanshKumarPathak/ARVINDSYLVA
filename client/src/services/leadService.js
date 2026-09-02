import api from './api';

export const submitLead = (data) => api.post('/leads', data);

export const getLeads = (params) => api.get('/leads', { params });

export const getLeadById = (id) => api.get(`/leads/${id}`);

export const updateLeadStatus = (id, status) =>
  api.patch(`/leads/${id}/status`, { status });

export const updateLeadPriority = (id, priority) =>
  api.patch(`/leads/${id}/priority`, { priority });

export const assignLead = (id, assignedTo) =>
  api.patch(`/leads/${id}/assign`, { assignedTo });

export const addNote = (id, content) =>
  api.post(`/leads/${id}/notes`, { content });

export const scheduleFollowUp = (id, data) =>
  api.post(`/leads/${id}/follow-up`, data);

export const deleteLead = (id) => api.delete(`/leads/${id}`);

// Browser download – returns raw file content
export const exportLeads = (params) =>
  api.get('/leads/export', {
    params,
    responseType: params.format === 'excel' ? 'arraybuffer' : 'text',
  });

// Email export – generates Excel on server and emails it to configured recipient
// Returns: { success, message, data: { totalLeads, recipient, filename } }
export const emailExportLeads = (params = {}) =>
  api.post('/leads/export/email', params);
