/**
 * MiniSummary.tsx - Refactored Molecule
 * Compact summary cards with gaming aesthetic
 * 
 * Uses design tokens from global.css
 * Features neon glow effects and status-based colors
 */

import React from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatCurrency } from '../../../lib/utils';

interface MiniSummaryProps {
  totalMargin?: number;
  tripCount?: number;
  /** Tiempo activo acumulado del día en minutos */
  activeMinutes?: number;
  /** Versión minimalista sin fondo/bordes propios */
  compact?: boolean;
}

export const MiniSummary: React.FC<MiniSummaryProps> = ({
  totalMargin = 0,
  tripCount = 0,
  activeMinutes,
  compact = false
}) => {
  // Don't render if no trips
  if (tripCount === 0) return null;

  return (
    <div className={cn(
      "grid gap-3 animate-fade-in animate-zoom-in",
      compact ? "grid-cols-3 lg:grid-cols-3" : "grid-cols-3"
    )}>
      {/* Ganancia Neta (Success State) */}
      <div
        className={cn(
          'glass rounded-2xl p-4',
          compact ? 'border-none bg-transparent shadow-none p-0' : 'border-2 border-primary/30 bg-primary/5 shadow-[0_0_20px_var(--color-primary-glow)]',
          'transition-all duration-300',
          !compact && 'hover:scale-105 hover:shadow-[0_0_30px_var(--color-primary-glow)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
            Plata en mano
          </span>
        </div>

        {/* Value */}
        <p className={cn(
          "font-extrabold text-primary leading-tight",
          compact ? "text-lg" : "text-xl"
        )}>
          {formatCurrency(totalMargin)}
        </p>
      </div>

      {activeMinutes !== undefined && activeMinutes > 0 && (
        <div
          className={cn(
            compact ? 'col-span-1' : 'col-span-2',
            'glass rounded-2xl p-4',
            compact ? 'border-none bg-transparent shadow-none p-0' : 'border-2 border-secondary/30 bg-secondary/5 shadow-[0_0_15px_var(--color-secondary-glow)]',
            'transition-all duration-300',
            !compact && 'hover:scale-105 hover:shadow-[0_0_25px_var(--color-secondary-glow)]'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-secondary" />
            <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
              Activo
            </span>
          </div>

          {/* Value */}
          <p className={cn(
            "font-extrabold text-secondary leading-tight",
            compact ? "text-lg" : "text-xl"
          )}>
            {activeMinutes}
            <span className="text-xs font-bold text-white/50 ml-1">min</span>
          </p>
        </div>
      )}

      {/* Cantidad de Viajes (Info State) */}
      <div
        className={cn(
          'glass rounded-2xl p-4',
          compact ? 'border-none bg-transparent shadow-none p-0' : 'border-2 border-secondary/30 bg-secondary/5',
          'transition-all duration-300',
          !compact && 'hover:scale-105'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-3 h-3 text-secondary" />
          <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">
            Viajes
          </span>
        </div>

        {/* Value */}
        <p className={cn(
          "font-extrabold text-starlight leading-tight",
          compact ? "text-lg" : "text-xl"
        )}>
          {tripCount}
        </p>
      </div>

    </div>
  );
};

MiniSummary.displayName = 'MiniSummary';