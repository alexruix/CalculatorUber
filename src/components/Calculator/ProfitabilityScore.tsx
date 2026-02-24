import React from 'react';
import type { TripMetrics, ProfitabilityTheme } from '../../types/calculator.types';

interface ProfitabilityScoreProps {
  metrics: TripMetrics;
}

/**
 * Obtiene el tema visual según el nivel de rentabilidad
 */
const getTheme = (status: TripMetrics['status']): ProfitabilityTheme => {
  const themes: Record<TripMetrics['status'], ProfitabilityTheme> = {
    excellent: {
      card: 'score-card-excellent',
      text: 'text-green-400',
      label: 'EXCELENTE'
    },
    fair: {
      card: 'score-card-fair',
      text: 'text-amber-400',
      label: 'SIRVE'
    },
    poor: {
      card: 'score-card-poor',
      text: 'text-red-400',
      label: 'AL HORNO'
    },
    neutral: {
      card: 'score-card-neutral',
      text: 'text-white/20',
      label: 'ESPERANDO DATOS'
    }
  };

  return themes[status];
};

/**
 * Componente para mostrar el score visual de rentabilidad
 * Cambia de color según los umbrales: Verde (>$1000/km), Amarillo ($850-1000/km), Rojo (<$850/km)
 */
export const ProfitabilityScore: React.FC<ProfitabilityScoreProps> = ({ metrics }) => {
  const theme = getTheme(metrics.status);

  return (
    <div
      className={`${theme.card} rounded-3xl p-6 text-center transition-all duration-500 shadow-2xl relative overflow-hidden`}
      role="status"
      aria-live="polite"
    >
      {/* Indicador visual de fondo sutil */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full opacity-20 ${theme.text.replace('text-', 'bg-')}`} />

      {/* Etiqueta de estado (Status Label) */}
      <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${theme.text}`}>
        {theme.label}
      </span>

      {/* Score principal: Ganancia por KM */}
      <div className="flex items-baseline justify-center gap-1 mt-2 relative z-10">
        <span className="text-6xl font-black tracking-tighter text-white">
          ${metrics.isValid ? metrics.profitPerKm : 0}
        </span>
        <span className={`text-xl font-black ${theme.text}`}>/KM</span>
      </div>

      {/* Desglose de ganancia neta y gasto (BI Breakdown) */}
      {metrics.isValid && (
        <div className="mt-3 text-[11px] text-white/60 space-x-2 font-medium relative z-10">
          <span>
            En mano: <b className="text-white">${metrics.netMargin.toLocaleString('es-AR')}</b>
          </span>
          <span className="opacity-30">|</span>
          <span>
            Costo: <b className="text-red-400/80">${Math.round(metrics.totalCost).toLocaleString('es-AR')}</b>
          </span>
        </div>
      )}

      {/* 🚀 Sección de Inteligencia: Explicación del ROI */}
      {metrics.isValid && (
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-700">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
            Este viaje <span className="text-white">rindió {metrics.roi} veces</span> su costo
          </p>
          <p className="text-[9px] text-white/20 mt-1.5 max-w-[220px] leading-relaxed font-bold tracking-tight">
            {metrics.roi >= 1.5
              ? "Una joyita. Meté un par más de estos y cortás temprano."
              : metrics.roi >= 0.8
                ? "Suma y no castiga el auto. Es por acá, seguí metiéndole."
                : "Ojo que estás laburando para la app. Casi ni cubrís los gastos."}
          </p>
        </div>
      )}
    </div>
  );
};