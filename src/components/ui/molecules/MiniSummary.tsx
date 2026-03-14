/**
 * MiniSummary.tsx - Refactored Molecule
 * Compact summary cards with gaming aesthetic
 * 
 * Uses design tokens from global.css
 * Features neon glow effects and status-based colors
 */

import { DollarSign, Clock, Target } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils';
import { HOME_SCREEN } from '../../../data/ui-strings';
import { MetricCard } from './MetricCard';

interface MiniSummaryProps {
  totalMargin?: number;
  tripCount?: number;
  activeMinutes?: number;
  compact?: boolean;
}

export const MiniSummary: React.FC<MiniSummaryProps> = ({
  totalMargin = 0,
  tripCount = 0,
  activeMinutes,
  compact = false
}) => {
  if (tripCount === 0) return null;

  const s = HOME_SCREEN.stats;

  return (
    <div className={cn(
      "grid gap-3 animate-fade-in animate-zoom-in",
      compact ? "grid-cols-3" : "grid-cols-3"
    )}>
      {/* Ganancia Neta */}
      <MetricCard
        label={s.earned.label}
        value={formatCurrency(totalMargin)}
        variant="primary"
        glow={!compact}
        compact={compact}
        icon={DollarSign}
        className={cn(!compact && 'hover:scale-105')}
      />

      {/* Tiempo Activo */}
      {activeMinutes !== undefined && activeMinutes > 0 && (
        <MetricCard
          label={s.active.label}
          value={activeMinutes}
          unit={s.active.unit}
          variant="secondary"
          glow={!compact}
          compact={compact}
          icon={Clock}
          className={cn(!compact && 'hover:scale-105', !compact && 'col-span-1')} // Changed from col-span-2 to keep it uniform
        />
      )}

      {/* Viajes */}
      <MetricCard
        label={s.trips.label}
        value={tripCount}
        variant="default"
        compact={compact}
        icon={Target}
        className={cn(!compact && 'hover:scale-105')}
      />
    </div>
  );
};

MiniSummary.displayName = 'MiniSummary';