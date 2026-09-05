import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileCheck2, 
  Cpu, 
  Scale, 
  Sparkles,
  Calculator,
  IndianRupee,
  BadgePercent,
  Layers,
  HelpCircle
} from 'lucide-react';
import PriceTicker from '../components/PriceTicker';
import StatCounter from '../components/StatCounter';
import { getCredits } from '../api';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function Home() {
  const { t } = useTranslation();
  const { formatPrice, currency, symbol } = useCurrency();

  const [stats, setStats] = useState({
    totalListings: 0,
    avgFairPrice: 0,
    greenCount: 0,
    yellowCount: 0,
    redCount: 0,
  });

  // Interactive Kisan Calculator State
  const [calcAcre, setCalcAcre] = useState(10);
  const [calcPractice, setCalcPractice] = useState('biochar'); // biochar, agroforestry, direct_seeding

  const practiceMultipliers = {
    biochar: { name: 'Soil Carbon & Biochar Pyrolysis', creditsPerAcre: 3.5, priceUsd: 135 },
    agroforestry: { name: 'Agroforestry & Tree Plantation', creditsPerAcre: 2.2, priceUsd: 42 },
    direct_seeding: { name: 'Direct Seeded Rice (DSR) & Methane Reduction', creditsPerAcre: 1.8, priceUsd: 28 },
  };

  const currentPractice = practiceMultipliers[calcPractice] || practiceMultipliers.biochar;
  const estimatedCredits = Math.round(calcAcre * currentPractice.creditsPerAcre);
  const estimatedIncomeUsd = estimatedCredits * currentPractice.priceUsd;

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getCredits();
        const listings = data.listings || [];
        if (listings.length > 0) {
          const total = listings.length;
          const sumPrice = listings.reduce((acc, curr) => acc + (parseFloat(curr.fair_price) || 0), 0);
          const avgPrice = sumPrice / total;
          const green = listings.filter((l) => l.quality_badge === 'green').length;
          const yellow = listings.filter((l) => l.quality_badge === 'yellow').length;
          const red = listings.filter((l) => l.quality_badge === 'red').length;

          setStats({
            totalListings: total,
            avgFairPrice: avgPrice,
            greenCount: green,
            yellowCount: yellow,
            redCount: red,
          });
        }
      } catch (err) {
        console.error('[Home] Failed to load credits stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-col gap-12 sm:gap-20 pb-20">
      {/* 1. HERO SECTION (Slow Moving Landscape Background) */}
      <section className="relative w-full min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 shadow-2xl mb-10">
        
        {/* Slow Moving Landscape Background */}
        <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden bg-forest-950">
          <img
            src="/hero-landscape.jpg"
            alt="Bhoomi Carbon Agroforestry and Valley Landscape"
            className="w-full h-full object-cover object-center animate-hero-slow select-none pointer-events-none"
          />
        </div>
        {/* Atmospheric Gradient Overlay - ultra-light to maximize landscape image visibility & color vibrancy */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 via-transparent to-[#FAF8F5]/20 pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative z-10 py-16">
          
          {/* Integrity Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-forest-900/20 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold text-forest-950 shadow-sm mb-6 uppercase tracking-widest"
          >
            <ShieldCheck size={16} className="text-forest-700" />
            <span>{t('home.hero_tagline')}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.12] [text-shadow:_0_1px_12px_rgba(255,255,255,0.8)]"
          >
            {t('home.hero_title')}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-950 max-w-3xl mx-auto leading-relaxed font-bold [text-shadow:_0_1px_10px_rgba(255,255,255,0.8)]"
          >
            {t('home.hero_subtitle')}
          </motion.p>

          {/* 2. PRIMARY USER CHOICE POINT (Buyer & Seller Dual Portals) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto"
          >
            
            {/* Buyer CTA Card */}
            <Link
              to="/buyer"
              className="group relative flex flex-col items-start p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-forest-950 to-slate-900 text-white shadow-2xl shadow-slate-950/20 hover:shadow-glow-green hover:scale-[1.02] transition-all duration-200 border border-slate-800"
            >
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-forest-800 text-emerald-300 mb-4 group-hover:bg-forest-700 transition-colors p-3 shadow-inner">
                <Building2 size={26} />
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {t('home.buyer_btn')}
                </h3>
                <ArrowRight size={22} className="text-emerald-400 group-hover:translate-x-2 transition-transform" />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 text-left leading-relaxed">
                {t('home.buyer_btn_desc')}
              </p>
            </Link>

            {/* Seller / Kisan CTA Card */}
            <Link
              to="/seller"
              className="group relative flex flex-col items-start p-7 rounded-3xl bg-gradient-to-br from-emerald-50 via-sand-50 to-amber-50 text-forest-950 shadow-xl shadow-sand-400/25 hover:shadow-glow-gold hover:scale-[1.02] transition-all duration-200 border border-forest-200"
            >
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-forest-700 text-white mb-4 group-hover:bg-forest-800 transition-colors p-3 shadow-md">
                <Sprout size={26} className="text-emerald-200" />
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-display text-2xl font-bold text-forest-950 group-hover:text-forest-800 transition-colors">
                  {t('home.seller_btn')}
                </h3>
                <ArrowRight size={22} className="text-forest-800 group-hover:translate-x-2 transition-transform" />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-700 text-left leading-relaxed font-medium">
                {t('home.seller_btn_desc')}
              </p>
            </Link>

          </motion.div>

        </div>
      </section>

      {/* 3. LIVE EU ETS PRICE TICKER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <PriceTicker />
      </section>

      {/* 4. INTERACTIVE KISAN CARBON EARNING ESTIMATOR */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-forest-300 bg-gradient-to-br from-white via-sand-50 to-emerald-50/50 p-6 sm:p-10 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-300 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <Calculator size={16} />
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-forest-950">
                  Kisan Carbon Revenue Estimator (किसान आय कैलकुलेटर)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Estimate how much your farm can earn annually from high-quality soil and tree carbon credits.
              </p>
            </div>
            <span className="text-xs font-bold text-forest-800 bg-emerald-100/90 px-3.5 py-1.5 rounded-full border border-emerald-300">
              Direct Farmer Payouts in {currency}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Controls */}
            <div className="space-y-5">
              
              {/* Land Size Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-800 mb-2">
                  <span>Farm Land Size (खेत का आकार):</span>
                  <span className="text-forest-900 bg-forest-100 px-3 py-1 rounded-xl text-base font-extrabold font-display">
                    {calcAcre} Acres
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="2"
                  value={calcAcre}
                  onChange={(e) => setCalcAcre(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-forest-700"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>2 Acres</span>
                  <span>50 Acres</span>
                  <span>100+ Acres</span>
                </div>
              </div>

              {/* Practice Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Farming / Sequestration Practice:
                </label>
                <select
                  value={calcPractice}
                  onChange={(e) => setCalcPractice(e.target.value)}
                  className="w-full rounded-2xl border border-sand-300 bg-white px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-forest-600 focus:outline-none shadow-sm"
                >
                  <option value="biochar">Biochar Soil Carbon Enrichment (High Permanence)</option>
                  <option value="agroforestry">Agroforestry & Tree Planting (ARR)</option>
                  <option value="direct_seeding">Direct Seeded Rice (DSR) Methane Reduction</option>
                </select>
              </div>

            </div>

            {/* Live Calculation Output Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-forest-900 text-white shadow-xl flex flex-col justify-between border border-forest-800">
              <div>
                <div className="text-xs uppercase font-bold text-emerald-300 tracking-wider mb-1">
                  Estimated Annual Carbon Yield
                </div>
                <div className="font-display text-3xl font-extrabold text-white">
                  ~{estimatedCredits.toLocaleString()} <span className="text-lg font-normal text-emerald-200">tCO2e Credits/yr</span>
                </div>

                <div className="mt-4 pt-4 border-t border-forest-800">
                  <div className="text-xs uppercase font-bold text-emerald-300 tracking-wider mb-1">
                    Potential Farmer Income (अनुमानित वार्षिक आय)
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-300">
                    {formatPrice(estimatedIncomeUsd)}
                    <span className="text-xs font-sans font-normal text-forest-200 ml-1">/ year</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/seller"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 px-5 text-sm font-extrabold text-forest-950 hover:bg-emerald-400 transition-colors shadow-md"
                >
                  <span>List Your Farm Credits Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 5. ANIMATED COUNT-UP QUICK STATS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-950">
              {t('home.stats_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Stat 1: Total Listings */}
            <div className="pt-4 md:pt-0">
              <StatCounter
                target={stats.totalListings || 7}
                label={t('home.total_listings')}
                suffix="+"
              />
            </div>

            {/* Stat 2: Average Fair Price in Active Currency */}
            <div className="pt-4 md:pt-0 md:px-4">
              <StatCounter
                target={currency === 'INR' ? Math.round((stats.avgFairPrice || 161.46) * 85) : (stats.avgFairPrice || 161.46)}
                decimals={currency === 'INR' ? 0 : 2}
                prefix={symbol}
                suffix="/t"
                label={t('home.avg_fair_price')}
              />
            </div>

            {/* Stat 3: Quality Breakdown Signals */}
            <div className="pt-4 md:pt-0 md:pl-4 flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold text-slate-700 mb-3">
                {t('home.quality_summary')}
              </span>
              <div className="flex items-center gap-2.5 flex-wrap justify-center">
                
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>{stats.greenCount || 4} {t('home.high_quality')}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span>{stats.yellowCount || 1} {t('home.medium_quality')}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <XCircle size={15} className="text-rose-600" />
                  <span>{stats.redCount || 2} {t('home.low_quality')}</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. "HOW IT WORKS" 3-STEP VISUAL */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-950">
            {t('home.how_it_works_title')}
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            {t('home.how_it_works_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-start p-7 sm:p-8 rounded-3xl bg-white border border-sand-300 shadow-sm hover:border-forest-400 hover:shadow-md transition-all"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-forest-100 text-forest-800 mb-5 p-3">
              <FileCheck2 size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-forest-950 mb-2">
              {t('home.step1_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('home.step1_desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-start p-7 sm:p-8 rounded-3xl bg-white border border-sand-300 shadow-sm hover:border-forest-400 hover:shadow-md transition-all"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-purple-100 text-purple-800 mb-5 p-3">
              <Cpu size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-forest-950 mb-2">
              {t('home.step2_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('home.step2_desc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col items-start p-7 sm:p-8 rounded-3xl bg-white border border-sand-300 shadow-sm hover:border-forest-400 hover:shadow-md transition-all"
          >
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 mb-5 p-3">
              <Scale size={26} />
            </div>
            <h3 className="font-display text-xl font-bold text-forest-950 mb-2">
              {t('home.step3_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t('home.step3_desc')}
            </p>
          </motion.div>

        </div>
      </section>

    </div>
  );
}
