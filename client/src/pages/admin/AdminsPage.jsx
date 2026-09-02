import { useEffect, useState } from 'react';
import { Shield, Loader2, UserPlus, X, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'SALES_MANAGER', 'SALES_EXECUTIVE']),
});

const ROLE_COLORS = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-forest-100 text-forest-700',
  SALES_MANAGER: 'bg-blue-100 text-blue-700',
  SALES_EXECUTIVE: 'bg-stone-100 text-stone-600',
};

export default function AdminsPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(createSchema), defaultValues: { role: 'SALES_EXECUTIVE' } });

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/users');
      setAdmins(res.data.data || []);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/users', data);
      toast.success('Team member created successfully');
      reset();
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !isActive });
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}`);
      fetchAdmins();
    } catch {
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-forest-700" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-forest-700" />
          <div>
            <h1 className="font-display text-2xl font-bold text-stone-800">Team & Admins</h1>
            <p className="text-stone-500 text-sm">{admins.length} team members</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-primary text-sm py-2 px-4 gap-1.5"
          id="add-admin-btn"
        >
          {showForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="admin-card p-5 mb-6">
          <h2 className="font-semibold text-stone-700 mb-4">Create New Team Member</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4" noValidate>
            <div>
              <label className="label">Full Name</label>
              <input type="text" className={`input-field ${errors.name ? 'input-error' : ''}`} placeholder="Full name" {...register('name')} id="new-admin-name" />
              {errors.name && <p className="error-text">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className={`input-field ${errors.email ? 'input-error' : ''}`} placeholder="email@domain.com" {...register('email')} id="new-admin-email" />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className={`input-field ${errors.password ? 'input-error' : ''}`} placeholder="Min 8 characters" {...register('password')} id="new-admin-password" />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input-field" {...register('role')} id="new-admin-role">
                <option value="SALES_EXECUTIVE">Sales Executive</option>
                <option value="SALES_MANAGER">Sales Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={isSubmitting} className="btn-primary gap-2 disabled:opacity-70" id="new-admin-submit">
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Create Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins list */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header hidden sm:table-cell">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header hidden md:table-cell">Joined</th>
                <th className="table-header">Status</th>
                {currentUser?.role === 'SUPER_ADMIN' && <th className="table-header">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-stone-50">
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-forest-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {admin.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-stone-800">{admin.name}</span>
                    </div>
                  </td>
                  <td className="table-cell hidden sm:table-cell text-stone-500">{admin.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${ROLE_COLORS[admin.role] || 'bg-stone-100 text-stone-600'}`}>
                      {admin.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="table-cell hidden md:table-cell text-stone-400">{formatDate(admin.createdAt)}</td>
                  <td className="table-cell">
                    <span className={`badge ${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {currentUser?.role === 'SUPER_ADMIN' && admin._id !== currentUser?.userId && (
                    <td className="table-cell">
                      <button
                        onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                        className={`text-xs font-medium ${admin.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} transition-colors`}
                      >
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
