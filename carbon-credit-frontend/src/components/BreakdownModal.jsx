import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Calendar, Award, Database, FileText } from 'lucide-react';
import QualityBadge from './QualityBadge';
import AnomalyBadge from './AnomalyBadge';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function BreakdownModal({ listing, isOpen, onClose }) {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  if (!isOpen || !listing) return null;

  const breakdown = listing.quality_breakdown || [];
  const lowPrice = listing.fair_price_low || listing.fair_price * 0.92;
  const highPrice = listing.fair_price_high || listing.fair_price * 1.1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 md:p-8 shadow-2xl z-10 border border-slate-100 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200">
                  {listing.project_type}
                </span>
                <QualityBadge quality_badge={listing.quality_badge} score={listing.quality_score} />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {listing.project_name}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Anomaly Banner if flagged */}
          {listing.is_anomaly && (
            <div className="mt-4">
              <AnomalyBadge riskScore={listing.anomaly_risk_score} />
            </div>
          )}

          {/* Pricing & Fair Range Box */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-forest-50 border border-forest-200">
            <div>
              <div className="text-xs text-forest-800 font-bold uppercase tracking-wider">Fair Market Price</div>
              <div className="text-xl sm:text-2xl font-display font-extrabold text-forest-950 mt-0.5">
                {formatPrice(listing.fair_price)}
                <span className="text-xs font-sans font-medium text-forest-700 ml-1">/ tCO2e</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-forest-800 font-bold uppercase tracking-wider">{t('browse_credits.modal_price_range')}</div>
              <div className="text-sm sm:text-base font-bold text-forest-900 mt-1 font-display">
                {formatPrice(lowPrice)} – {formatPrice(highPrice)}
              </div>
            </div>

            <div>
              <div className="text-xs text-forest-800 font-bold uppercase tracking-wider">{t('browse_credits.modal_credits_avail')}</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-1 font-display">
                {(listing.credits_issued || 0).toLocaleString()} tCO2e
              </div>
            </div>
          </div>

          {/* Project Meta Information Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-slate-500 mb-1">
                <Database size={13} className="text-forest-600" />
                <span>{t('browse_credits.modal_registry')}</span>
              </div>
              <div className="font-bold text-slate-800 truncate" title={listing.registry}>
                {listing.registry}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-slate-500 mb-1">
                <Calendar size={13} className="text-forest-600" />
                <span>{t('browse_credits.modal_vintage')}</span>
              </div>
              <div className="font-bold text-slate-800">
                {listing.vintage_year}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-slate-500 mb-1">
                <Award size={13} className="text-forest-600" />
                <span>{t('browse_credits.modal_verification')}</span>
              </div>
              <div className={`font-bold capitalize ${listing.verification_status === 'verified' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {listing.verification_status}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-slate-500 mb-1">
                <FileText size={13} className="text-forest-600" />
                <span>Multiplier</span>
              </div>
              <div className="font-bold text-slate-800">
                {listing.quality_multiplier || 1.0}x
              </div>
            </div>
          </div>

          {/* Methodology string */}
          {listing.methodology && (
            <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800">{t('browse_credits.modal_methodology')}: </span>
              <span className="font-mono text-slate-700">{listing.methodology}</span>
            </div>
          )}

          {/* Quality Rule Breakdown List (Color coded: Green + rows, Red - rows) */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <span>{t('browse_credits.modal_breakdown_title')}</span>
              <span className="text-xs font-normal text-slate-500">
                (ICVCM Core Benchmark Score: {listing.quality_score}/100)
              </span>
            </h3>

            <div className="space-y-2">
              {breakdown.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  Standard baseline rules applied.
                </div>
              ) : (
                breakdown.map((item, idx) => {
                  const isPositive = (item.points || 0) > 0;
                  const isNegative = (item.points || 0) < 0;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm border transition-colors ${
                        isPositive
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : isNegative
                          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isPositive ? (
                          <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                        ) : isNegative ? (
                          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                        ) : (
                          <Info size={16} className="text-slate-500 flex-shrink-0" />
                        )}
                        <span className="font-medium">{item.rule}</span>
                      </div>

                      <span
                        className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md ${
                          isPositive
                            ? 'bg-emerald-200 text-emerald-950'
                            : isNegative
                            ? 'bg-rose-200 text-rose-950'
                            : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isPositive ? `+${item.points}` : item.points} pts
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="mt-7 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-forest-800 text-white font-bold text-sm hover:bg-forest-900 transition-colors shadow-md"
            >
              {t('browse_credits.modal_close')}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
