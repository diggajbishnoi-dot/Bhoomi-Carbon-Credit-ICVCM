import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Layers, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { getCredits, deleteCredit } from '../api';
import CreditCard from '../components/CreditCard';
import BreakdownModal from '../components/BreakdownModal';
import { useTranslation } from '../i18n/I18nContext';

export default function BrowseCredits() {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    project_type: '',
    quality_badge: '',
    registry: '',
    searchTerm: '',
  });

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch from backend API whenever structured filters change
  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const queryParams = {};
        if (filters.project_type) queryParams.project_type = filters.project_type;
        if (filters.quality_badge) queryParams.quality_badge = filters.quality_badge;
        if (filters.registry) queryParams.registry = filters.registry;

        const res = await getCredits(queryParams);
        setListings(res.listings || []);
      } catch (err) {
        console.error('[BrowseCredits] Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [filters.project_type, filters.quality_badge, filters.registry]);

  // Client-side text search filter
  const displayedListings = listings.filter((item) => {
    if (!filters.searchTerm) return true;
    const term = filters.searchTerm.toLowerCase();
    return (
      (item.project_name || '').toLowerCase().includes(term) ||
      (item.methodology || '').toLowerCase().includes(term) ||
      (item.registry || '').toLowerCase().includes(term) ||
      (item.project_type || '').toLowerCase().includes(term)
    );
  });

  const handleDeleteCredit = async (id) => {
    try {
      const res = await deleteCredit(id);
      if (res.success) {
        setListings(prev => prev.filter(l => l.id !== id));
        if (selectedListing?.id === id) {
          setIsModalOpen(false);
          setSelectedListing(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Failed to delete listing. It may already be removed.');
    }
  };

  const handleCardClick = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      project_type: '',
      quality_badge: '',
      registry: '',
      searchTerm: '',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 pb-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3.5 py-1 text-xs font-semibold text-forest-800 border border-forest-200 mb-4">
          <Layers size={14} className="text-forest-700" />
          <span>{t('browse_credits.title')}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-forest-950">
          {t('browse_credits.title')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          {t('browse_credits.subtitle')}
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-3xl border border-sand-300 bg-white p-5 sm:p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              placeholder={t('browse_credits.search_placeholder')}
              className="w-full rounded-2xl border border-sand-300 bg-sand-50/50 py-3 pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-900 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-100"
            />
          </div>

          {/* Project Type Filter */}
          <div>
            <select
              value={filters.project_type}
              onChange={(e) => setFilters({ ...filters, project_type: e.target.value })}
              className="w-full rounded-2xl border border-sand-300 bg-sand-50/50 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-800 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-100"
            >
              <option value="">{t('browse_credits.all_types')}</option>
              <option value="Biochar">Biochar</option>
              <option value="ARR">ARR (Afforestation)</option>
              <option value="REDD+">REDD+ (Forest Avoidance)</option>
              <option value="IFM">IFM (Forest Management)</option>
              <option value="ERW">ERW (Rock Weathering)</option>
              <option value="DAC">DAC (Direct Air Capture)</option>
            </select>
          </div>

          {/* Quality Badge Filter */}
          <div>
            <select
              value={filters.quality_badge}
              onChange={(e) => setFilters({ ...filters, quality_badge: e.target.value })}
              className="w-full rounded-2xl border border-sand-300 bg-sand-50/50 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-800 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-100"
            >
              <option value="">{t('browse_credits.all_badges')}</option>
              <option value="green">{t('quality.green')} (Green Tick)</option>
              <option value="yellow">{t('quality.yellow')} (Yellow Warning)</option>
              <option value="red">{t('quality.red')} (Red Alert)</option>
            </select>
          </div>

          {/* Registry Filter & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={filters.registry}
              onChange={(e) => setFilters({ ...filters, registry: e.target.value })}
              className="w-full rounded-2xl border border-sand-300 bg-sand-50/50 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-800 focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-100"
            >
              <option value="">{t('browse_credits.all_registries')}</option>
              <option value="Puro.earth">Puro.earth</option>
              <option value="Gold Standard">Gold Standard</option>
              <option value="Verra">Verra (VCS)</option>
              <option value="CDM">Clean Development Mechanism</option>
              <option value="Unregistered">Unregistered / Self-Declared</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="rounded-2xl border border-sand-300 bg-sand-100 p-3 text-slate-600 hover:bg-forest-100 hover:text-forest-900 transition-colors flex-shrink-0"
            >
              <RotateCcw size={16} />
            </button>
          </div>

        </div>

        {/* Results Counter Sub-header */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {t('browse_credits.results_found', { count: displayedListings.length })}
          </span>
          {(filters.project_type || filters.quality_badge || filters.registry || filters.searchTerm) && (
            <span className="text-forest-700 font-semibold">Active filters applied</span>
          )}
        </div>
      </div>

      {/* CARD GRID */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-medium">
          Loading certified carbon credits...
        </div>
      ) : displayedListings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sand-300 bg-white p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-slate-400 mb-3" />
          <h3 className="font-serif text-lg font-bold text-slate-800">
            {t('browse_credits.no_results')}
          </h3>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-forest-800 px-4 py-2 text-xs font-semibold text-white hover:bg-forest-900"
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedListings.map((listing, index) => (
            <CreditCard
              key={listing.id || index}
              listing={listing}
              index={index}
              onSelect={handleCardClick}
              onDelete={handleDeleteCredit}
            />
          ))}
        </div>
      )}

      {/* FULL BREAKDOWN MODAL */}
      <BreakdownModal
        listing={selectedListing}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
