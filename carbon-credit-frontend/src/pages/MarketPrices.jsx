import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, PieChart as PieIcon, BarChart3, Table, Layers, ShieldCheck, IndianRupee } from 'lucide-react';
import { getCredits } from '../api';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function MarketPrices() {
  const { t } = useTranslation();
  const { formatPrice, currency, symbol, USD_TO_INR } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [typeStats, setTypeStats] = useState({});
  const [qualityCounts, setQualityCounts] = useState({ green: 0, yellow: 0, red: 0 });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCredits();
        const listings = data.listings || [];

        const grouped = {};
        const qCounts = { green: 0, yellow: 0, red: 0 };

        listings.forEach((item) => {
          const pType = item.project_type || 'Other';
          const price = parseFloat(item.fair_price) || 0;
          const bench = parseFloat(item.benchmark_price) || price * 0.9;
          const low = parseFloat(item.fair_price_low) || price * 0.92;
          const high = parseFloat(item.fair_price_high) || price * 1.1;
          const score = parseInt(item.quality_score, 10) || 50;

          if (!grouped[pType]) {
            grouped[pType] = {
              prices: [],
              benchmarks: [],
              lows: [],
              highs: [],
              scores: [],
              count: 0
            };
          }

          grouped[pType].prices.push(price);
          grouped[pType].benchmarks.push(bench);
          grouped[pType].lows.push(low);
          grouped[pType].highs.push(high);
          grouped[pType].scores.push(score);
          grouped[pType].count += 1;

          const badge = (item.quality_badge || 'yellow').toLowerCase();
          if (qCounts[badge] !== undefined) {
            qCounts[badge] += 1;
          }
        });

        const statsSummary = {};
        Object.entries(grouped).forEach(([type, dataObj]) => {
          const avgFair = dataObj.prices.reduce((a, b) => a + b, 0) / dataObj.prices.length;
          const avgBench = dataObj.benchmarks.reduce((a, b) => a + b, 0) / dataObj.benchmarks.length;
          const minLow = Math.min(...dataObj.lows);
          const maxHigh = Math.max(...dataObj.highs);
          const avgScore = Math.round(dataObj.scores.reduce((a, b) => a + b, 0) / dataObj.scores.length);

          statsSummary[type] = {
            avgFairUsd: avgFair,
            avgBenchmarkUsd: avgBench,
            lowRangeUsd: minLow,
            highRangeUsd: maxHigh,
            avgScore,
            count: dataObj.count
          };
        });

        setTypeStats(statsSummary);
        setQualityCounts(qCounts);
      } catch (err) {
        console.error('[MarketPrices] Error loading chart data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const barLabels = Object.keys(typeStats);
  const barDataValues = barLabels.map((k) => {
    const usdVal = typeStats[k].avgFairUsd;
    return currency === 'INR' ? Math.round(usdVal * USD_TO_INR) : +usdVal.toFixed(2);
  });

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: `Average Fair Price (${symbol}/tCO2e)`,
        data: barDataValues,
        backgroundColor: [
          'rgba(21, 128, 61, 0.85)',
          'rgba(22, 163, 74, 0.85)',
          'rgba(74, 222, 128, 0.85)',
          'rgba(187, 247, 208, 0.9)',
          'rgba(124, 58, 237, 0.85)',
          'rgba(217, 119, 6, 0.85)',
        ],
        borderColor: [
          '#14532d',
          '#15803d',
          '#16a34a',
          '#4ade80',
          '#6d28d9',
          '#b45309',
        ],
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#052e16',
        titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` Fair Price: ${symbol}${context.parsed.y.toLocaleString()} / tCO2e`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (val) => `${symbol}${val.toLocaleString()}`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' } },
      },
    },
  };

  const donutChartData = {
    labels: [t('quality.green'), t('quality.yellow'), t('quality.red')],
    datasets: [
      {
        data: [qualityCounts.green || 4, qualityCounts.yellow || 1, qualityCounts.red || 2],
        backgroundColor: [
          'rgba(22, 163, 74, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(244, 63, 94, 0.9)',
        ],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#052e16',
        bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-20 sm:pb-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-4 py-1 text-xs font-bold text-forest-800 border border-forest-200 mb-4">
          <TrendingUp size={15} className="text-forest-700" />
          <span>Carbon Index & Price Analytics</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-forest-950">
          {t('market_prices.title')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
          {t('market_prices.subtitle')}
        </p>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
        
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2 rounded-3xl border border-sand-300 bg-white p-4 sm:p-6 md:p-8 shadow-sm flex flex-col justify-between"
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={20} className="text-forest-700" />
              <h3 className="font-display text-xl font-bold text-slate-900">
                Average Fair Price by Category ({symbol}/tCO2e)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {t('market_prices.price_by_type_desc')}
            </p>
          </div>

          <div className="h-60 sm:h-72 md:h-80 w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                {t('market_prices.loading')}
              </div>
            ) : (
              <Bar data={barChartData} options={barChartOptions} />
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-3xl border border-sand-300 bg-white p-4 sm:p-6 md:p-8 shadow-sm flex flex-col justify-between"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <PieIcon size={20} className="text-forest-700" />
              <h3 className="font-display text-xl font-bold text-slate-900">
                {t('market_prices.quality_dist_title')}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {t('market_prices.quality_dist_desc')}
            </p>
          </div>

          <div className="h-52 sm:h-64 md:h-72 w-full flex items-center justify-center">
            {loading ? (
              <div className="text-sm text-slate-400">{t('market_prices.loading')}</div>
            ) : (
              <Doughnut data={donutChartData} options={donutChartOptions} />
            )}
          </div>
        </motion.div>

      </div>

      {/* BENCHMARK VS FAIR PRICE COMPARISON TABLE IN ACTIVE CURRENCY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-3xl border border-sand-300 bg-white p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Table size={20} className="text-forest-700" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              {t('market_prices.comparison_table_title')} ({currency})
            </h3>
          </div>
          <span className="text-xs font-bold text-forest-800 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
            ICVCM 2026 Reference Matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-sand-50/70 text-slate-700">
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('market_prices.col_type')}
                </th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('market_prices.col_benchmark')}
                </th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('market_prices.col_fair_range')}
                </th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('market_prices.col_avg_score')}
                </th>
                <th className="py-4 px-4 font-bold text-xs uppercase tracking-wider">
                  {t('market_prices.col_durability')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-forest-600" />
                  Biochar (Soil Pyrolysis)
                </td>
                <td className="py-4 px-4 text-slate-600 font-bold">{formatPrice(135.00)} / t</td>
                <td className="py-4 px-4 font-display font-extrabold text-forest-900">{formatPrice(148.00)} – {formatPrice(165.00)}</td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md text-xs font-bold">
                    92/100
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600 font-medium">100 - 1,000 Years (Mineral Biochar)</td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                  DAC (Direct Air Capture)
                </td>
                <td className="py-4 px-4 text-slate-600 font-bold">{formatPrice(520.00)} / t</td>
                <td className="py-4 px-4 font-display font-extrabold text-forest-900">{formatPrice(620.00)} – {formatPrice(690.00)}</td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md text-xs font-bold">
                    98/100
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600 font-medium">&gt; 10,000 Years (Deep Solidification)</td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  ERW (Rock Weathering)
                </td>
                <td className="py-4 px-4 text-slate-600 font-bold">{formatPrice(180.00)} / t</td>
                <td className="py-4 px-4 font-display font-extrabold text-forest-900">{formatPrice(210.00)} – {formatPrice(235.00)}</td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md text-xs font-bold">
                    95/100
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600 font-medium">&gt; 10,000 Years (Mineral Dissolution)</td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-600" />
                  ARR (Agroforestry & Trees)
                </td>
                <td className="py-4 px-4 text-slate-600 font-bold">{formatPrice(42.00)} / t</td>
                <td className="py-4 px-4 font-display font-extrabold text-forest-900">{formatPrice(40.00)} – {formatPrice(48.50)}</td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md text-xs font-bold">
                    84/100
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600 font-medium">30 - 100 Years (Biological Reversal Risk)</td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  REDD+ (Forest Conservation)
                </td>
                <td className="py-4 px-4 text-slate-600 font-bold">{formatPrice(28.00)} / t</td>
                <td className="py-4 px-4 font-display font-extrabold text-forest-900">{formatPrice(22.00)} – {formatPrice(29.00)}</td>
                <td className="py-4 px-4">
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md text-xs font-bold">
                    71/100
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-slate-600 font-medium">20 - 50 Years (Baseline Uncertainty)</td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                  IFM (Unverified Legacy)
                </td>
                <td className="py-4 px-4 text-slate-600 font-bold">{formatPrice(18.00)} / t</td>
                <td className="py-4 px-4 font-display font-extrabold text-rose-900">{formatPrice(6.50)} – {formatPrice(10.00)}</td>
                <td className="py-4 px-4">
                  <span className="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-md text-xs font-bold">
                    32/100
                  </span>
                </td>
                <td className="py-4 px-4 text-xs text-rose-600 font-bold">Low / Disputed Integrity</td>
              </tr>

            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
