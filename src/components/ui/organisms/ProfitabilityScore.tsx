/**
 * ProfitabilityScore.tsx - Refactored for Critical Loss Awareness
 * ─────────────────────────────────────────────────────────────
 * Ahora detecta rentabilidad negativa y activa el "Modo Emergencia".
 */
import React from 'react';
import { AlertTriangle } from 'lucide-react'; // Icono para impacto visual
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
        fair: { card: 'score-card-fair', text: 'text-amber-200', label: PROFITABILITY.statusLabels.fair },
        poor: { card: 'score-card-fair', text: 'text-accent', label: PROFITABILITY.statusLabels.poor },
        danger: { card: 'score-card-poor', text: 'text-error', label: PROFITABILITY.statusLabels.danger },
        neutral: { card: 'score-card-neutral', text: 'text-white/20', label: PROFITABILITY.statusLabels.neutral },
    };
    return themes[status];
};

const getInsight = (roi: number, vertical: string | null): string => {
    // 🔴 NIVEL CRÍTICO: Pérdida real (ROI < 1)
    if (roi < 1) {
        return PROFITABILITY.insights.critical;
    }

    // 🟠 NIVEL AL HORNO: Ganancia marginal (1.0 a 1.3)
    // El conductor no pierde plata física, pero su trabajo vale poco.
    if (roi < 1.3) {
        return vertical === 'transport'
            ? PROFITABILITY.insights.poor.transport
            : PROFITABILITY.insights.poor.default;
    }

    // 🟡 NIVEL NORMAL/FAIR: Aceptable (1.3 a 1.8)
    if (roi < 1.8) {
        return PROFITABILITY.insights.fair.default;
    }

    // 🟢 NIVEL EXCELENTE: Alta eficiencia ( > 1.8)
    return vertical === 'delivery'
        ? PROFITABILITY.insights.excellent.delivery
        : PROFITABILITY.insights.excellent.default;
};

export const ProfitabilityScore: React.FC<ProfitabilityScoreProps> = ({ metrics }) => {
    const { vertical } = useProfileStore();
    const theme = getTheme(metrics.status);

    // 🚨 Lógica de Emergencia: ¿Estamos perdiendo plata?
    const isNegative = metrics.isValid && metrics.netMargin < 0;


    const roiLabel = vertical === 'delivery'
        ? PROFITABILITY.roiLabel.delivery
        : PROFITABILITY.roiLabel.default;

    return (
        <div
            className={cn(
                theme.card,
                "rounded-3xl p-6 text-center transition-all duration-500 shadow-2xl relative overflow-hidden",
                "border-b-4 border-white/5",
                // 🌪️ Efecto de sacudida y brillo rojo si hay pérdida
                isNegative && "animate-in shake border-error shadow-[0_0_40px_rgba(255,68,68,0.25)] ring-2 ring-error/50"
            )}
            role="status"
            aria-live="assertive" // Subimos la prioridad de accesibilidad
        >
            {/* HUD Status Bar - Pulsante en emergencia */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all duration-1000",
                        theme.text.replace('text-', 'bg-'),
                        isNegative && "animate-pulse"
                    )}
                    style={{ width: metrics.isValid ? '100%' : '0%' }}
                />
            </div>

            {/* Status Label con Icono de Alerta */}
            <div className="flex items-center justify-center gap-2 mb-2">
                {isNegative ? (
                    <AlertTriangle className="w-4 h-4 text-error animate-bounce" />
                ) : (
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", theme.text)} />
                )}
                <span className={cn("text-xs font-black tracking-[0.3em] uppercase", isNegative ? "text-error" : theme.text)}>
                    {isNegative ? "ALERTA DE PÉRDIDA" : theme.label}
                </span>
                {!isNegative && <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", theme.text)} />}
            </div>

            {/* Main Metric - Net Margin (Money in pocket) */}
            <div className="flex flex-col items-center justify-center py-2 relative z-10">
                <span className={cn(
                    "block text-[11px] font-black uppercase tracking-widest mb-1 opacity-80",
                    theme.text
                )}>
                    {/* ✅ Ahora la etiqueta cambia según la realidad */}
                    {isNegative ? "Pérdida Neta" : "Dinero en mano"}
                </span>
                <div className="flex items-baseline gap-1">
                    <span
                        className={cn(
                            "font-black tracking-tighter text-white leading-none transition-transform duration-500",
                            isNegative && "scale-110 text-error"
                        )}
                        style={{ fontSize: 'clamp(3.5rem, 12vw, 4.5rem)' }}
                    >
                        {/* ✅ Usamos Math.abs para mostrar el número limpio, 
                ya que la etiqueta "Pérdida" y el color rojo dan el contexto */}
                        ${metrics.isValid ? Math.abs(metrics.netMargin).toLocaleString('es-AR') : 0}
                    </span>
                </div>
            </div>

            {/* Secondary Metrics - Efficiency Score & Total Cost */}
            {metrics.isValid && (
                <div className={cn(
                    "mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl border transition-colors duration-500",
                    isNegative ? "bg-error/10 border-error/20" : "bg-white/5 border-white/10"
                )}>
                    <div className="text-center border-r border-white/10 px-2">
                        <span className={cn(
                            "block text-[10px] font-black uppercase tracking-widest mb-1",
                            "text-white/60"
                        )}>
                            {PROFITABILITY.qualityLabel}
                        </span>
                        <b className={cn("text-base font-black tabular-nums", theme.text)}>
                            {PROFITABILITY.currency}{metrics.profitPerKm}
                            <span className="text-[10px] ml-0.5 opacity-80">{PROFITABILITY.perKm}</span>
                        </b>
                    </div>
                    <div className="text-center px-2">
                        <span className="block text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">
                            {PROFITABILITY.costLabel}
                        </span>
                        <b className="text-base font-black text-accent/90 tabular-nums">
                            {PROFITABILITY.currency}{Math.round(metrics.totalCost).toLocaleString('es-AR')}
                        </b>
                    </div>
                </div>
            )}

            {/* ROI & Insight */}
            {metrics.isValid && (
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center">
                    <p className={cn(
                        "text-[13px] px-4 leading-snug font-bold italic tracking-tight text-center max-w-[280px]",
                        isNegative ? "text-error animate-pulse" : "text-starlight opacity-90"
                    )}>
                        "{getInsight(metrics.roi, vertical)}"
                    </p>
                </div>
            )}
        </div>
    );
};