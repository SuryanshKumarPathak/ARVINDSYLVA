import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { login as apiLogin } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await apiLogin(email, password);
      login(res.data.data.user);
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="font-display text-4xl font-bold text-white mb-1">
            ARVIND <span className="text-gold-400">SYLVA</span>
          </div>
          <p className="text-white/40 text-sm tracking-widest uppercase">Admin Portal</p>
        </div>

        <div className="bg-white rounded-sm shadow-luxury-lg overflow-hidden">
          <div className="bg-forest-800 px-6 py-4 flex items-center gap-3">
            <Lock className="w-5 h-5 text-gold-400" />
            <h1 className="font-display text-lg font-semibold text-white">Sign In to CRM</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="label">Email Address</label>
              <input
                id="admin-email"
                type="email"
                placeholder="admin@arvindsylva.com"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="admin-password" className="label">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-70"
              id="admin-login-submit"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Arvind Sylva. Authorised personnel only.
        </p>
      </div>
    </div>
  );
}
