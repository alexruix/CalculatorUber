/**
 * QuickStatsGrid.tsx — Dashboard de Métricas de Jornada
 * ─────────────────────────────────────────────────────────────
 * Grilla de métricas del día actual con gaming aesthetics.
 * La card de racha aparece solo si hay >= 3 viajes rentables.
 * Diseñada para escaneo rápido bajo el sol. Rendimiento optimizado.
 *
 * @molecule
 */
import React, { memo, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { HOME_SCREEN } from '../../../data/ui-strings';
import type { SavedTrip } from '../../../types/calculator.types';

interface QuickStats {
    trips: number;
    earned: number;
    eph: number;
    activeMinutes: number;
    waitMinutes: number;
    profitableStreak: number;
}

interface QuickStatsGridProps {
    trips: SavedTrip[];
    /** Si es true, pulsa las stats (animación al agregar viaje) */
    pulseOnUpdate?: boolean;
    /** Versión minimalista sin fondo/bordes propios */
    compact?: boolean;
    className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStats(trips: SavedTrip[]): QuickStats {
    let earned = 0;
    let activeMinutes = 0;
    let waitMinutes = 0;

    for (const t of trips) {
        earned += t.margin || 0;
        activeMinutes += t.duration || 0;
        waitMinutes += t.waitMinutes || 0;
    }

    const eph = activeMinutes > 0 ? Math.round((earned / activeMinutes) * 60) : 0;

    // Racha de viajes rentables consecutivos
    let streak = 0;
    for (const trip of trips) {
        if (trip.isProfitable ?? (trip.margin > 0)) {
            streak++;
        } else {
            break;
        }
    }

    return {
        trips: trips.length,
        earned,
        eph,
        activeMinutes,
        waitMinutes,
        profitableStreak: streak,
    };
}

import { MetricCard, type MetricVariant } from './MetricCard';

// ─── QuickStatsGrid ───────────────────────────────────────────────────────────

export const QuickStatsGrid = memo(({
    trips,
    pulseOnUpdate = false,
    compact = false,
    className,
}: QuickStatsGridProps) => {
    // Rendimiento: Evita recalcular O(N) si el array de viajes no cambió.
    const stats = useMemo(() => computeStats(trips), [trips]);
    
    // Single Source of Truth
    const s = HOME_SCREEN.stats;
    const showStreak = stats.profitableStreak >= 3;

    // Formateo que soporta números negativos (pérdidas reales)
    const formatCurrency = (n: number) => {
        const abs = Math.abs(n);
        const prefix = n < 0 ? '-$' : '$';
        return abs >= 1000 
            ? `${prefix}${Math.round(abs / 100) / 10}K` 
            : `${prefix}${Math.round(abs)}`;
    };

    return (
        <div className={cn('space-y-2', className)}>
            {/* Fila principal — 3 columnas */}
            <div className="grid grid-cols-3 gap-2">
                <MetricCard
                    label={s.trips.label}
                    value={stats.trips}
                    variant="default"
                    pulse={pulseOnUpdate}
                    compact={compact}
                />
                <MetricCard
                    label={s.earned.label}
                    value={formatCurrency(stats.earned)}
                    variant={stats.earned < 0 ? 'error' : 'primary'}
                    glow={!compact && stats.earned !== 0}
                    pulse={pulseOnUpdate}
                    compact={compact}
                />
                <MetricCard
                    label={s.eph.label}
                    value={formatCurrency(stats.eph)}
                    unit={s.eph.unit}
                    variant={stats.eph >= 3000 ? 'success' : (stats.eph < 0 ? 'error' : 'default')}
                    pulse={pulseOnUpdate}
                    compact={compact}
                />
            </div>

            {/* Fila secundaria — 2 (o 3 si hay racha) columnas */}
            <div className={cn('grid gap-2', showStreak ? 'grid-cols-3' : 'grid-cols-2')}>
                <MetricCard
                    label={s.active.label}
                    value={stats.activeMinutes}
                    unit={s.active.unit}
                    variant="default"
                    compact={compact}
                />
                <MetricCard
                    label={(s as any).wait?.label || 'ESPERA'}
                    value={stats.waitMinutes}
                    unit={(s as any).wait?.unit || 'min'}
                    variant="default"
                    compact={compact}
                />
                {showStreak && (
                    <MetricCard
                        label={s.streak.label}
                        value={`${stats.profitableStreak}×`}
                        variant="streak"
                        glow={!compact}
                        compact={compact}
                        className="animate-in zoom-in-95 duration-500"
                    />
                )}
            </div>
        </div>
    );
});

QuickStatsGrid.displayName = 'QuickStatsGrid';