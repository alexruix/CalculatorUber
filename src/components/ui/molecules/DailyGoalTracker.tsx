/**
 * DailyGoalTracker.tsx - Refactored Molecule
 * Daily goal tracker with gaming progress bar and neon effects
 * 
 * Uses design tokens from global.css
 * Features animated progress bar, achievement states, XP-style visuals
 */

import React, { useMemo } from 'react';
import { Target, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { formatCurrency } from '../../../lib/utils';
import type { SavedTrip } from '../../../types/calculator.types';

interface DailyGoalTrackerProps {
  dailyGoal: number;
  dailyHours: number;
  todayTrips: SavedTrip[];
  onGoalChange: (value: number) => void;
  onHoursChange: (value: number) => void;
}

export const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({
  dailyGoal,
  dailyHours,
  todayTrips,
  onGoalChange,
  onHoursChange,
}) => {
  const todayNet = useMemo(
    () => todayTrips.reduce((acc, t) => acc + t.margin, 0),
    [todayTrips]
  );

  const progressPct =
    dailyGoal > 0 ? Math.min(100, Math.round((todayNet / dailyGoal) * 100)) : 0;

  const isReached = dailyGoal > 0 && todayNet >= dailyGoal;
  const remaining = Math.max(0, dailyGoal - todayNet);

  return (
    <div className="space-y-4">
      {/* Goal Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Daily Goal Input */}
        <div className="space-y-2">
          <Label 
            htmlFor="daily-goal"
            variant="muted"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Target size={12} aria-hidden="true" />
            Meta diaria ($)
          </Label>
          
          <Input
            id="daily-goal"
            type="number"
            inputMode="numeric"
            value={dailyGoal || ''}
            onChange={(e) => onGoalChange(Number(e.target.value))}
            placeholder="40000"
            min="0"
            step="1000"
            suffix="$"
            size="sm"
          />
        </div>

        {/* Daily Hours Input */}
        <div className="space-y-2">
          <Label 
            htmlFor="daily-hours"
            variant="muted"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Clock size={12} aria-hidden="true" />
            Horas objetivo
          </Label>
          
          <Input
            id="daily-hours"
            type="number"
            inputMode="numeric"
            value={dailyHours || ''}
            onChange={(e) => onHoursChange(Number(e.target.value))}
            placeholder="8"
            min="1"
            max="24"
            step="0.5"
            suffix="hs"
            size="sm"
          />
        </div>
      </div>

      {/* Progress Card (only shown if goal is set) */}
      {dailyGoal > 0 && (
        <div
          className={cn(
            'p-4 rounded-3xl border-2 transition-all duration-500',
            isReached ? (
              // Achievement state (goal reached)
              'bg-primary/10 border-primary/30 shadow-[0_0_30px_var(--color-primary-glow)] animate-glow-pulse'
            ) : (
              // Default state (in progress)
              'bg-white/3 border-white/10'
            )
          )}
          role="status"
          aria-label={`Progreso diario: ${progressPct}% de la meta alcanzado`}
        >
          {/* Numbers Row */}
          <div className="flex items-end justify-between mb-3">
            {/* Today's Earnings */}
            <div>
              <p className="text-[10px] font-extrabold text-moon uppercase tracking-widest mb-0.5">
                Ganado hoy
              </p>
              <p
                className={cn(
                  'text-2xl font-extrabold leading-tight',
                  isReached ? 'text-primary' : 'text-starlight'
                )}
              >
                {formatCurrency(todayNet)}
              </p>
            </div>

            {/* Remaining / Goal Reached */}
            <div className="text-right">
              <p className="text-[10px] font-extrabold text-moon uppercase tracking-widest mb-0.5">
                {isReached ? '¡Meta!' : 'Faltan'}
              </p>
              <p
                className={cn(
                  'text-base font-extrabold leading-tight',
                  isReached ? 'text-primary text-2xl' : 'text-moon'
                )}
              >
                {isReached ? '🎯' : formatCurrency(remaining)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="h-3 bg-white/10 rounded-full overflow-hidden relative"
            aria-hidden="true"
          >
            <div
              className={cn(
                'h-full transition-all duration-500',
                isReached ? (
                  // Achievement gradient (green)
                  'bg-gradient-to-r from-primary to-evergreen'
                ) : (
                  // Default gradient (purple to green)
                  'bg-gradient-to-r from-secondary to-primary'
                )
              )}
              style={{ width: `${progressPct}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Progress Percentage */}
          <p className="text-[10px] font-extrabold text-moon uppercase tracking-widest mt-2 text-right">
            {progressPct}% completado
          </p>
        </div>
      )}

      {/* Empty State (no goal set) */}
      {dailyGoal === 0 && (
        <p className="text-sm text-moon font-medium text-center py-2">
          Seteá una meta para ver tu progreso en tiempo real 🎯
        </p>
      )}
    </div>
  );
};

DailyGoalTracker.displayName = 'DailyGoalTracker';