const { createObjectCsvStringifier } = require('csv-writer');
const leadRepository = require('../repositories/lead.repository');
const logger = require('../config/logger');

class ExportService {
  buildFilter({ status, source, campaign, startDate, endDate, city, state, assignedTo } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (campaign) filter.campaign = campaign;
    if (city) filter.city = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (assignedTo) filter.assignedTo = assignedTo;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) { const end = new Date(endDate); end.setHours(23, 59, 59, 999); filter.createdAt.$lte = end; }
    }
    return filter;
  }

  async exportToCSV(filterParams = {}) {
    const filter = this.buildFilter(filterParams);
    const leads = await leadRepository.findForExport(filter);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'leadId', title: 'Lead ID' },
        { id: 'fullName', title: 'Full Name' },
        { id: 'phone', title: 'Phone' },
        { id: 'email', title: 'Email' },
        { id: 'city', title: 'City' },
        { id: 'state', title: 'State' },
        { id: 'preferredConfiguration', title: 'Configuration' },
        { id: 'preferredContactTime', title: 'Contact Time' },
        { id: 'status', title: 'Status' },
        { id: 'priority', title: 'Priority' },
        { id: 'source', title: 'Source' },
        { id: 'medium', title: 'Medium' },
        { id: 'campaign', title: 'Campaign' },
        { id: 'gclid', title: 'GCLID' },
        { id: 'fbclid', title: 'FBCLID' },
        { id: 'deviceType', title: 'Device' },
        { id: 'assignedTo', title: 'Assigned To' },
        { id: 'lastContactedAt', title: 'Last Contacted' },
        { id: 'nextFollowUpAt', title: 'Next Follow-up' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'message', title: 'Message' },
      ],
    });

    const records = leads.map((l) => ({
      leadId: l.leadId || '',
      fullName: l.fullName || '',
      phone: l.phone || '',
      email: l.email || '',
      city: l.city || '',
      state: l.state || '',
      preferredConfiguration: l.preferredConfiguration || '',
      preferredContactTime: l.preferredContactTime || '',
      status: l.status || '',
      priority: l.priority || '',
      source: l.source || '',
      medium: l.medium || '',
      campaign: l.campaign || '',
      gclid: l.gclid || '',
      fbclid: l.fbclid || '',
      deviceType: l.deviceType || '',
      assignedTo: l.assignedTo?.name || '',
      lastContactedAt: l.lastContactedAt ? new Date(l.lastContactedAt).toISOString() : '',
      nextFollowUpAt: l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toISOString() : '',
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : '',
      message: (l.message || '').replace(/\n/g, ' '),
    }));

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    logger.info(`CSV export: ${leads.length} leads exported`);
    return { content: csvContent, count: leads.length };
  }

  async exportToExcel(filterParams = {}) {
    const excel4node = require('excel4node');
    const filter = this.buildFilter(filterParams);
    const leads = await leadRepository.findForExport(filter);

    const wb = new excel4node.Workbook();
    const ws = wb.addWorksheet('Arvind Sylva Leads');

    const headerStyle = wb.createStyle({
      font: { bold: true, color: '#FFFFFF', size: 11 },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#1a3a2a' },
      alignment: { horizontal: 'center' },
    });

    const headers = [
      'Lead ID', 'Full Name', 'Phone', 'Email', 'City', 'State',
      'Configuration', 'Contact Time', 'Status', 'Priority',
      'Source', 'Medium', 'Campaign', 'GCLID', 'FBCLID',
      'Device', 'Assigned To', 'Last Contacted', 'Next Follow-up', 'Created At', 'Message',
    ];

    headers.forEach((h, i) => {
      ws.cell(1, i + 1).string(h).style(headerStyle);
      ws.column(i + 1).setWidth(18);
    });

    leads.forEach((l, rowIdx) => {
      const row = rowIdx + 2;
      const values = [
        l.leadId || '', l.fullName || '', l.phone || '', l.email || '',
        l.city || '', l.state || '', l.preferredConfiguration || '',
        l.preferredContactTime || '', l.status || '', l.priority || '',
        l.source || '', l.medium || '', l.campaign || '',
        l.gclid || '', l.fbclid || '', l.deviceType || '',
        l.assignedTo?.name || '',
        l.lastContactedAt ? new Date(l.lastContactedAt).toLocaleString('en-IN') : '',
        l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toLocaleString('en-IN') : '',
        l.createdAt ? new Date(l.createdAt).toLocaleString('en-IN') : '',
        l.message || '',
      ];
      values.forEach((v, colIdx) => ws.cell(row, colIdx + 1).string(String(v)));
    });

    const buffer = await wb.writeToBuffer();
    logger.info(`Excel export: ${leads.length} leads exported`);
    return { buffer, count: leads.length };
  }
}

module.exports = new ExportService();
