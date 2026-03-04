import React from 'react';
import { useProfileStore } from '../../../store/useProfileStore';
import type { TripMetrics, ProfitabilityTheme } from '../../../types/calculator.types';

interface ProfitabilityScoreProps {
    metrics: TripMetrics;
}

const getTheme = (status: TripMetrics['status']): ProfitabilityTheme => {
    const themes: Record<TripMetrics['status'], ProfitabilityTheme> = {
        excellent: { card: 'score-card-excellent', text: 'text-green-400', label: 'EXCELENTE' },
        fair: { card: 'score-card-fair', text: 'text-amber-400', label: 'SIRVE' },
        poor: { card: 'score-card-poor', text: 'text-red-400', label: 'AL HORNO' },
        danger: { card: 'score-card-danger', text: 'text-red-400', label: 'PIERDE' },
        neutral: { card: 'score-card-neutral', text: 'text-white/20', label: 'ESPERANDO DATOS' }
    };
    return themes[status];
};

export const ProfitabilityScore: React.FC<ProfitabilityScoreProps> = ({ metrics }) => {
    const { vertical } = useProfileStore();
    const theme = getTheme(metrics.status);

    return (
        <div
            className={`${theme.card} rounded-3xl p-6 text-center transition-all duration-500 shadow-2xl relative overflow-hidden`}
            role="status"
            aria-live="polite"
        >
            <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full opacity-20 ${theme.text.replace('text-', 'bg-')}`} />

            <span className={`text-xs font-black tracking-[0.2em] uppercase ${theme.text}`}>
                {theme.label}
            </span>

            <div className="flex items-baseline justify-center gap-1 mt-2 relative z-10">
                <span className="text-6xl font-black tracking-tighter text-white">
                    ${metrics.isValid ? metrics.profitPerKm : 0}
                </span>
                <span className={`text-xl font-black ${theme.text}`}>/KM</span>
            </div>

            {metrics.isValid && (
                <div className="mt-3 text-xs text-white/60 space-x-2 font-medium relative z-10">
                    <span>
                        En mano: <b className="text-white">${metrics.netMargin.toLocaleString('es-AR')}</b>
                    </span>
                    <span className="opacity-30">|</span>
                    <span>
                        Costo: <b className="text-red-400/80">${Math.round(metrics.totalCost).toLocaleString('es-AR')}</b>
                    </span>
                </div>
            )}

            {metrics.isValid && (
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-700">
                    <p className="caption tracking-[0.2em]">
                        {vertical === 'delivery' ? 'RETORNO TOTAL (INC. PROPINA)' : 'FACTOR DE RENTABILIDAD'}
                    </p>
                    <p className="text-white font-black text-lg mt-1">
                        {metrics.roi}x <span className="text-xs opacity-40 font-bold uppercase tracking-widest">ROI</span>
                    </p>
                    <p className="text-xs text-white/20 mt-1.5 max-w-[220px] leading-relaxed font-bold tracking-tight">
                        {metrics.roi >= 1.8
                            ? (vertical === 'delivery' ? "¡Propina salvadora! Este viaje es oro puro." : "Una joyita. Meté un par más de estos y cortás temprano.")
                            : metrics.roi >= 1
                                ? "Suma y no castiga el auto. Es por acá, seguí metiéndole."
                                : (vertical === 'transport' ? "Ojo que es un viaje trampa. Casi ni cubrís los gastos." : "Margen muy ajustado. Evalúa si el esfuerzo vale la pena.")}
                    </p>
                </div>
            )}
        </div>
    );
};
