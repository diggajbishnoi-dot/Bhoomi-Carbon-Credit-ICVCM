import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  Layers, 
  Award, 
  Calendar, 
  Database,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  IndianRupee
} from 'lucide-react';
import { listCredit } from '../api';
import QualityBadge from '../components/QualityBadge';
import AnomalyBadge from '../components/AnomalyBadge';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function Seller() {
  const { t } = useTranslation();
  const { formatPrice, currency } = useCurrency();

  const initialForm = {
    project_name: '',
    project_type: 'Biochar',
    registry: '',
    vintage_year: new Date().getFullYear(),
    credits_issued: '',
    verification_status: 'verified',
    methodology: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const errs = {};
    const currentYear = new Date().getFullYear();

    if (!formData.project_name.trim()) {
      errs.project_name = t('seller.err_required');
    }
    if (!formData.registry.trim()) {
      errs.registry = t('seller.err_required');
    }
    if (!formData.methodology.trim()) {
      errs.methodology = t('seller.err_required');
    }
    
    const year = parseInt(formData.vintage_year, 10);
    if (!year || year < 2000 || year > currentYear) {
      errs.vintage_year = t('seller.err_vintage');
    }

    const credits = parseInt(formData.credits_issued, 10);
    if (!credits || credits <= 0) {
      errs.credits_issued = t('seller.err_credits');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        project_name: formData.project_name.trim(),
        project_type: formData.project_type,
        registry: formData.registry.trim(),
        vintage_year: parseInt(formData.vintage_year, 10),
        credits_issued: parseInt(formData.credits_issued, 10),
        verification_status: formData.verification_status,
        methodology: formData.methodology.trim()
      };

      const res = await listCredit(payload);
      if (res && res.success) {
        setResult(res);
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err) {
      console.error('[Seller] Submission error:', err);
      setSubmitError(err.message || 'Unable to submit listing. Please verify your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setErrors({});
    setResult(null);
    setSubmitError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 pb-24">
      
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold text-forest-800 border border-emerald-200 mb-4">
          <Sprout size={15} className="text-emerald-700" />
          <span>Kisan & Developer Portal (किसान और डेवलपर मंच)</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950">
          {t('seller.title')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
          {t('seller.subtitle')}
        </p>
      </div>

      {/* SUCCESS RESULT CARD (Inline Animated Result - No Redirect) */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mb-10 rounded-3xl border border-emerald-300 bg-gradient-to-b from-emerald-50/90 to-white p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-200/80 pb-6">
              
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md flex-shrink-0">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-forest-950">
                    {t('seller.success_title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900 mt-0.5 font-medium">
                    {t('seller.success_desc')}
                  </p>
                </div>
              </div>

              {/* Quality Badge Display */}
              <div>
                <QualityBadge
                  quality_badge={result.pricing?.quality_badge || 'green'}
                  score={result.pricing?.quality_score}
                  size="lg"
                />
              </div>

            </div>

            {/* Price Discovery Summary Box */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('seller.your_price')}
                </div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-forest-900 mt-1">
                  {formatPrice(result.pricing?.fair_price)}
                  <span className="text-xs font-sans text-forest-700 ml-1 font-medium">/ tCO2e</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('seller.benchmark_ref')}
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                  {formatPrice(result.pricing?.benchmark_price)}
                  <span className="text-xs font-sans text-slate-500 ml-1">base</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('seller.multiplier_applied')}
                </div>
                <div className="font-display text-xl sm:text-2xl font-bold text-forest-700 mt-1">
                  {result.pricing?.quality_multiplier}x
                  <span className="text-xs font-sans text-slate-500 ml-1">multiplier</span>
                </div>
              </div>

            </div>

            {/* Anomaly Badge if flagged */}
            {result.pricing?.is_anomaly && (
              <div className="mt-5">
                <AnomalyBadge riskScore={result.pricing?.anomaly_risk_score} />
              </div>
            )}

            {/* Reset / List Another Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl bg-forest-800 px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-forest-900 transition-colors"
              >
                <PlusCircle size={18} />
                <span>{t('seller.list_another')}</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* SELLER FORM */}
      {!result && (
        <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm">
          
          <div className="border-b border-slate-100 pb-5 mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              {t('seller.form_title')}
            </h2>
            <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200">
              Step 1 of 1 (Instant Discovery)
            </span>
          </div>

          {/* Submission Error Banner */}
          {submitError && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-sm text-rose-800 font-medium">
              <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Project Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t('seller.project_name')} (प्रकल्प का नाम) *
                </label>
                <span className="text-[11px] text-slate-400">e.g. Punjab Agroforestry Cluster</span>
              </div>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                placeholder={t('seller.project_name_placeholder')}
                className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                  errors.project_name ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                }`}
              />
              {errors.project_name && (
                <p className="mt-1 text-xs text-rose-600 font-bold">{errors.project_name}</p>
              )}
            </div>

            {/* 2. Project Type & Registry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.project_type')} (प्रकल्प श्रेणी) *
                </label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  className="w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-100"
                >
                  <option value="Biochar">Biochar (मिट्टी में बायोचार खाद)</option>
                  <option value="ARR">ARR (पेड़ लगाना और वन संवर्धन)</option>
                  <option value="REDD+">REDD+ (जंगल कटाई रोकथाम)</option>
                  <option value="IFM">IFM (बेहतर वन प्रबंधन)</option>
                  <option value="ERW">ERW (खनिज मौसम प्रक्रिया)</option>
                  <option value="DAC">DAC (हवा से सीधा सोखना)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.registry')} (मानक संस्था) *
                </label>
                <input
                  type="text"
                  value={formData.registry}
                  onChange={(e) => setFormData({ ...formData, registry: e.target.value })}
                  placeholder={t('seller.registry_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.registry ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.registry && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.registry}</p>
                )}
              </div>

            </div>

            {/* 3. Vintage Year & Credits Issued */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.vintage_year')} (फसल/प्रकल्प का वर्ष) *
                </label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={formData.vintage_year}
                  onChange={(e) => setFormData({ ...formData, vintage_year: e.target.value })}
                  placeholder={t('seller.vintage_year_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.vintage_year ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.vintage_year && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.vintage_year}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.credits_issued')} (कार्बन क्रेडिट टन) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.credits_issued}
                  onChange={(e) => setFormData({ ...formData, credits_issued: e.target.value })}
                  placeholder={t('seller.credits_issued_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.credits_issued ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.credits_issued && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.credits_issued}</p>
                )}
              </div>

            </div>

            {/* 4. Verification Status & Methodology */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.verification_status')} (जांच स्थिति) *
                </label>
                <select
                  value={formData.verification_status}
                  onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                  className="w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-100"
                >
                  <option value="verified">{t('seller.verification_verified')}</option>
                  <option value="unverified">{t('seller.verification_unverified')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t('seller.methodology')} (पद्धति कोड) *
                </label>
                <input
                  type="text"
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  placeholder={t('seller.methodology_placeholder')}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 transition-all focus:outline-none focus:ring-4 focus:ring-forest-100 ${
                    errors.methodology ? 'border-rose-400 bg-rose-50/50' : 'border-sand-300 bg-white focus:border-forest-600'
                  }`}
                />
                {errors.methodology && (
                  <p className="mt-1 text-xs text-rose-600 font-bold">{errors.methodology}</p>
                )}
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-800 py-4 px-8 text-base sm:text-lg font-extrabold text-white shadow-xl shadow-forest-950/20 hover:bg-forest-900 focus:outline-none focus:ring-4 focus:ring-forest-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>{t('seller.submitting')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('seller.submit_btn')}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
