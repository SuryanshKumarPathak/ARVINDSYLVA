import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, CheckCircle2, Phone } from 'lucide-react';
import { submitLead } from '../../services/leadService';
import { trackLeadGenerated, trackFormStart } from '../../utils/tracking';
import { getAttributionForForm } from '../../utils/attribution';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name too long'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email too long')
    .optional()
    .or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100, 'City too long'),
  state: z.string().min(1, 'State is required').max(100, 'State too long'),
  preferredConfiguration: z.enum(['3BHK', '4BHK', 'NOT_SURE']).optional(),
  message: z.string().max(500).optional(),
});

const CONFIGS = ['3BHK', '4BHK', 'NOT_SURE'];
const CONFIG_LABELS = { '3BHK': '3 BHK', '4BHK': '4 BHK', NOT_SURE: 'Not Sure' };

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function LeadForm({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      preferredConfiguration: 'NOT_SURE',
      state: 'Karnataka',
    },
  });

  // Reset form state when modal closes/opens
  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setServerError('');
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const utm = getAttributionForForm();
      await submitLead({
        fullName: data.fullName,
        phone: data.phone.trim(),
        email: data.email || undefined,
        city: data.city,
        state: data.state,
        preferredConfiguration: data.preferredConfiguration || undefined,
        message: data.message || undefined,
        source: utm.utm_source || 'website',
        medium: utm.utm_medium || undefined,
        campaign: utm.utm_campaign || undefined,
        term: utm.utm_term || undefined,
        content: utm.utm_content || undefined,
        gclid: utm.gclid || undefined,
        fbclid: utm.fbclid || undefined,
        landingPage: window.location.href,
        referrer: document.referrer || undefined,
        consent: true,
        consentTimestamp: new Date().toISOString(),
      });
      trackLeadGenerated(data);
      setSubmitted(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setServerError(msg);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book a site visit"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-sm shadow-luxury-lg overflow-hidden animate-fade-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-forest-900 px-6 py-5 flex items-start justify-between sticky top-0 z-10">
          <div>
            <h2 className="font-display text-2xl text-white font-bold">Book a Site Visit</h2>
            <p className="text-white/60 text-sm mt-1">
              Our team will contact you within 24 hours.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors -mr-1 -mt-1 p-1"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-forest-900 mb-2">
              Thank You!
            </h3>
            <p className="text-stone-600 mb-6">
              We've received your request. Our sales team will call you shortly.
            </p>
            <a
              href={`tel:${import.meta.env.VITE_CONTACT_PHONE || '+919606010736'}`}
              className="btn-primary inline-flex gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Us Now
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-6 space-y-4"
            onClick={() => isDirty || trackFormStart()}
            noValidate
          >
            {/* Full Name */}
            <div>
              <label htmlFor="lead-name" className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lead-name"
                type="text"
                placeholder="Your full name"
                className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                {...register('fullName')}
              />
              {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="lead-phone" className="label">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-stone-200 rounded-l-sm bg-stone-50 text-stone-500 text-sm">
                  +91
                </span>
                <input
                  id="lead-phone"
                  type="tel"
                  placeholder="10-digit mobile"
                  maxLength={10}
                  className={`input-field rounded-l-none flex-1 ${errors.phone ? 'input-error' : ''}`}
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="error-text">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="lead-email" className="label">
                Email <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                id="lead-email"
                type="email"
                placeholder="your@email.com"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lead-city" className="label">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="lead-city"
                  type="text"
                  placeholder="Your city"
                  className={`input-field ${errors.city ? 'input-error' : ''}`}
                  {...register('city')}
                />
                {errors.city && <p className="error-text">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="lead-state" className="label">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="lead-state"
                  className={`input-field ${errors.state ? 'input-error' : ''}`}
                  {...register('state')}
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="error-text">{errors.state.message}</p>}
              </div>
            </div>

            {/* Configuration */}
            <div>
              <label htmlFor="lead-config" className="label">Interested In</label>
              <select
                id="lead-config"
                className="input-field"
                {...register('preferredConfiguration')}
              >
                {CONFIGS.map((c) => (
                  <option key={c} value={c}>{CONFIG_LABELS[c]}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="lead-message" className="label">
                Message <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="lead-message"
                rows={2}
                placeholder="Any specific requirements or questions..."
                className="input-field resize-none"
                {...register('message')}
              />
            </div>

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full py-4 text-base disabled:opacity-70"
              id="lead-form-submit"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
              ) : (
                'Book Site Visit'
              )}
            </button>

            <p className="text-xs text-stone-400 text-center">
              By submitting, you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-stone-600" target="_blank">
                Privacy Policy
              </a>
              . No spam, ever.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
