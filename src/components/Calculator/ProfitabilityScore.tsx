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
      border: 'border-green-500', 
      bg: 'bg-green-500/10', 
      text: 'text-green-400', 
      label: 'EXCELENTE' 
    },
    fair: { 
      border: 'border-amber-500', 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400', 
      label: 'ACEPTABLE' 
    },
    poor: { 
      border: 'border-red-500', 
      bg: 'bg-red-500/10', 
      text: 'text-red-400', 
      label: 'BAJA RENTABILIDAD' 
    },
    neutral: { 
      border: 'border-white/10', 
      bg: 'bg-white/5', 
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
      className={`border-2 rounded-3xl p-6 text-center transition-all duration-500 ${theme.border} ${theme.bg}`}
      role="status"
      aria-live="polite"
    >
      {/* Etiqueta de estado */}
      <span className={`text-[10px] font-black tracking-[0.2em] ${theme.text}`}>
        {theme.label}
      </span>
      
      {/* Score principal: Profit per KM */}
      <div className="flex items-baseline justify-center gap-1 mt-2">
        <span className="text-6xl font-black tracking-tighter text-white">
          ${metrics.isValid ? metrics.profitPerKm : 0}
        </span>
        <span className={`text-xl font-bold ${theme.text}`}>/KM</span>
      </div>
      
      {/* Desglose de ganancia neta y gasto */}
      {metrics.isValid && (
        <div className="mt-3 text-[11px] text-white/60 space-x-2">
          <span>
            Neto: <b className="text-white">${metrics.netMargin}</b>
          </span>
          <span className="opacity-30">|</span>
          <span>
            Gasto: <b className="text-red-400">${Math.round(metrics.totalCost)}</b>
          </span>
        </div>
      )}
    </div>
  );
};