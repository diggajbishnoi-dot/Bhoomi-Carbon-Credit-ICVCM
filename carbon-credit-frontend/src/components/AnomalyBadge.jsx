import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../i18n/I18nContext';

export default function AnomalyBadge({ riskScore = 0, isAnomaly = false, compact = false }) {
  const { t } = useTranslation();

  const numScore = Math.round(Number(riskScore) || 0);
  const isFlagged = isAnomaly || numScore >= 70;

  let theme = '';
  let Icon = ShieldCheck;
  let label = '';
  
  if (isFlagged) {
    theme = 'border-rose-300 bg-rose-50/90 text-rose-950 icon-bg-rose-100 icon-text-rose-700 label-rose-950 score-bg-rose-200 score-text-rose-950';
    Icon = ShieldAlert;
    label = '🚨 Anomaly Detected';
  } else if (numScore >= 40) {
    theme = 'border-amber-300 bg-amber-50/90 text-amber-950 icon-bg-amber-100 icon-text-amber-700 label-amber-950 score-bg-amber-200 score-text-amber-950';
    Icon = AlertTriangle;
    label = 'Moderate Anomaly Risk';
  } else {
    theme = 'border-emerald-200 bg-emerald-50/90 text-emerald-950 icon-bg-emerald-100 icon-text-emerald-700 label-emerald-950 score-bg-emerald-200 score-text-emerald-950';
    Icon = ShieldCheck;
    label = 'Low Anomaly Risk';
  }

  // extract classes
  const classes = theme.split(' ').reduce((acc, cls) => {
    if (cls.startsWith('icon-bg-')) acc.iconBg = cls.replace('icon-bg-', 'bg-');
    else if (cls.startsWith('icon-text-')) acc.iconText = cls.replace('icon-text-', 'text-');
    else if (cls.startsWith('label-')) acc.label = cls.replace('label-', 'text-');
    else if (cls.startsWith('score-bg-')) acc.scoreBg = cls.replace('score-bg-', 'bg-');
    else if (cls.startsWith('score-text-')) acc.scoreText = cls.replace('score-text-', 'text-');
    else acc.main.push(cls);
    return acc;
  }, { main: [], iconBg: '', iconText: '', label: '', scoreBg: '', scoreText: '' });

  return (
    <div
      title="AI Greenwashing Risk Assessment"
      className={`inline-flex items-center gap-2 rounded-lg border shadow-sm backdrop-blur-sm transition-all w-full ${classes.main.join(' ')} ${
        compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs sm:text-sm'
      }`}
    >
      <div className={`flex flex-shrink-0 items-center justify-center rounded-full ${classes.iconBg} ${classes.iconText} ${compact ? 'h-4 w-4' : 'h-5 w-5'}`}>
        <Icon size={compact ? 10 : 13} />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`font-semibold truncate ${classes.label}`}>
          {label}
        </span>
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold ml-auto flex-shrink-0 ${classes.scoreBg} ${classes.scoreText}`}>
          Risk: {numScore}%
        </span>
      </div>
    </div>
  );
}
