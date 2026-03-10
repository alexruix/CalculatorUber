/**
 * ProfitabilityScore.tsx
 * ─────────────────────────────────────────────────────────────
 * Componente 100% presentacional. No contiene strings de negocio.
 * Todos los textos provienen de /data/ui-strings.ts.
 *
 * Fluent 2:
 * · Semáforo de rentabilidad (Excellent / Fair / Poor / Danger)
 * · Tipografía via clases DS (@theme tokens)
 * · Touch target correctos para mobile
 */
import React from 'react';
import { cn } from '../../../lib/utils';
import { useProfileStore } from '../../../store/useProfileStore';
import type { TripMetrics, ProfitabilityTheme } from '../../../types/calculator.types';
import { PROFITABILITY } from '../../../data/ui-strings';

interface ProfitabilityScoreProps {
    metrics: TripMetrics;
}

const getTheme = (status: TripMetrics['status']): ProfitabilityTheme => {
    const themes: Record<TripMetrics['status'], ProfitabilityTheme> = {
        excellent: { card: 'score-card-excellent', text: 'text-success', label: PROFITABILITY.statusLabels.excellent },
        fair: { card: 'score-card-fair', text: 'text-warning', label: PROFITABILITY.statusLabels.fair },
        poor: { card: 'score-card-poor', text: 'text-error', label: PROFITABILITY.statusLabels.poor },
        danger: { card: 'score-card-poor', text: 'text-error', label: PROFITABILITY.statusLabels.danger },
        neutral: { card: 'score-card-neutral', text: 'text-white/20', label: PROFITABILITY.statusLabels.neutral },
    };
    return themes[status];
};

/** Devuelve el mensaje de insight contextual según ROI y vertical */
const getInsight = (roi: number, vertical: string | null): string => {
    if (roi >= 1.8) {
        return vertical === 'delivery'
            ? PROFITABILITY.insights.excellent.delivery
            : PROFITABILITY.insights.excellent.default;
    }
    if (roi >= 1) return PROFITABILITY.insights.fair.default;
    return vertical === 'transport'
        ? PROFITABILITY.insights.poor.transport
        : PROFITABILITY.insights.poor.default;
};

export const ProfitabilityScore: React.FC<ProfitabilityScoreProps> = ({ metrics }) => {
    const { vertical } = useProfileStore();
    const theme = getTheme(metrics.status);

    const roiLabel = vertical === 'delivery'
        ? PROFITABILITY.roiLabel.delivery
        : PROFITABILITY.roiLabel.default;

    return (
        <div
            className={cn(
                theme.card,
                "rounded-3xl p-6 text-center transition-all duration-500 shadow-2xl relative overflow-hidden",
                "border-b-4 border-white/5"
            )}
            role="status"
            aria-live="polite"
        >
            {/* HUD Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-1000", theme.text.replace('text-', 'bg-'))}
                    style={{ width: metrics.isValid ? '100%' : '0%' }}
                />
            </div>

            {/* Status Label - High Energy Gaming Style */}
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", theme.text)} />
                <span className={cn("text-[11px] font-black tracking-[0.3em] uppercase", theme.text)}>
                    {theme.label}
                </span>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", theme.text)} />
            </div>

            {/* Main Metric - $/KM Telemetry */}
            <div className="flex flex-col items-center justify-center py-2 relative z-10">
                <div className="flex items-baseline gap-1">
                    <span 
                        className="font-black tracking-tighter text-white leading-none"
                        style={{ fontSize: 'clamp(3.5rem, 12vw, 4.5rem)' }}
                    >
                        {PROFITABILITY.currency}{metrics.isValid ? metrics.profitPerKm : 0}
                    </span>
                    <span className={cn("text-2xl font-black italic uppercase tracking-tighter opacity-80", theme.text)}>
                        {PROFITABILITY.perKm}
                    </span>
                </div>
            </div>

            {/* Secondary Metrics - Performance Readout Style */}
            {metrics.isValid && (
                <div className="mt-4 grid grid-cols-2 gap-2 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-center border-r border-white/10 px-2">
                        <span className="block text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-1">
                            {PROFITABILITY.netLabel}
                        </span>
                        <b className="text-sm font-black text-starlight">
                            ${metrics.netMargin.toLocaleString('es-AR')}
                        </b>
                    </div>
                    <div className="text-center px-2">
                        <span className="block text-[10px] font-extrabold text-white/30 uppercase tracking-widest mb-1">
                            {PROFITABILITY.costLabel}
                        </span>
                        <b className="text-sm font-black text-accent shadow-[0_0_10px_var(--color-accent-dim)]">
                            ${Math.round(metrics.totalCost).toLocaleString('es-AR')}
                        </b>
                    </div>
                </div>
            )}

            {/* ROI & Insight - HUD Deep Dive */}
            {metrics.isValid && (
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-[2px] w-8 bg-linear-to-r from-transparent to-white/20" />
                        <span className="text-[10px] font-extrabold tracking-[0.2em] text-white/40 uppercase">
                            {roiLabel}
                        </span>
                        <div className="h-[2px] w-8 bg-linear-to-l from-transparent to-white/20" />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-white italic">
                            {metrics.roi}
                            <span className="text-xl ml-0.5 text-primary">x</span>
                        </span>
                        <span className="text-[10px] font-extrabold text-white/20 uppercase tracking-widest self-end pb-1.5">
                            {PROFITABILITY.roiUnit}
                        </span>
                    </div>

                    <p className="text-[13px] mt-3 px-4 leading-snug font-bold text-starlight italic tracking-tight opacity-90 text-center max-w-[280px]">
                        "{getInsight(metrics.roi, vertical)}"
                    </p>
                </div>
            )}
        </div>
    );
};
