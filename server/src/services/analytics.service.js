const leadRepository = require('../repositories/lead.repository');
const { LEAD_STATUS_VALUES } = require('../constants/leadStatus');

class AnalyticsService {
  async getOverview() {
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      total, newLeads, contacted, qualified, siteVisitScheduled, siteVisitCompleted,
      converted, lost, today, thisWeek, thisMonth,
    ] = await Promise.all([
      leadRepository.countByFilter({}),
      leadRepository.countByFilter({ status: 'NEW' }),
      leadRepository.countByFilter({ status: 'CONTACTED' }),
      leadRepository.countByFilter({ status: 'QUALIFIED' }),
      leadRepository.countByFilter({ status: 'SITE_VISIT_SCHEDULED' }),
      leadRepository.countByFilter({ status: 'SITE_VISIT_COMPLETED' }),
      leadRepository.countByFilter({ status: 'CONVERTED' }),
      leadRepository.countByFilter({ status: 'LOST' }),
      leadRepository.countByFilter({ createdAt: { $gte: startOfDay } }),
      leadRepository.countByFilter({ createdAt: { $gte: startOfWeek } }),
      leadRepository.countByFilter({ createdAt: { $gte: startOfMonth } }),
    ]);

    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
    const contactRate = total > 0 ? (((contacted + qualified + siteVisitScheduled + siteVisitCompleted + converted) / total) * 100).toFixed(1) : 0;
    const siteVisitRate = total > 0 ? (((siteVisitScheduled + siteVisitCompleted + converted) / total) * 100).toFixed(1) : 0;

    return {
      totals: { total, newLeads, contacted, qualified, siteVisitScheduled, siteVisitCompleted, converted, lost },
      periods: { today, thisWeek, thisMonth },
      rates: { conversionRate: parseFloat(conversionRate), contactRate: parseFloat(contactRate), siteVisitRate: parseFloat(siteVisitRate) },
    };
  }

  async getLeadsByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const pipeline = [
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ];
    return leadRepository.aggregatePipeline(pipeline);
  }

  async getLeadsBySource() {
    const pipeline = [
      {
        $group: {
          _id: { $ifNull: ['$source', 'direct'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { source: '$_id', count: 1, _id: 0 } },
    ];
    return leadRepository.aggregatePipeline(pipeline);
  }

  async getLeadsByCampaign() {
    const pipeline = [
      { $match: { campaign: { $ne: null, $exists: true } } },
      { $group: { _id: '$campaign', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { campaign: '$_id', count: 1, _id: 0 } },
    ];
    return leadRepository.aggregatePipeline(pipeline);
  }

  async getLeadsByCity() {
    const pipeline = [
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
      { $project: { city: '$_id', count: 1, _id: 0 } },
    ];
    return leadRepository.aggregatePipeline(pipeline);
  }

  async getLeadsByConfiguration() {
    const pipeline = [
      {
        $group: {
          _id: { $ifNull: ['$preferredConfiguration', 'NOT_SURE'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { configuration: '$_id', count: 1, _id: 0 } },
    ];
    return leadRepository.aggregatePipeline(pipeline);
  }

  async getConversionFunnel() {
    const funnelStages = [
      { key: 'total', label: 'All Leads', filter: {} },
      { key: 'contacted', label: 'Contacted', filter: { status: { $in: ['CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATION', 'CONVERTED'] } } },
      { key: 'qualified', label: 'Qualified', filter: { status: { $in: ['QUALIFIED', 'SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATION', 'CONVERTED'] } } },
      { key: 'siteVisit', label: 'Site Visit', filter: { status: { $in: ['SITE_VISIT_SCHEDULED', 'SITE_VISIT_COMPLETED', 'NEGOTIATION', 'CONVERTED'] } } },
      { key: 'converted', label: 'Converted', filter: { status: 'CONVERTED' } },
    ];

    const results = await Promise.all(funnelStages.map((s) => leadRepository.countByFilter(s.filter)));
    return funnelStages.map((s, i) => ({
      key: s.key,
      label: s.label,
      count: results[i],
      percentage: results[0] > 0 ? parseFloat(((results[i] / results[0]) * 100).toFixed(1)) : 0,
    }));
  }

  async getLeadsByStatus() {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { status: '$_id', count: 1, _id: 0 } },
    ];
    return leadRepository.aggregatePipeline(pipeline);
  }
}

module.exports = new AnalyticsService();
