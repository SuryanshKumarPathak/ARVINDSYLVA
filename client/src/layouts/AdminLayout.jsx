import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BarChart2, Calendar,
  LogOut, Menu, X, ChevronRight, Bell,
} from 'lucide-react';
import { useState } from 'react';

const NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Leads', to: '/admin/leads', icon: Users },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart2 },
  { label: 'Follow-Ups', to: '/admin/follow-ups', icon: Calendar },
];

const ADMIN_NAV = [
  { label: 'Admins', to: '/admin/users', icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-stone-100">
        <div className="font-display text-xl font-bold text-forest-900">
          ARVIND <span className="text-gold-500">SYLVA</span>
        </div>
        <div className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">
          Admin CRM
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
          <>
            <div className="pt-4 pb-2">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 px-4 font-semibold">
                Management
              </p>
            </div>
            {ADMIN_NAV.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User info */}
      <div className="px-3 py-4 border-t border-stone-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-800 truncate">{user?.name}</p>
            <p className="text-xs text-stone-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          id="admin-logout"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-stone-200 fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-forest-950/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-60 bg-white flex flex-col shadow-luxury-lg">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-stone-500 hover:text-stone-800 p-1"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:flex items-center gap-1 text-sm text-stone-400">
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-600 font-medium">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-forest-700 hover:text-forest-900 font-medium hidden sm:block"
            >
              View Site ↗
            </a>
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
