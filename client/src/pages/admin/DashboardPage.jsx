import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, Calendar, CheckCircle2,
  Clock, Star, ArrowUpRight, Loader2,
} from 'lucide-react';
import { getOverview } from '../../services/analyticsService';
import { getLeads } from '../../services/leadService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-purple-100 text-purple-700',
  SITE_VISIT_SCHEDULED: 'bg-orange-100 text-orange-700',
  SITE_VISIT_COMPLETED: 'bg-teal-100 text-teal-700',
  CONVERTED: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
  NOT_INTERESTED: 'bg-stone-100 text-stone-600',
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-stone-800">{value ?? '—'}</div>
      <p className="text-sm font-medium text-stone-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ovRes, leadsRes] = await Promise.all([
          getOverview(),
          getLeads({ limit: 8, sort: 'createdAt', order: 'desc' }),
        ]);
        setOverview(ovRes.data.data);
        setRecentLeads(leadsRes.data.data || []);
      } catch {
        // handle silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  const { totals, periods, rates } = overview || {};

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Welcome back, <span className="font-medium text-forest-700">{user?.name}</span>
          </p>
        </div>
        <Link to="/admin/leads" className="btn-primary text-sm py-2 px-4 gap-1.5">
          <Users className="w-4 h-4" /> All Leads
        </Link>
      </div>

      {/* Period cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={TrendingUp}
          label="Total Leads"
          value={totals?.total}
          sub="All time"
          color="bg-forest-100 text-forest-700"
        />
        <StatCard
          icon={Clock}
          label="Today"
          value={periods?.today}
          sub="New leads today"
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          icon={Calendar}
          label="This Week"
          value={periods?.thisWeek}
          sub="Last 7 days"
          color="bg-purple-100 text-purple-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Converted"
          value={totals?.converted}
          sub={`${rates?.conversionRate ?? 0}% rate`}
          color="bg-green-100 text-green-700"
        />
      </div>

      {/* Status breakdown + recent leads */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <div className="admin-card p-5">
          <h2 className="font-semibold text-stone-700 mb-4">Lead Pipeline</h2>
          <div className="space-y-3">
            {[
              { label: 'New', value: totals?.newLeads, color: 'bg-blue-500' },
              { label: 'Contacted', value: totals?.contacted, color: 'bg-yellow-500' },
              { label: 'Qualified', value: totals?.qualified, color: 'bg-purple-500' },
              { label: 'Site Visit Scheduled', value: totals?.siteVisitScheduled, color: 'bg-orange-500' },
              { label: 'Site Visit Done', value: totals?.siteVisitCompleted, color: 'bg-teal-500' },
              { label: 'Converted', value: totals?.converted, color: 'bg-green-500' },
              { label: 'Lost', value: totals?.lost, color: 'bg-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                <span className="text-sm text-stone-600 flex-1">{label}</span>
                <span className="text-sm font-semibold text-stone-800">{value ?? 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent leads */}
        <div className="admin-card lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-700">Recent Leads</h2>
            <Link
              to="/admin/leads"
              className="text-xs text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">No leads yet.</p>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead._id}
                  to={`/admin/leads/${lead._id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 text-sm font-bold flex-shrink-0">
                    {lead.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{lead.fullName}</p>
                    <p className="text-xs text-stone-400">{lead.phone} · {lead.city || '—'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`badge text-xs ${STATUS_COLORS[lead.status] || 'bg-stone-100 text-stone-600'}`}>
                      {lead.status?.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-stone-400">{formatDate(lead.createdAt)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
