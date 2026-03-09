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
  /** Ganancia Por Hora acumulada del día (EPH) */
  eph?: number;
}

export const MiniSummary: React.FC<MiniSummaryProps> = ({ 
  totalMargin = 0, 
  tripCount = 0, 
  eph 
}) => {
  // Don't render if no trips
  if (tripCount === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in animate-zoom-in">
      {/* Ganancia Neta (Success State) */}
      <div
        className={cn(
          'glass rounded-2xl p-4',
          'border-2 border-primary/30 bg-primary/5',
          'shadow-[0_0_20px_var(--color-primary-glow)]',
          'transition-all duration-300',
          'hover:scale-105 hover:shadow-[0_0_30px_var(--color-primary-glow)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-extrabold text-moon uppercase tracking-widest">
            Ganancia Neta
          </span>
        </div>
        
        {/* Value */}
        <p className="text-xl font-extrabold text-primary leading-tight">
          {formatCurrency(totalMargin)}
        </p>
      </div>

      {/* Cantidad de Turnos (Info State) */}
      <div
        className={cn(
          'glass rounded-2xl p-4',
          'border-2 border-secondary/30 bg-secondary/5',
          'transition-all duration-300',
          'hover:scale-105'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-3 h-3 text-secondary" />
          <span className="text-[10px] font-extrabold text-moon uppercase tracking-widest">
            Turnos
          </span>
        </div>
        
        {/* Value */}
        <p className="text-xl font-extrabold text-starlight leading-tight">
          {tripCount}
        </p>
      </div>

      {/* EPH: Ganancia Por Hora (only if available) */}
      {eph && eph > 0 && (
        <div
          className={cn(
            'col-span-2',
            'glass rounded-2xl p-4',
            'border-2 border-secondary/30 bg-secondary/5',
            'shadow-[0_0_15px_var(--color-secondary-glow)]',
            'transition-all duration-300',
            'hover:scale-105 hover:shadow-[0_0_25px_var(--color-secondary-glow)]'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-secondary" />
            <span className="text-[10px] font-extrabold text-moon uppercase tracking-widest">
              EPH — Ganancia Por Hora
            </span>
          </div>
          
          {/* Value */}
          <p className="text-xl font-extrabold text-secondary leading-tight">
            {formatCurrency(eph)}
            <span className="text-xs font-bold text-moon ml-1">/hr</span>
          </p>
        </div>
      )}
    </div>
  );
};

MiniSummary.displayName = 'MiniSummary';