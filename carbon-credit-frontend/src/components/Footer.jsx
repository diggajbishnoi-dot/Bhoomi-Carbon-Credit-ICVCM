import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, ExternalLink, Globe2 } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-forest-100 bg-[#F4F1EA] text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-800 text-white">
                <Leaf size={20} className="text-emerald-300" />
              </div>
              <span className="font-serif text-xl font-bold text-forest-950">
                {t('nav.brand')}
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-4">
              {t('footer.mission')}
            </p>
            <div className="flex items-center gap-2 text-xs text-forest-800 bg-forest-100/80 px-3 py-1.5 rounded-lg w-fit border border-forest-200">
              <ShieldCheck size={14} className="text-forest-700" />
              <span>Grounded in ICVCM Core Carbon Principles</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/buyer" className="hover:text-forest-900 transition-colors">
                  {t('nav.buyer')}
                </Link>
              </li>
              <li>
                <Link to="/seller" className="hover:text-forest-900 transition-colors">
                  {t('nav.seller')}
                </Link>
              </li>
              <li>
                <Link to="/market-prices" className="hover:text-forest-900 transition-colors">
                  {t('nav.market_prices')}
                </Link>
              </li>
              <li>
                <Link to="/browse-credits" className="hover:text-forest-900 transition-colors">
                  {t('nav.browse_credits')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Science & Integrity */}
          <div>
            <h4 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Integrity & Method
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/what-is-carbon-credit" className="hover:text-forest-900 transition-colors">
                  {t('nav.what_is_carbon')}
                </Link>
              </li>
              <li>
                <Link to="/greenwashing" className="hover:text-forest-900 transition-colors">
                  {t('nav.greenwashing')}
                </Link>
              </li>
              <li>
                <Link to="/pricing-explained" className="hover:text-forest-900 transition-colors">
                  {t('nav.pricing_explained')}
                </Link>
              </li>
              <li>
                <a
                  href="https://cbamguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-forest-900 transition-colors text-xs text-forest-700 font-medium mt-1"
                >
                  <span>CBAM Guide API</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Attribution */}
        <div className="border-t border-sand-300 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <div>
            <p>{t('footer.cbam_attr')}</p>
            <p className="mt-0.5">{t('footer.disclaimer')}</p>
          </div>
          <div className="text-forest-800 font-medium">
            {t('footer.rights')}
          </div>
        </div>

      </div>
    </footer>
  );
}
