import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  Table,
  TrendingDown,
  TrendingUp,
  IndianRupee
} from 'lucide-react';
import QualityBadge from '../components/QualityBadge';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function PricingExplained() {
  const { t } = useTranslation();
  const { formatPrice, currency, symbol } = useCurrency();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 pb-24 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-4 py-1 text-xs font-bold text-forest-800 border border-forest-200 mb-4">
          <Calculator size={15} className="text-forest-700" />
          <span>Pricing Mathematics & Transparency</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950">
          {t('pricing_explained.title')}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
          {t('pricing_explained.subtitle')}
        </p>
      </div>

      {/* CORE PRICING EQUATION BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-forest-700 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 p-6 sm:p-10 text-white shadow-2xl"
      >
        <div className="text-xs uppercase font-extrabold text-emerald-300 tracking-wider mb-2">
          {t('pricing_explained.formula_title')}
        </div>

        <div className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight py-4 border-y border-forest-800 my-4">
          Fair Price ({symbol}/tCO2e) = Benchmark Price × Quality Multiplier
        </div>

        <p className="text-xs sm:text-sm text-forest-200 leading-relaxed max-w-3xl font-medium">
          {t('pricing_explained.formula_desc')} All conversions and payouts are dynamically calculated in real-time in <strong>{currency}</strong>.
        </p>
      </motion.section>

      {/* WORKED NUMERICAL EXAMPLES IN ACTIVE CURRENCY */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-6"
      >
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-forest-950">
            {t('pricing_explained.example_title')} ({currency})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Example 1: Legacy REDD+ Discounted */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-200 text-rose-800">
                  <TrendingDown size={22} />
                </span>
                <QualityBadge quality_badge="red" score={32} size="sm" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                Example 1: Unverified Legacy REDD+ Forestry Project
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                Baseline Benchmark: {formatPrice(28.00)} | Vintage: 2017 (&gt;5 yrs old, -1) | Registry: Unverified (-2) | Quality Score: 32 (Red Badge) | Multiplier: 0.45x
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs sm:text-sm font-bold text-rose-950 shadow-sm">
              Fair Price = {formatPrice(28.00)} × 0.45 = <span className="text-base text-rose-700">{formatPrice(12.60)} / tCO2e</span> (Significant discount protects buyers from low integrity credits)
            </div>
          </div>

          {/* Example 2: Premium Biochar / DAC */}
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-200 text-emerald-800">
                  <TrendingUp size={22} />
                </span>
                <QualityBadge quality_badge="green" score={95} size="sm" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                Example 2: Certified Durable Biochar Farm Soil Project
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                Baseline Benchmark: {formatPrice(140.00)} | Vintage: 2024 (+1) | Registry: Puro.earth Verified (+2) | Storage: Durable Mineralization (+1) | Quality Score: 95 (Green Badge) | Multiplier: 1.22x
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm">
              Fair Price = {formatPrice(140.00)} × 1.22 = <span className="text-base text-emerald-700">{formatPrice(170.80)} / tCO2e</span> (Premium price rewards farmers adopting verified biochar practices)
            </div>
          </div>

        </div>
      </motion.section>

      {/* EXACT SCORING RULES MATRIX TABLE */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-100 text-forest-800">
            <Table size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-950">
              {t('pricing_explained.rules_title')}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-sand-50/70 text-slate-700">
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('pricing_explained.rule_col_condition')}
                </th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('pricing_explained.rule_col_impact')}
                </th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('pricing_explained.rule_col_rationale')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              
              {/* +2 Verified Standard Registry */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{t('pricing_explained.rule_verified_reg')}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                    {t('pricing_explained.rule_verified_reg_pts')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  {t('pricing_explained.rule_verified_reg_why')}
                </td>
              </tr>

              {/* -2 Unverified / Unknown Registry */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  <span>{t('pricing_explained.rule_unverified_reg')}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-rose-100 text-rose-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                    {t('pricing_explained.rule_unverified_reg_pts')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  {t('pricing_explained.rule_unverified_reg_why')}
                </td>
              </tr>

              {/* -1 Legacy Renewable Methodology */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span>{t('pricing_explained.rule_renewable_legacy')}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                    {t('pricing_explained.rule_renewable_legacy_pts')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  {t('pricing_explained.rule_renewable_legacy_why')}
                </td>
              </tr>

              {/* -1 Vintage > 5 Years Old */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span>{t('pricing_explained.rule_old_vintage')}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                    {t('pricing_explained.rule_old_vintage_pts')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  {t('pricing_explained.rule_old_vintage_why')}
                </td>
              </tr>

              {/* -1 Forestry / ARR / REDD+ */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                  <span>{t('pricing_explained.rule_forestry_risk')}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                    {t('pricing_explained.rule_forestry_risk_pts')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  {t('pricing_explained.rule_forestry_risk_why')}
                </td>
              </tr>

              {/* +1 DAC / Biochar / ERW Bonus */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>{t('pricing_explained.rule_permanent_bonus')}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                    {t('pricing_explained.rule_permanent_bonus_pts')}
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600">
                  {t('pricing_explained.rule_permanent_bonus_why')}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </motion.section>

    </div>
  );
}
