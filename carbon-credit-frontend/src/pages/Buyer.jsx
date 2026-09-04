import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  BotOff,
  FileDown,
  ShieldCheck,
  Award,
  X
} from 'lucide-react';
import { getCompany, optimizeCompany, createOrder, payOrder, verifyPayment } from '../api';
import { BEE_CCTS_COMPANIES } from '../bee_ccts';
import QualityBadge from '../components/QualityBadge';
import AnomalyBadge from '../components/AnomalyBadge';
import { useTranslation } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function Buyer() {
  const { t } = useTranslation();
  const { formatPrice, currency } = useCurrency();

  const [companyInput, setCompanyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutState, setCheckoutState] = useState({ status: 'idle', orderDetails: null });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setCheckoutState({ status: 'processing', orderDetails: null, error: null });
    setShowCheckoutModal(true);
    
    try {
      const companyId = result?.company?.id || 1;
      const orderData = {
        company_id: companyId,
        listing_ids: result?.optimization?.selected_listings?.map(l => l.id) || [],
        total_credits: result?.optimization?.total_credits_filled || 0,
        total_cost: result?.optimization?.total_cost || 0,
        avg_quality_score: result?.optimization?.avg_quality_score || 80
      };
      
      const { order } = await createOrder(orderData);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error('Razorpay payment gateway failed to load');

      const payRes = await payOrder(order.id);

      const options = {
        key: payRes.key_id || 'rzp_test_TVRZfo8ZHR732a',
        amount: payRes.amount || Math.round((order.total_cost || 1000) * 100),
        currency: payRes.currency || 'INR',
        name: 'Bhoomi Carbon Exchange',
        description: `Carbon Credit Settlement - Order #${order.id}`,
        // Only include order_id if it's a valid Razorpay server order ID
        ...(payRes.razorpay_order_id && !payRes.razorpay_order_id.startsWith('rzp_ord_')
          ? { order_id: payRes.razorpay_order_id }
          : {}),
        handler: async function (response) {
          try {
            setCheckoutState({ status: 'verifying', orderDetails: null, error: null });
            const verifyRes = await verifyPayment(order.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setCheckoutState({ status: 'success', orderDetails: verifyRes.order || order, error: null });
          } catch (err) {
            console.error('[Buyer Checkout] Verification error:', err);
            setCheckoutState({ status: 'error', orderDetails: null, error: 'Verification failed' });
          }
        },
        prefill: {
          name: result?.company?.company_name || 'Corporate Buyer',
          email: 'buyer@bhoomicarbon.in',
          contact: '9999999999'
        },
        theme: {
          color: '#164e2e'
        },
        modal: {
          ondismiss: function() {
            if (checkoutState.status === 'processing') {
              setShowCheckoutModal(false);
              setCheckoutState({ status: 'idle', orderDetails: null, error: null });
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.warn('[Buyer Checkout] Payment failed event:', resp);
        setCheckoutState({ status: 'error', orderDetails: null, error: resp?.error?.description || 'Payment was declined or cancelled' });
      });
      rzp.open();

    } catch (err) {
      console.error('[Buyer Checkout] Error:', err);
      setCheckoutState({ status: 'error', orderDetails: null, error: err.message || 'Checkout failed' });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!companyInput.trim()) return;

    setLoading(true);
    setErrorStatus(null);
    setResult(null);

    try {
      const data = await optimizeCompany(companyInput.trim());
      setResult(data);
    } catch (err) {
      console.warn('[Buyer] optimize error:', err);
      if (err.status === 404 || err.message?.includes('not found') || err.message?.includes('database')) {
        setErrorStatus(404);
      } else {
        setErrorStatus(500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (name) => {
    setCompanyInput(name);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 pb-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-4 py-1 text-xs font-bold text-forest-800 border border-forest-200 mb-4">
          <Building2 size={15} className="text-forest-700" />
          <span>Corporate Net-Zero & ESG Compliance Hub</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950">
          {t('buyer.title')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
          {t('buyer.subtitle')}
        </p>
      </div>

      {/* STEP 1: COMPANY SEARCH INPUT */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              list="bee-companies"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder={t('buyer.search_placeholder') || 'Search or select your company...'}
              className="w-full rounded-2xl border border-sand-300 bg-white py-4 pl-12 pr-4 text-base font-bold text-slate-900 shadow-sm transition-all focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-100 placeholder:text-slate-400"
            />
            <datalist id="bee-companies">
              {BEE_CCTS_COMPANIES.map(c => (
                <option key={c.name} value={c.name}>{c.sector}</option>
              ))}
            </datalist>
          </div>

          <button
            type="submit"
            disabled={loading || !companyInput.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-800 px-7 py-4 text-base font-bold text-white shadow-lg shadow-forest-950/20 hover:bg-forest-900 focus:outline-none focus:ring-4 focus:ring-forest-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading ? (
              <span>{t('buyer.searching')}</span>
            ) : (
              <>
                <span>{t('buyer.search_btn')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* BEE CCTS COMPANY DIRECTORY — All companies grouped by sector */}
      {!result && !errorStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto mb-12 rounded-3xl border border-sand-300 bg-white p-5 sm:p-7 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                BEE PAT Scheme — Designated Consumers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Click any company to analyze its carbon credit requirement
              </p>
            </div>
            <span className="text-xs font-bold text-forest-800 bg-forest-50 border border-forest-200 px-3 py-1 rounded-full whitespace-nowrap">
              {BEE_CCTS_COMPANIES.length} Entities
            </span>
          </div>

          <div className="space-y-4">
            {/* Group companies by sector */}
            {Object.entries(
              BEE_CCTS_COMPANIES.reduce((acc, c) => {
                if (!acc[c.sector]) acc[c.sector] = [];
                acc[c.sector].push(c);
                return acc;
              }, {})
            ).map(([sector, companies]) => (
              <div key={sector}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    {sector}
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-400">
                    {companies.length} {companies.length === 1 ? 'entity' : 'entities'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {companies.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setCompanyInput(c.name);
                        setResult(null);
                        setErrorStatus(null);
                        // Auto-submit after setting the name
                        setTimeout(() => {
                          const form = document.querySelector('form');
                          if (form) form.requestSubmit();
                        }, 50);
                      }}
                      className="rounded-xl bg-sand-50 border border-sand-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-forest-50 hover:border-forest-300 hover:text-forest-900 transition-all cursor-pointer whitespace-nowrap"
                      title={`${c.name} — ${c.state}`}
                    >
                      {c.name.length > 35 ? c.name.slice(0, 32) + '…' : c.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* STEP 5: 404 / COMPANY NOT FOUND STATE */}
      {errorStatus === 404 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto rounded-3xl border border-sand-300 bg-white p-8 sm:p-10 text-center shadow-sm"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-4 border border-amber-200">
            <AlertCircle size={28} />
          </div>
          <h3 className="font-display text-2xl font-bold text-slate-900">
            {t('buyer.not_found_title')}
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
            {t('buyer.not_found_desc')}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400 border border-slate-200 cursor-not-allowed select-none">
            <BotOff size={15} />
            <span>{t('buyer.ai_lookup_coming_soon')}</span>
          </div>
        </motion.div>
      )}

      {/* STEP 2 & 3: SUCCESSFUL OPTIMIZATION RESULT */}
      {result && result.company && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* STEP 2: COMPANY LIABILITY & PROGRESS GAP INDICATOR */}
          <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-forest-800 bg-forest-50 px-3 py-1 rounded-lg border border-forest-200">
                  {result.company.sector}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {result.company.company_name}
                </h2>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">{t('buyer.need_credits')}</div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                    {(result.company.required_credits || 0).toLocaleString()} t
                  </div>
                </div>
                <div className="h-9 w-px bg-slate-200" />
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">{t('buyer.have_credits')}</div>
                  <div className="font-display text-xl sm:text-2xl font-extrabold text-forest-700">
                    {(result.company.current_holdings || 0).toLocaleString()} t
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Progress Visual Bar */}
            <div className="mt-6">
              {result.gap <= 0 ? (
                /* Clear Success State: Requirement Already Met */
                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-6 sm:p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-emerald-950">
                    {t('buyer.met_requirement_title')}
                  </h3>
                  <p className="mt-2 text-sm text-emerald-800 max-w-lg mx-auto font-medium">
                    {t('buyer.met_requirement_desc', {
                      holdings: (result.company.current_holdings || 0).toLocaleString(),
                      target: (result.company.required_credits || 0).toLocaleString()
                    })}
                  </p>
                </div>
              ) : (
                /* Active Procurement Gap Progress Bar */
                <div>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-2 flex-wrap gap-2">
                    <span className="text-slate-700">
                      You need <strong className="text-slate-900">{result.company.required_credits.toLocaleString()}</strong> credits — you currently have <strong className="text-forest-700">{result.company.current_holdings.toLocaleString()}</strong>
                    </span>
                    <span className="text-rose-700 font-extrabold">
                      {t('buyer.gap_label')}: {result.gap.toLocaleString()} tCO2e
                    </span>
                  </div>

                  <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-forest-600 to-emerald-500 transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (result.company.current_holdings / (result.company.required_credits || 1)) * 100
                          )
                        )}%`
                      }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Fulfillment: {Math.round((result.company.current_holdings / (result.company.required_credits || 1)) * 100)}%</span>
                    <span>Remaining ESG Liability: {result.gap.toLocaleString()} credits</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: OPTIMIZED PURCHASE PLAN (if gap > 0) */}
          {result.gap > 0 && result.optimization && (
            <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {t('buyer.plan_title')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                    {t('buyer.plan_subtitle')}
                  </p>
                </div>

                {/* Blended Quality Indicator & Total Cost Badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  
                  {/* Blended Quality Score Indicator */}
                  <div className="flex items-center gap-2 rounded-2xl bg-forest-50 border border-forest-200 px-4 py-2.5">
                    <Sparkles size={18} className="text-forest-700" />
                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-forest-700 tracking-wider">
                        {t('buyer.avg_quality')}
                      </div>
                      <div className="font-display text-lg font-extrabold text-forest-900">
                        {result.optimization.avg_quality_score}/100
                      </div>
                    </div>
                  </div>

                  {/* Total Estimated Cost in Active Currency */}
                  <div className="flex items-center gap-2 rounded-2xl bg-forest-950 text-white px-4 py-2.5 shadow-md border border-forest-800">
                    <TrendingUp size={18} className="text-emerald-300" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-forest-300 tracking-wider">
                        {t('buyer.total_cost')}
                      </div>
                      <div className="font-display text-lg font-extrabold text-white">
                        {formatPrice(result.optimization.total_cost)}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Selected Listings Cards Grid */}
              <div className="space-y-4">
                {(result.optimization.selected_listings || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 rounded-2xl border border-sand-300 bg-sand-50/40 hover:bg-white hover:border-forest-400 transition-all gap-4 shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-md">
                          {item.project_type}
                        </span>
                        <QualityBadge quality_badge={item.quality_badge} score={item.quality_score} size="sm" />
                      </div>

                      <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">
                        {item.project_name}
                      </h4>

                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 font-medium">
                        <span>Registry: <strong>{item.registry}</strong></span>
                        <span>•</span>
                        <span>Vintage: <strong>{item.vintage_year}</strong></span>
                      </div>

                      {/* Distinct Anomaly Badge if is_anomaly is true */}
                      {item.is_anomaly && (
                        <div className="mt-2.5">
                          <AnomalyBadge riskScore={item.anomaly_risk_score} compact={true} />
                        </div>
                      )}
                    </div>

                    {/* Allocation and Price Columns */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-slate-500">{t('buyer.credits_allocated')}</div>
                        <div className="font-display text-base sm:text-lg font-bold text-slate-900">
                          {(item.credits_taken || 0).toLocaleString()} t
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-500">{t('buyer.unit_price')}</div>
                        <div className="font-display text-base sm:text-lg font-extrabold text-forest-900">
                          {formatPrice(item.fair_price)}
                          <span className="text-xs font-sans font-normal text-slate-500">/t</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* STEP 4: PROCEED TO PURCHASE BUTTON */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600 font-medium">
                  Total fulfillment: <strong>{result.optimization.total_credits_filled.toLocaleString()}</strong> of {result.gap.toLocaleString()} tCO2e required credits.
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-800 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-forest-950/20 hover:bg-forest-900 hover:scale-[1.01] transition-all"
                >
                  <ShoppingBag size={19} />
                  <span>{t('buyer.proceed_btn')}</span>
                </button>
              </div>

            </div>
          )}
        </motion.div>
      )}

      {/* STEP 4: RAZORPAY CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (checkoutState.status !== 'processing' && checkoutState.status !== 'verifying') {
                  setShowCheckoutModal(false);
                }
              }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-sand-300 text-center my-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>

              {checkoutState.status === 'processing' || checkoutState.status === 'verifying' ? (
                <div className="py-6 flex flex-col items-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-100 text-forest-800 mb-4 animate-pulse">
                    <ShoppingBag size={30} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {checkoutState.status === 'processing' ? 'Connecting to Payment Gateway...' : 'Verifying Transaction...'}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 font-medium">
                    {checkoutState.status === 'processing' ? 'Opening Razorpay Secure Checkout window...' : 'Confirming HMAC cryptographical signature...'}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Razorpay Sandbox Active</span>
                  </div>
                </div>
              ) : checkoutState.status === 'success' ? (
                <div className="py-4 flex flex-col items-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner shadow-emerald-200/50">
                    <CheckCircle2 size={36} className="drop-shadow-sm" />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-slate-900">Payment Successful!</h3>
                  <p className="mt-1.5 text-sm text-slate-600 font-medium">Your carbon credit purchase is confirmed & settled.</p>
                  
                  <div className="mt-5 w-full p-4 rounded-2xl bg-sand-50 border border-sand-200 text-left space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Order ID:</span>
                      <span className="font-mono font-bold text-slate-800">#{checkoutState.orderDetails?.id || 'SETTLED'}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Payment Status:</span>
                      <span className="font-bold text-emerald-700 capitalize">Completed (Verified)</span>
                    </div>
                    {checkoutState.orderDetails?.razorpay_payment_id && (
                      <div className="flex justify-between text-slate-600">
                        <span>Payment ID:</span>
                        <span className="font-mono text-slate-800">{checkoutState.orderDetails.razorpay_payment_id}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => { setShowCheckoutModal(false); setCheckoutState({ status: 'idle', orderDetails: null, error: null }); }}
                    className="mt-6 w-full rounded-2xl bg-forest-800 py-3.5 text-sm font-bold text-white hover:bg-forest-900 transition-all shadow-md shadow-forest-900/20 hover:scale-[1.01]"
                  >
                    Done & View Portfolio
                  </button>
                </div>
              ) : checkoutState.status === 'error' ? (
                <div className="py-4 flex flex-col items-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
                    <AlertCircle size={36} />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">Payment Not Completed</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                    {checkoutState.error || 'Payment was cancelled or closed before completion.'}
                  </p>
                  <div className="mt-6 w-full flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="w-full rounded-2xl bg-forest-800 py-3.5 text-sm font-bold text-white hover:bg-forest-900 transition-colors shadow-sm"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="w-full rounded-2xl bg-sand-200 py-3 text-sm font-bold text-slate-700 hover:bg-sand-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
