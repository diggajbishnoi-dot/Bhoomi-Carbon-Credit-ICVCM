import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RefreshCw, ExternalLink, Globe, IndianRupee } from 'lucide-react';
import { getPriceIndex } from '../api';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function PriceTicker() {
  const { t } = useTranslation();
  const { formatPrice, currency, USD_TO_INR } = useCurrency();
  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [timeAgoStr, setTimeAgoStr] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPrices = async (isManual = false) => {
    if (isManual) setIsUpdating(true);
    try {
      const data = await getPriceIndex();
      if (data && data.price_index && data.price_index.length > 0) {
        setIndexData(data.price_index);
        setLastFetched(new Date());
      }
    } catch (err) {
      console.error('[PriceTicker] Error polling prices:', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setIsUpdating(false), 800);
    }
  };

  useEffect(() => {
    fetchPrices();
    const pollInterval = setInterval(() => {
      fetchPrices();
    }, 5 * 60 * 1000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    const updateRelativeTime = () => {
      if (!lastFetched) {
        setTimeAgoStr(t('home.just_now'));
        return;
      }
      const seconds = Math.floor((new Date() - lastFetched) / 1000);
      if (seconds < 10) {
        setTimeAgoStr(t('home.just_now'));
      } else if (seconds < 60) {
        setTimeAgoStr(`${seconds}s ago`);
      } else {
        const mins = Math.floor(seconds / 60);
        setTimeAgoStr(`${mins}m ago`);
      }
    };

    updateRelativeTime();
    const timeInterval = setInterval(updateRelativeTime, 15000);
    return () => clearInterval(timeInterval);
  }, [lastFetched, t]);

  const primaryItem = indexData && indexData[0] ? indexData[0] : {
    label: 'EU ETS Compliance Allowance (EUA)',
    price: 68.45,
    currency: 'EUR'
  };

  // Convert EUR/USD to active currency
  const getDisplayPrice = (val, baseCurrency = 'USD') => {
    const usdEquivalent = baseCurrency === 'EUR' ? val * 1.08 : val;
    return formatPrice(usdEquivalent);
  };

  const secondaryItems = indexData && indexData.length > 1 ? indexData.slice(1, 3) : [];

  return (
    <div className="w-full rounded-3xl border border-forest-800/80 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 p-4 sm:p-6 text-white shadow-2xl shadow-forest-950/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left Side: Header & Live indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 border border-forest-600 shadow-inner">
            <Globe className="h-5 w-5 text-emerald-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-emerald-100">
                {t('home.live_ticker_title')}
              </h3>
              <button
                onClick={() => fetchPrices(true)}
                disabled={isUpdating}
                title="Refresh prices"
                className="text-forest-400 hover:text-emerald-300 transition-colors p-1"
              >
                <RefreshCw size={14} className={isUpdating ? 'animate-spin text-emerald-400' : ''} />
              </button>
            </div>
            
            {/* Required Source Attribution */}
            <div className="flex items-center gap-1.5 text-xs text-forest-300">
              <a
                href="https://cbamguide.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline decoration-forest-500 hover:text-white transition-colors"
              >
                <span>{t('home.live_ticker_source')}</span>
                <ExternalLink size={10} />
              </a>
              <span>•</span>
              <span>{t('home.last_updated', { time: timeAgoStr || t('home.just_now') })}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Main Price and Sub-indices in INR/USD */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-forest-950/60 rounded-2xl p-3 sm:p-4 border border-forest-800/80 shadow-inner">
          
          {/* Primary Live EU ETS Price */}
          <motion.div
            key={`${primaryItem.price}-${currency}`}
            initial={{ scale: 0.96, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-forest-300">
                {primaryItem.label}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {getDisplayPrice(primaryItem.price, primaryItem.currency)}
                </span>
                <span className="text-xs text-emerald-300 font-bold">/ tCO2e</span>
              </div>
            </div>
          </motion.div>

          {/* Secondary Indices if available */}
          {secondaryItems.map((item, idx) => (
            <div key={idx} className="hidden lg:block border-l border-forest-800/80 pl-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-forest-400">
                {item.label}
              </div>
              <div className="text-sm sm:text-base font-bold text-forest-100 font-display">
                {getDisplayPrice(item.price, item.currency)}
                <span className="text-xs font-normal text-forest-400 ml-1">/t</span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}
