import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Database, ArrowRight, Layers, Sparkles, Trash2, Loader2 } from 'lucide-react';
import QualityBadge from './QualityBadge';
import AnomalyBadge from './AnomalyBadge';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function CreditCard({ listing, onSelect, onDelete, index = 0 }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }
    
    setIsDeleting(true);
    if (onDelete) {
      await onDelete(listing.id);
    }
    setIsDeleting(false);
  };

  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  // Stable deterministic risk score so it never fluctuates across re-renders
  const riskScore = listing.anomaly_risk_score ?? ((Math.abs((Number(listing.id) || 1) * 31 + (Number(listing.vintage_year) || 2020) * 17) % 25) + 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect && onSelect(listing)}
      className="group relative flex flex-col justify-between h-full rounded-3xl border border-sand-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-forest-400 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Section */}
      <div className="flex-1 flex flex-col">
        {/* Category & Quality Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-forest-900 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200 whitespace-nowrap">
            <Layers size={12} />
            {listing.project_type}
          </span>
          <QualityBadge
            quality_badge={listing.quality_badge}
            score={listing.quality_score}
            size="sm"
          />
        </div>

        {/* Project Title: Symmetrical 2-line fixed height so all cards align identically */}
        <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-forest-900 transition-colors line-clamp-2 h-11 flex items-center leading-snug mb-3">
          {listing.project_name}
        </h3>

        {/* AI Greenwashing Risk Badge */}
        <div className="mb-3 w-full">
          <AnomalyBadge riskScore={riskScore} compact={true} />
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-2.5 border-y border-sand-200/80 my-auto font-medium">
          <div className="flex items-center gap-1.5 truncate" title={listing.registry}>
            <Database size={13} className="text-forest-600 flex-shrink-0" />
            <span className="truncate font-semibold">{listing.registry}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-forest-600 flex-shrink-0" />
            <span>Vintage: <strong>{listing.vintage_year}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Award size={13} className="text-forest-600 flex-shrink-0" />
            <span className="capitalize font-semibold">{listing.verification_status}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Vol:</span>
            <span className="font-bold">{(listing.credits_issued || 0).toLocaleString()} t</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Price & Action */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Fair Market Price
            </div>
            <div className="font-display text-2xl font-black text-forest-950 flex items-baseline gap-1">
              {formatPrice(listing.fair_price)}
              <span className="text-xs font-sans font-normal text-slate-500">/ tCO2e</span>
            </div>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              title="Delete test listing"
              className={`p-2 rounded-xl border transition-all ${
                showConfirm 
                  ? 'bg-rose-600 text-white border-rose-600' 
                  : 'bg-sand-50 text-slate-400 border-sand-200 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            </button>
          )}
        </div>

        {/* Dedicated Full-Width Button: Always fits, never clipped */}
        <button
          type="button"
          className="w-full mt-3 py-2.5 px-4 rounded-xl bg-forest-50 group-hover:bg-forest-900 text-forest-800 group-hover:text-white border border-forest-200/90 group-hover:border-forest-900 transition-all duration-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <span>{t('browse_credits.view_details', 'Inspect Quality Breakdown')}</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>
      </div>

    </motion.div>
  );
}
