import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';

/**
 * QualityBadge Component
 * Reusable visual indicator for carbon credit quality signals:
 * - Green (tick) = High Quality
 * - Yellow (triangle) = Medium Quality
 * - Red (cross) = Low Quality
 */
export default function QualityBadge({ quality_badge = 'yellow', score = null, showLabel = true, size = 'md' }) {
  const { t } = useTranslation();
  const badgeKey = (quality_badge || 'yellow').toLowerCase();

  const configs = {
    green: {
      label: t('quality.green'),
      desc: t('quality.green_desc'),
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      dotColor: 'bg-emerald-500'
    },
    yellow: {
      label: t('quality.yellow'),
      desc: t('quality.medium_desc'),
      bg: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      dotColor: 'bg-amber-500'
    },
    red: {
      label: t('quality.red'),
      desc: t('quality.low_desc'),
      bg: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
      icon: XCircle,
      iconColor: 'text-rose-600',
      dotColor: 'bg-rose-500'
    }
  };

  const current = configs[badgeKey] || configs.yellow;
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-xs sm:text-sm gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm sm:text-base gap-2 font-medium'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const formatScore = (val) => {
    if (val === null || val === undefined) return null;
    const n = Number(val);
    if (isNaN(n)) return null;
    if (n > 10) return Math.min(100, Math.max(0, Math.round(n)));
    return Math.min(96, Math.max(12, Math.round(50 + n * 12)));
  };

  const displayScore = formatScore(score);

  return (
    <span
      title={current.desc}
      className={`inline-flex items-center rounded-full border shadow-sm font-semibold transition-colors select-none whitespace-nowrap ${current.bg} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <IconComponent size={iconSizes[size] || 16} className={`${current.iconColor} flex-shrink-0`} />
      {showLabel && <span>{current.label}</span>}
      {displayScore !== null && (
        <span className="ml-1 opacity-90 text-[11px] font-mono font-bold">
          ({displayScore}/100)
        </span>
      )}
    </span>
  );
}
