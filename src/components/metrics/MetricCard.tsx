import { memo } from 'react';
import { motion } from 'framer-motion';
import type { MetricCardProps } from '@types';

const accentToClasses: Record<NonNullable<MetricCardProps['accent']>, string> = {
  primary: 'text-primary border-primary/30',
  warning: 'text-warning border-warning/30',
  error: 'text-error border-error/30',
};

function MetricCardBase({ id, title, value, change, trend = 'flat', icon, accent = 'primary' }: MetricCardProps) {
  const changeColor = change && change !== 0 ? (change > 0 ? 'text-primary' : 'text-error') : 'text-white/70';
  const arrow = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■';
  const accentClasses = accentToClasses[accent];

  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="glass p-6 rounded-xl border border-white/10"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`size-9 grid place-items-center rounded-lg bg-white/10 border ${accentClasses}`}>
              {icon}
            </div>
          )}
          <h3 id={`${id}-title`} className="text-sm font-medium text-white/70 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold">{value}</div>
          {typeof change === 'number' && (
            <div className={`mt-1 text-sm font-medium ${changeColor}`}>
              <span className="mr-1">{arrow}</span>
              {Math.abs(change * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export const MetricCard = memo(MetricCardBase);


