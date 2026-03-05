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
            className={`${theme.card} rounded-3xl p-5 sm:p-6 text-center transition-all duration-500 shadow-2xl relative overflow-hidden`}
            role="status"
            aria-live="polite"
            aria-label={`Estado de rentabilidad: ${theme.label}`}
        >
            {/* Glow decorativo — no visible en reduced-motion */}
            <div
                className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full opacity-20 ${theme.text.replace('text-', 'bg-')} motion-reduce:hidden`}
                aria-hidden="true"
            />

            {/* Estado */}
            <span className={`text-(--text-micro) font-black tracking-widest uppercase ${theme.text}`}>
                {theme.label}
            </span>

            {/* Valor principal — Ganancia por KM */}
            <div className="flex items-baseline justify-center gap-1 mt-2 relative z-10">
                <span
                    className="font-black tracking-tighter text-white"
                    style={{ fontSize: 'clamp(3rem,10vw,3.75rem)' }}
                >
                    {PROFITABILITY.currency}{metrics.isValid ? metrics.profitPerKm : 0}
                </span>
                <span className={`text-xl font-black ${theme.text}`}>{PROFITABILITY.perKm}</span>
            </div>

            {/* Métricas secundarias */}
            {metrics.isValid && (
                <div className="mt-3 flex items-center justify-center gap-3 text-(--text-caption) font-medium relative z-10 flex-wrap">
                    <span>
                        {PROFITABILITY.netLabel}:{' '}
                        <b className="text-white font-black">
                            ${metrics.netMargin.toLocaleString('es-AR')}
                        </b>
                    </span>
                    <span className="opacity-20" aria-hidden="true">|</span>
                    <span>
                        {PROFITABILITY.costLabel}:{' '}
                        <b className="text-error/80 font-black">
                            ${Math.round(metrics.totalCost).toLocaleString('es-AR')}
                        </b>
                    </span>
                </div>
            )}

            {/* ROI + Insight */}
            {metrics.isValid && (
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-700">
                    <p className="caption tracking-widest text-(--text-micro)">
                        {roiLabel}
                    </p>
                    <p className="text-white font-black text-lg mt-1">
                        {metrics.roi}x{' '}
                        <span className="text-xs opacity-40 font-bold uppercase tracking-widest">
                            {PROFITABILITY.roiUnit}
                        </span>
                    </p>
                    <p className="text-(--text-caption) mt-1.5 max-w-[220px] leading-relaxed font-bold tracking-tight">
                        {getInsight(metrics.roi, vertical)}
                    </p>
                </div>
            )}
        </div>
    );
};
