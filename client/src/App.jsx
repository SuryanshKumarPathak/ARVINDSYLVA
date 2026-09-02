import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { initTracking, trackPageView } from './utils/tracking';

// ─── Public pages (eager loaded for fast LCP) ──────────────────────────────
import LandingPage from './pages/LandingPage';
import ThankYou from './pages/ThankYou';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// ─── Admin pages (lazy loaded) ─────────────────────────────────────────────
const AdminLogin = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const AdminLeads = lazy(() => import('./pages/admin/LeadsPage'));
const AdminLeadDetail = lazy(() => import('./pages/admin/LeadDetailPage'));
const AdminAnalytics = lazy(() => import('./pages/admin/AnalyticsPage'));
const AdminUsers = lazy(() => import('./pages/admin/AdminsPage'));
const AdminFollowUps = lazy(() => import('./pages/admin/FollowUpsPage'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// ─── Loading fallback ──────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen bg-stone-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-stone-500">Loading…</p>
    </div>
  </div>
);

// ─── Protected admin route ─────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

// ─── Route tracker ─────────────────────────────────────────────────────────
const RouteTracker = () => {
  useEffect(() => {
    initTracking();
    trackPageView(window.location.pathname);
  }, []);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <RouteTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="leads/:id" element={<AdminLeadDetail />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="follow-ups" element={<AdminFollowUps />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
