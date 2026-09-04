import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Copy, 
  Ghost, 
  Scale, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Binary,
  ArrowRight
} from 'lucide-react';
import QualityBadge from '../components/QualityBadge';
import AnomalyBadge from '../components/AnomalyBadge';
import { useTranslation } from '../i18n/I18nContext';
import { getCredits } from '../api';

export default function Greenwashing() {
  const { t } = useTranslation();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnomalies() {
      try {
        const res = await getCredits();
        if (res.listings) {
          const flagged = res.listings.filter(l => l.is_anomaly === true || l.anomaly_risk_score > 70);
          setAnomalies(flagged.slice(0, 3)); // show top 3
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnomalies();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 pb-24 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-800 border border-rose-200 mb-4">
          <ShieldAlert size={14} className="text-rose-700" />
          <span>Anti-Greenwashing Architecture</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-forest-950">
          {t('greenwashing.title')}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          {t('greenwashing.subtitle')}
        </p>
      </div>

      {/* LIVE DATA ANOMALY SCANNER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-indigo-200 bg-gradient-to-b from-indigo-50/50 to-white p-6 sm:p-10 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Binary size={24} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Live Anomaly Scanner
              </h2>
              <p className="text-sm text-slate-600 font-medium">Real flagged datasets from the Isolation Forest model</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white border border-sand-200 px-3 py-1.5 rounded-full shadow-sm text-slate-600">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scanning Active DB</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Sparkles className="animate-spin mb-3 text-indigo-400" size={28} />
            <p className="text-sm font-medium">Running statistical analysis...</p>
          </div>
        ) : anomalies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-sand-300">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" />
            <p className="text-sm font-bold text-slate-700">No major statistical anomalies detected right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anomalies.map(item => (
              <div key={item.id} className="relative rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <AnomalyBadge riskScore={item.anomaly_risk_score} compact={false} />
                </div>
                <h4 className="font-display font-bold text-slate-900 mb-2 line-clamp-2">{item.project_name}</h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 font-medium border-y border-slate-100 py-2 mb-3">
                  <span>Vol: {(item.credits_issued || 0).toLocaleString()} t</span>
                  <span>•</span>
                  <span>V: {item.vintage_year}</span>
                </div>
                {item.anomaly_reasons && item.anomaly_reasons.length > 0 && (
                  <ul className="text-xs text-slate-600 space-y-1.5 mt-2">
                    {item.anomaly_reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <ArrowRight size={12} className="text-rose-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* COMMON GREENWASHING PATTERNS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
            <AlertTriangle size={24} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            {t('greenwashing.patterns_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pattern 1: Phantom Credits */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700 mb-4">
              <Ghost size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
              {t('greenwashing.p1_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('greenwashing.p1_desc')}
            </p>
          </div>

          {/* Pattern 2: Double Counting */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700 mb-4">
              <Copy size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
              {t('greenwashing.p2_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('greenwashing.p2_desc')}
            </p>
          </div>

          {/* Pattern 3: Masking Low Quality */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-700 mb-4">
              <Scale size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
              {t('greenwashing.p3_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('greenwashing.p3_desc')}
            </p>
          </div>

        </div>
      </motion.section>

      {/* TWO SEPARATE, INDEPENDENT SIGNALS (Crucial Platform Distinction) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-forest-950">
            {t('greenwashing.dual_defense_title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            {t('greenwashing.dual_defense_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Pillar 1: Rule-based ICVCM Scoring */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <CheckCircle2 size={24} />
                </div>
                <QualityBadge quality_badge="green" score={92} size="sm" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {t('greenwashing.engine1_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t('greenwashing.engine1_desc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200/80 text-xs font-semibold text-emerald-900">
              Evaluates: Registry Accreditation, Protocol Code, Vintage Freshness & Durability Storage.
            </div>
          </div>

          {/* Pillar 2: Unsupervised Statistical Anomaly Detection */}
          <div className="rounded-3xl border border-purple-200 bg-purple-50/50 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-700 text-white">
                  <Cpu size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-purple-200 text-purple-900 px-2.5 py-1 rounded-md">
                  Isolation Forest ML
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {t('greenwashing.engine2_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t('greenwashing.engine2_desc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-200/80 text-xs font-semibold text-purple-900">
              Evaluates: Multivariate Issuance Outliers, Cluster Deviations, Registry-Volume Discrepancies.
            </div>
          </div>

        </div>

        {/* Highlight Callout: Why Both Matter */}
        <div className="rounded-3xl border border-sand-300 bg-gradient-to-r from-[#FAF8F5] to-[#F1EDE0] p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-800 text-emerald-300 flex-shrink-0 mt-1">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-forest-950 mb-2">
                {t('greenwashing.distinct_highlight_title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t('greenwashing.distinct_highlight_desc')}
              </p>
              
              <div className="mt-4">
                <AnomalyBadge riskScore={88} />
              </div>
            </div>
          </div>
        </div>

      </motion.section>

    </div>
  );
}
