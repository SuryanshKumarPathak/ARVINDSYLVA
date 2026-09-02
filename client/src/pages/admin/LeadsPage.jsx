import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Download, ChevronLeft, ChevronRight,
  Loader2, Mail, FileSpreadsheet,
} from 'lucide-react';
import { getLeads, exportLeads, emailExportLeads } from '../../services/leadService';
import { useToast } from '../../context/ToastContext';
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

const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-stone-100 text-stone-500',
};

const STATUS_OPTIONS = [
  '', 'NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT_SCHEDULED',
  'SITE_VISIT_COMPLETED', 'CONVERTED', 'LOST', 'NOT_INTERESTED',
];

// Roles that can export
const EXPORT_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'];

export default function LeadsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const limit = 20;
  const totalPages = Math.ceil(total / limit);
  const canExport = user && EXPORT_ROLES.includes(user.role);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeads({ page, limit, search, status: statusFilter || undefined });
      setLeads(res.data.data || []);
      setTotal(res.data.meta?.total || res.data.pagination?.total || 0);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // Browser download (CSV / Excel)
  const handleDownload = async (format) => {
    setDownloading(true);
    try {
      const res = await exportLeads({ format, status: statusFilter || undefined });
      const blob = new Blob(
        [res.data],
        { type: format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arvind-sylva-leads-${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded successfully!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Email export – generates Excel on server and emails it
  const handleEmailExport = async () => {
    setEmailing(true);
    try {
      const res = await emailExportLeads({ status: statusFilter || undefined });
      const { totalLeads, recipient } = res.data.data || {};
      toast.success(
        `✅ ${totalLeads || ''} leads exported and sent to ${recipient || 'configured email'} successfully!`
      );
    } catch (err) {
      const msg = err?.response?.data?.message || '';
      if (msg.includes('generated') && msg.includes('email')) {
        // Excel generated but email failed
        toast.error('Excel generated, but email delivery failed. Check SMTP configuration.');
      } else {
        toast.error('Export failed. Please try again.');
      }
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Leads</h1>
          <p className="text-stone-500 text-sm mt-0.5">{total} total leads</p>
        </div>

        {canExport && (
          <div className="flex flex-wrap gap-2">
            {/* Browser download buttons */}
            <button
              onClick={() => handleDownload('csv')}
              disabled={downloading || emailing}
              className="btn-secondary text-sm py-2 px-3 gap-1.5"
              id="export-csv"
              title="Download CSV to browser"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Exporting…' : 'CSV'}
            </button>
            <button
              onClick={() => handleDownload('excel')}
              disabled={downloading || emailing}
              className="btn-secondary text-sm py-2 px-3 gap-1.5"
              id="export-excel"
              title="Download Excel to browser"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>

            {/* Email Export – primary CTA */}
            <button
              onClick={handleEmailExport}
              disabled={emailing || downloading}
              className="btn-primary text-sm py-2 px-4 gap-1.5"
              id="email-export-leads"
              title="Generate Excel and send to business email"
            >
              {emailing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</>
              ) : (
                <><Mail className="w-4 h-4" /> Export All Leads</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="admin-card p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search name, phone, email…"
              className="input-field pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              id="leads-search"
            />
          </div>
          <button type="submit" className="btn-primary text-sm py-2 px-4">Search</button>
        </form>
        <div className="flex gap-2">
          <select
            className="input-field text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            id="leads-status-filter"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Phone</th>
                <th className="table-header hidden md:table-cell">City</th>
                <th className="table-header hidden md:table-cell">Config</th>
                <th className="table-header hidden lg:table-cell">Source</th>
                <th className="table-header">Status</th>
                <th className="table-header hidden sm:table-cell">Priority</th>
                <th className="table-header hidden md:table-cell">Date</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-forest-700 mx-auto" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-stone-400 text-sm">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-stone-50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 text-xs font-bold flex-shrink-0">
                          {lead.fullName?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-stone-800">{lead.fullName}</span>
                      </div>
                    </td>
                    <td className="table-cell">{lead.phone}</td>
                    <td className="table-cell hidden md:table-cell">{lead.city || '—'}</td>
                    <td className="table-cell hidden md:table-cell">{lead.preferredConfiguration || '—'}</td>
                    <td className="table-cell hidden lg:table-cell capitalize">{lead.source || '—'}</td>
                    <td className="table-cell">
                      <span className={`badge ${STATUS_COLORS[lead.status] || 'bg-stone-100 text-stone-600'}`}>
                        {lead.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="table-cell hidden sm:table-cell">
                      <span className={`badge ${PRIORITY_COLORS[lead.priority] || 'bg-stone-100 text-stone-500'}`}>
                        {lead.priority || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="table-cell hidden md:table-cell text-stone-400">{formatDate(lead.createdAt)}</td>
                    <td className="table-cell">
                      <Link
                        to={`/admin/leads/${lead._id}`}
                        className="text-forest-700 hover:text-forest-900 text-xs font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-stone-100 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-stone-400">
              Page {page} of {totalPages} · {total} leads
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-md hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-md hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
