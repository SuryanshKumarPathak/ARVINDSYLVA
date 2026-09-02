import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Users, CheckCircle2, MapPin } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  getOverview, getLeadsByDay, getLeadsBySource,
  getLeadsByCampaign, getConversionFunnel, getLeadsByCity,
  getLeadsByConfiguration, getLeadsByStatus,
} from '../../services/analyticsService';
import { useToast } from '../../context/ToastContext';

const COLORS = ['#2e703c', '#c9941c', '#6b7280', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

function SectionCard({ title, children, className = '' }) {
  return (
    <div className={`admin-card p-5 ${className}`}>
      <h2 className="font-semibold text-stone-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [data, setData] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [overview, byDay, bySource, byCampaign, funnel, byCity, byConfig, byStatus] =
          await Promise.all([
            getOverview(),
            getLeadsByDay(days),
            getLeadsBySource(),
            getLeadsByCampaign(),
            getConversionFunnel(),
            getLeadsByCity(),
            getLeadsByConfiguration(),
            getLeadsByStatus(),
          ]);
        setData({
          overview: overview.data.data,
          byDay: byDay.data.data || [],
          bySource: bySource.data.data || [],
          byCampaign: byCampaign.data.data || [],
          funnel: funnel.data.data || [],
          byCity: byCity.data.data || [],
          byConfig: byConfig.data.data || [],
          byStatus: byStatus.data.data || [],
        });
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  const { totals, periods, rates } = data.overview || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-800">Analytics</h1>
        <select
          className="input-field text-sm w-36"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          id="analytics-days"
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: totals?.total, icon: Users, color: 'text-forest-700 bg-forest-50' },
          { label: 'This Month', value: periods?.thisMonth, icon: TrendingUp, color: 'text-blue-700 bg-blue-50' },
          { label: 'Converted', value: totals?.converted, icon: CheckCircle2, color: 'text-green-700 bg-green-50' },
          { label: 'Conversion Rate', value: `${rates?.conversionRate ?? 0}%`, icon: TrendingUp, color: 'text-gold-700 bg-gold-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="font-display text-3xl font-bold text-stone-800">{value ?? '—'}</div>
            <p className="text-sm text-stone-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Leads over time */}
      <SectionCard title={`Leads Over Last ${days} Days`} className="mb-6">
        {data.byDay?.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">No data for this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2e703c" strokeWidth={2} dot={false} name="Leads" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      {/* Source + Funnel */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Leads by Source">
          {data.bySource?.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.bySource}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ source, percent }) => `${source} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.bySource.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Conversion Funnel">
          {data.funnel?.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No data.</p>
          ) : (
            <div className="space-y-3">
              {data.funnel.map((stage) => (
                <div key={stage.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-stone-600">{stage.label}</span>
                    <span className="text-sm font-semibold text-stone-800">
                      {stage.count} <span className="text-stone-400 font-normal">({stage.percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest-600 rounded-full transition-all duration-700"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Config + City */}
      <div className="grid md:grid-cols-2 gap-6">
        <SectionCard title="Leads by Configuration">
          {data.byConfig?.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.byConfig}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="configuration" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#c9941c" name="Leads" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Top Cities">
          {data.byCity?.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No data.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {data.byCity.map((c, i) => (
                <div key={c.city || i} className="flex items-center gap-3">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <span className="text-sm text-stone-600 flex-1">{c.city || 'Unknown'}</span>
                  <span className="text-sm font-semibold text-stone-800">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
