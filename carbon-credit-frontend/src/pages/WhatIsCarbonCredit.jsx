import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Leaf, 
  Globe, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Timer, 
  TreePine, 
  Factory, 
  Sparkles,
  Users
} from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';

export default function WhatIsCarbonCredit() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 pb-24 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-1 text-xs font-semibold text-forest-800 border border-forest-200 mb-4">
          <HelpCircle size={14} className="text-forest-700" />
          <span>Educational Guide</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-forest-950">
          {t('what_is_carbon.title')}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          {t('what_is_carbon.subtitle')}
        </p>
      </div>

      {/* SECTION 1: WHAT DOES 1 CREDIT REPRESENT? */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-forest-800">
            <Leaf size={24} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            {t('what_is_carbon.sec1_title')}
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed mt-4">
          <p>{t('what_is_carbon.sec1_p1')}</p>
          
          <div className="my-6 p-5 rounded-2xl bg-forest-50/80 border border-forest-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-forest-900 flex-shrink-0">
              1 Credit = 1 tCO2e
            </div>
            <div className="text-xs sm:text-sm text-forest-800 border-t sm:border-t-0 sm:border-l border-forest-200 pt-3 sm:pt-0 sm:pl-4">
              Equivalent to the greenhouse gas emissions from driving approximately 4,000 kilometers in an average petrol car, or charging 120,000 smartphones.
            </div>
          </div>

          <p>{t('what_is_carbon.sec1_p2')}</p>
        </div>
      </motion.section>

      {/* SECTION 2: VOLUNTARY VS COMPLIANCE MARKETS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-6"
      >
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            {t('what_is_carbon.sec2_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Voluntary Market Card */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 mb-4">
                <Globe size={24} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {t('what_is_carbon.sec2_vcm')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('what_is_carbon.sec2_vcm_desc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl">
              Key Focus: Regenerative Farming, Biochar, Forestry & Direct Air Capture
            </div>
          </div>

          {/* Compliance Market Card */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-900 text-white mb-4">
                <Factory size={24} className="text-emerald-300" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {t('what_is_carbon.sec2_compliance')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('what_is_carbon.sec2_compliance_desc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-forest-900 bg-sand-100 px-3.5 py-2 rounded-xl">
              Key Focus: EU ETS, UK ETS, California Cap-and-Trade, India CCTS
            </div>
          </div>

        </div>
      </motion.section>

      {/* SECTION 3: WHY QUALITY VARIES DRAMATICALLY */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm"
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
            {t('what_is_carbon.sec3_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Factor 1: Additionality */}
          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 border border-sand-200/80">
            <div className="flex items-center gap-2.5 mb-2">
              <CheckCircle2 size={18} className="text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {t('what_is_carbon.factor1_title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('what_is_carbon.factor1_desc')}
            </p>
          </div>

          {/* Factor 2: Permanence & Reversal Risk */}
          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 border border-sand-200/80">
            <div className="flex items-center gap-2.5 mb-2">
              <Timer size={18} className="text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {t('what_is_carbon.factor2_title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('what_is_carbon.factor2_desc')}
            </p>
          </div>

          {/* Factor 3: Measurement Integrity */}
          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 border border-sand-200/80">
            <div className="flex items-center gap-2.5 mb-2">
              <Scale size={18} className="text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {t('what_is_carbon.factor3_title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('what_is_carbon.factor3_desc')}
            </p>
          </div>

          {/* Factor 4: Co-Benefits */}
          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 border border-sand-200/80">
            <div className="flex items-center gap-2.5 mb-2">
              <Users size={18} className="text-forest-700" />
              <h3 className="font-serif text-lg font-bold text-slate-900">
                {t('what_is_carbon.factor4_title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('what_is_carbon.factor4_desc')}
            </p>
          </div>

        </div>
      </motion.section>

    </div>
  );
}
