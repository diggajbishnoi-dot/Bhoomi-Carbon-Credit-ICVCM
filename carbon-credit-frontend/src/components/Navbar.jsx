import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Leaf, 
  Globe, 
  ChevronDown, 
  HelpCircle, 
  ShieldAlert, 
  Calculator, 
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTranslation, LANGUAGES } from '../i18n/I18nContext';
import { useCurrency } from '../utils/currency';

export default function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [knowMoreOpen, setKnowMoreOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const knowMoreRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (knowMoreRef.current && !knowMoreRef.current.contains(e.target)) {
        setKnowMoreOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setKnowMoreOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Primary direct navigation links
  const primaryLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/buyer', label: t('nav.buyer') },
    { to: '/seller', label: t('nav.seller') },
    { to: '/market-prices', label: t('nav.market_prices') },
    { to: '/browse-credits', label: t('nav.browse_credits') },
  ];

  // Secondary Educational "Know More" links
  const knowMoreLinks = [
    {
      to: '/what-is-carbon-credit',
      title: t('nav.what_is_carbon'),
      desc: 'Understand 1t CO2e units, VCM vs Compliance',
      icon: HelpCircle,
      badge: 'Basics'
    },
    {
      to: '/greenwashing',
      title: t('nav.greenwashing'),
      desc: 'ICVCM scoring + Isolation Forest anomaly detection',
      icon: ShieldAlert,
      badge: 'Integrity'
    },
    {
      to: '/pricing-explained',
      title: t('nav.pricing_explained'),
      desc: 'Formula: Benchmark × Multiplier + Rules Matrix',
      icon: Calculator,
      badge: 'Formula'
    },
  ];

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  const isKnowMoreActive = knowMoreLinks.some((item) => location.pathname === item.to);
  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sand-300/80 bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-[68px]">

          {/* ─── LEFT: Brand Logo — pinned to corner ─── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 mr-8">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-forest-900 text-white shadow-md shadow-forest-950/20 group-hover:scale-105 transition-transform">
              <Leaf size={20} className="text-emerald-300" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-forest-950 leading-none whitespace-nowrap">
                  {t('nav.brand')}
                </span>
                <span className="text-[9px] font-bold uppercase bg-emerald-100/90 text-emerald-900 px-1.5 py-0.5 rounded tracking-wide border border-emerald-200 leading-none">
                  ICVCM
                </span>
              </div>
              <span className="text-[10px] font-medium text-forest-700/80 tracking-wide mt-0.5 hidden sm:block leading-none">
                {t('nav.tagline')}
              </span>
            </div>
          </Link>

          {/* ─── CENTER: Desktop Navigation Links ─── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {primaryLinks.map((link) => {
              const active = isLinkActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'text-forest-950 font-bold bg-forest-100/80 shadow-sm'
                      : 'text-slate-600 hover:text-forest-950 hover:bg-forest-50/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* "Know More" Dropdown Button */}
            <div className="relative" ref={knowMoreRef}>
              <button
                onClick={() => setKnowMoreOpen(!knowMoreOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
                  isKnowMoreActive || knowMoreOpen
                    ? 'text-forest-950 font-bold bg-forest-100/80 shadow-sm'
                    : 'text-slate-600 hover:text-forest-950 hover:bg-forest-50/70'
                }`}
              >
                <BookOpen size={14} className="text-forest-700" />
                <span>Know More</span>
                <ChevronDown
                  size={13}
                  className={`text-slate-500 transition-transform duration-200 ${
                    knowMoreOpen ? 'rotate-180 text-forest-900' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {knowMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl bg-white p-2 shadow-2xl border border-sand-300 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Integrity & Methodology
                    </div>
                    {knowMoreLinks.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setKnowMoreOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                            isCurrent
                              ? 'bg-forest-50 border border-forest-200'
                              : 'hover:bg-sand-50'
                          }`}
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-100 text-forest-800 flex-shrink-0 mt-0.5">
                            <Icon size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-serif font-bold text-sm text-slate-900">
                                {item.title}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ─── RIGHT: Currency + Language + Mobile Toggle ─── */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-8">
            
            {/* Currency Switcher */}
            <div className="relative flex items-center bg-sand-200/80 p-0.5 rounded-full border border-sand-300/80 shadow-inner">
              <button
                onClick={() => setCurrency('INR')}
                className={`relative z-10 px-2 py-1 text-[11px] font-bold transition-colors rounded-full ${
                  currency === 'INR' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`relative z-10 px-2 py-1 text-[11px] font-bold transition-colors rounded-full ${
                  currency === 'USD' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                $ USD
              </button>

              {/* Sliding background indicator */}
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute top-0.5 bottom-0.5 rounded-full bg-forest-900 shadow-sm"
                style={{
                  left: currency === 'INR' ? '2px' : '50%',
                  right: currency === 'INR' ? '50%' : '2px',
                }}
              />
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-sand-300 bg-white hover:bg-sand-50 text-[11px] font-bold text-slate-800 shadow-sm transition-all"
              >
                <Globe size={13} className="text-forest-700" />
                <span>{currentLangObj.nativeLabel}</span>
                <ChevronDown
                  size={11}
                  className={`text-slate-400 transition-transform duration-200 ${
                    langOpen ? 'rotate-180 text-forest-800' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 rounded-2xl bg-white p-1.5 shadow-2xl border border-sand-300 z-50"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                      Select Language
                    </div>
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-bold transition-colors ${
                          language === l.code
                            ? 'bg-forest-100 text-forest-950'
                            : 'text-slate-700 hover:bg-sand-50 hover:text-forest-900'
                        }`}
                      >
                        <span>{l.nativeLabel}</span>
                        <span className="text-[11px] font-normal text-slate-500 font-sans">
                          {l.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-xl p-2 text-slate-700 hover:bg-sand-100 hover:text-forest-950 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden border-t border-sand-300 bg-[#FAF7F2] px-4 py-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Main Directory
              </div>
              {primaryLinks.map((link) => {
                const active = isLinkActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      active
                        ? 'bg-forest-100 text-forest-950'
                        : 'text-slate-700 hover:bg-sand-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="h-2 w-2 rounded-full bg-forest-700" />}
                  </Link>
                );
              })}

              <div className="mt-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Know More & Methodology
              </div>
              {knowMoreLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-sand-100"
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon size={16} className="text-forest-700" />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
