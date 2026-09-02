import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Loader2, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

const STATUS_MAP = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: 'Done', color: 'bg-green-100 text-green-700' },
  MISSED: { label: 'Missed', color: 'bg-red-100 text-red-700' },
};

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/follow-ups', { params: { limit: 50, sort: 'scheduledAt', order: 'asc' } });
        setFollowUps(res.data.data || []);
      } catch {
        // fallback: empty list
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayFUs = followUps.filter((f) => {
    const d = new Date(f.scheduledAt);
    return d >= today && d < tomorrow;
  });
  const upcomingFUs = followUps.filter((f) => new Date(f.scheduledAt) >= tomorrow);
  const missedFUs = followUps.filter(
    (f) => new Date(f.scheduledAt) < today && f.status === 'PENDING'
  );

  const FUGroup = ({ title, items, emptyMsg, accent }) => (
    <div className="admin-card overflow-hidden mb-6">
      <div className={`px-5 py-3 border-b border-stone-100 flex items-center gap-2 ${accent}`}>
        <h2 className="font-semibold text-sm">{title}</h2>
        <span className="ml-auto text-xs font-medium opacity-70">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-6">{emptyMsg}</p>
      ) : (
        <div className="divide-y divide-stone-100">
          {items.map((fu, i) => (
            <Link
              key={fu._id || i}
              to={`/admin/leads/${fu.lead?._id || fu.leadId}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {fu.lead?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">{fu.lead?.name || 'Unknown'}</p>
                <p className="text-xs text-stone-400">{fu.lead?.phone}</p>
                {fu.note && <p className="text-xs text-stone-500 italic mt-0.5">"{fu.note}"</p>}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`badge text-xs ${STATUS_MAP[fu.status]?.color || 'bg-stone-100 text-stone-500'}`}>
                  {STATUS_MAP[fu.status]?.label || fu.status}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDateTime(fu.scheduledAt)}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-forest-700" />
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Follow-Ups</h1>
          <p className="text-stone-500 text-sm">{followUps.length} total scheduled</p>
        </div>
      </div>

      {missedFUs.length > 0 && (
        <FUGroup
          title="⚠️ Missed Follow-Ups"
          items={missedFUs}
          emptyMsg=""
          accent="bg-red-50 text-red-700"
        />
      )}

      <FUGroup
        title="📅 Today"
        items={todayFUs}
        emptyMsg="No follow-ups scheduled for today."
        accent="bg-forest-50 text-forest-700"
      />

      <FUGroup
        title="🗓️ Upcoming"
        items={upcomingFUs}
        emptyMsg="No upcoming follow-ups."
        accent="bg-stone-50 text-stone-600"
      />
    </div>
  );
}
