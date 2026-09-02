import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, Tag,
  Loader2, Send, Clock, User, AlertCircle,
} from 'lucide-react';
import {
  getLeadById, updateLeadStatus, updateLeadPriority, addNote, scheduleFollowUp,
} from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatDateTime } from '../../utils/formatters';

const STATUS_OPTIONS = [
  'NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED',
  'SITE_VISIT_COMPLETED', 'NEGOTIATION', 'CONVERTED', 'LOST', 'NOT_INTERESTED',
];

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  QUALIFIED: 'bg-purple-100 text-purple-700 border-purple-200',
  SITE_VISIT_SCHEDULED: 'bg-orange-100 text-orange-700 border-orange-200',
  SITE_VISIT_COMPLETED: 'bg-teal-100 text-teal-700 border-teal-200',
  CONVERTED: 'bg-green-100 text-green-700 border-green-200',
  LOST: 'bg-red-100 text-red-700 border-red-200',
  NOT_INTERESTED: 'bg-stone-100 text-stone-600 border-stone-200',
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');
  const [schedulingFU, setSchedulingFU] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getLeadById(id);
      setData(res.data.data);
    } catch {
      toast.error('Lead not found');
      navigate('/admin/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleStatusChange = async (status) => {
    try {
      await updateLeadStatus(id, status);
      setData((d) => ({ ...d, lead: { ...d.lead, status } }));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handlePriorityChange = async (priority) => {
    try {
      await updateLeadPriority(id, priority);
      setData((d) => ({ ...d, lead: { ...d.lead, priority } }));
      toast.success('Priority updated');
    } catch {
      toast.error('Failed to update priority');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      await addNote(id, noteText.trim());
      setNoteText('');
      toast.success('Note added');
      fetchData();
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!followUpDate) return;
    setSchedulingFU(true);
    try {
      await scheduleFollowUp(id, { scheduledAt: followUpDate, note: followUpNote });
      setFollowUpDate('');
      setFollowUpNote('');
      toast.success('Follow-up scheduled');
      fetchData();
    } catch {
      toast.error('Failed to schedule follow-up');
    } finally {
      setSchedulingFU(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  const { lead, activities = [], followUps = [] } = data || {};

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/leads"
          className="text-stone-500 hover:text-stone-800 p-1 rounded-md hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">{lead?.name}</h1>
          <p className="text-stone-400 text-sm">Lead ID: {lead?.leadId}</p>
        </div>
        <span
          className={`ml-auto badge border ${STATUS_COLORS[lead?.status] || 'bg-stone-100 text-stone-600 border-stone-200'}`}
        >
          {lead?.status?.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-700 mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Phone, label: 'Phone', value: lead?.phone, href: `tel:${lead?.phone}` },
                { icon: Mail, label: 'Email', value: lead?.email || '—', href: lead?.email ? `mailto:${lead?.email}` : null },
                { icon: MapPin, label: 'City', value: lead?.city || '—' },
                { icon: Tag, label: 'Configuration', value: lead?.preferredConfiguration || '—' },
                { icon: User, label: 'Source', value: lead?.source || '—' },
                { icon: Calendar, label: 'Date', value: formatDateTime(lead?.createdAt) },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-stone-400">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-forest-700 hover:text-forest-900">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-stone-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {lead?.message && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-400 mb-1">Message</p>
                <p className="text-sm text-stone-600 italic">"{lead.message}"</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-700 mb-4">Notes</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {(lead?.notes || []).length === 0 ? (
                <p className="text-sm text-stone-400">No notes yet.</p>
              ) : (
                lead.notes.map((note, i) => (
                  <div key={i} className="bg-stone-50 rounded-md p-3">
                    <p className="text-sm text-stone-700">{note.content}</p>
                    <p className="text-xs text-stone-400 mt-1">{formatDateTime(note.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <textarea
                rows={2}
                placeholder="Add a note…"
                className="input-field flex-1 resize-none text-sm"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                id="lead-note-input"
              />
              <button
                onClick={handleAddNote}
                disabled={addingNote || !noteText.trim()}
                className="btn-primary px-3 py-2 self-end disabled:opacity-50"
                id="lead-note-submit"
              >
                {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-700 mb-4">Activity Timeline</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-sm text-stone-400">No activity yet.</p>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-forest-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-stone-700">{act.description}</p>
                      <p className="text-xs text-stone-400">{formatDateTime(act.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-700 mb-4">Update Status</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Status</label>
                <select
                  className="input-field text-sm"
                  value={lead?.status || ''}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  id="lead-status-select"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  className="input-field text-sm"
                  value={lead?.priority || 'LOW'}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  id="lead-priority-select"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Follow-up */}
          <div className="admin-card p-5">
            <h2 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-400" /> Schedule Follow-Up
            </h2>
            <div className="space-y-3">
              <div>
                <label className="label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="input-field text-sm"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  id="followup-date"
                />
              </div>
              <div>
                <label className="label">Note (optional)</label>
                <input
                  type="text"
                  placeholder="Reminder note…"
                  className="input-field text-sm"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  id="followup-note"
                />
              </div>
              <button
                onClick={handleScheduleFollowUp}
                disabled={schedulingFU || !followUpDate}
                className="btn-primary w-full text-sm py-2.5 disabled:opacity-50"
                id="followup-submit"
              >
                {schedulingFU ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule'}
              </button>
            </div>

            {followUps.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-stone-400 mb-2 font-medium">Upcoming Follow-Ups</p>
                {followUps.slice(0, 3).map((fu, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-stone-700">{formatDateTime(fu.scheduledAt)}</p>
                      {fu.note && <p className="text-xs text-stone-400">{fu.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
