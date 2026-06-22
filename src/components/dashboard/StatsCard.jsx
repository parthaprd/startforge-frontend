'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Pinterest system: icon containers use surface-card bg with tinted icon text
// Only Pinterest Red is used as a highly saturated color — other accents are muted
const colorMap = {
  primary:   { iconBg: 'bg-[#ffe5e0]', iconText: 'text-primary' },
  secondary: { iconBg: 'bg-secondary-bg', iconText: 'text-mute' },
  success:   { iconBg: 'bg-success-pale', iconText: 'text-success-deep' },
  warning:   { iconBg: 'bg-[#fef3c7]', iconText: 'text-[#b45309]' },
  danger:    { iconBg: 'bg-[#ffe5e0]', iconText: 'text-error' },
};

export default function StatsCard({ icon: Icon, label, value, color = 'primary', trend, index = 0 }) {
  const colors = colorMap[color] || colorMap.primary;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card-base p-5"
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-md', colors.iconBg)}>
          {Icon && <Icon className={cn('h-5 w-5', colors.iconText)} />}
        </div>
        {trend !== undefined && (
          <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', trend >= 0 ? 'text-success-deep' : 'text-error')}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-ink">{value}</p>
      <p className="text-sm text-mute">{label}</p>
    </motion.div>
  );
}
