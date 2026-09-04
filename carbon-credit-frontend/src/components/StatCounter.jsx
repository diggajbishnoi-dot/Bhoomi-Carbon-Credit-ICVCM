import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * StatCounter Component
 * Smooth count-up animation using Framer Motion when scrolled into view.
 */
export default function StatCounter({
  target = 0,
  label = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.5,
  className = ''
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseFloat(target) || 0;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue).toLocaleString();

  return (
    <div ref={ref} className={`flex flex-col items-center text-center ${className}`}>
      <div className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-forest-900">
        <span className="text-forest-600 font-sans text-2xl sm:text-3xl mr-0.5">{prefix}</span>
        <span>{formatted}</span>
        <span className="text-forest-600 font-sans text-xl sm:text-2xl ml-0.5">{suffix}</span>
      </div>
      {label && (
        <span className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600">
          {label}
        </span>
      )}
    </div>
  );
}
