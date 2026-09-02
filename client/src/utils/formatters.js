export const formatDate = (date, options = {}) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', ...options,
  });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata',
  });
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const formatPhone = (phone) => {
  if (!phone) return '—';
  const p = String(phone).replace(/\D/g, '');
  if (p.length === 10) return `+91 ${p.slice(0,5)} ${p.slice(5)}`;
  return phone;
};

export const getStatusColor = (status) => {
  const colors = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-purple-100 text-purple-800',
    SITE_VISIT_SCHEDULED: 'bg-indigo-100 text-indigo-800',
    SITE_VISIT_COMPLETED: 'bg-cyan-100 text-cyan-800',
    NEGOTIATION: 'bg-orange-100 text-orange-800',
    CONVERTED: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
    INVALID: 'bg-stone-100 text-stone-600',
  };
  return colors[status] || 'bg-stone-100 text-stone-600';
};

export const getPriorityColor = (priority) => {
  const colors = {
    HIGH: 'bg-red-100 text-red-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-green-100 text-green-700',
  };
  return colors[priority] || 'bg-stone-100 text-stone-600';
};

export const formatStatusLabel = (status) => {
  const labels = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUALIFIED: 'Qualified',
    SITE_VISIT_SCHEDULED: 'Visit Scheduled',
    SITE_VISIT_COMPLETED: 'Visit Done',
    NEGOTIATION: 'Negotiation',
    CONVERTED: 'Converted',
    LOST: 'Lost',
    INVALID: 'Invalid',
  };
  return labels[status] || status;
};

export const downloadFile = (data, filename, mimeType) => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
