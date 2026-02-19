import React from 'react';
import { TrendingUp, Target } from 'lucide-react';

interface MiniSummaryProps {
  totalMargin?: number; // Lo hacemos opcional para mayor seguridad
  tripCount?: number;
}

/**
 * MiniSummary - Visualización rápida de métricas acumuladas del día.
 * Se muestra en la pestaña de la calculadora para motivación constante.
 */
export const MiniSummary: React.FC<MiniSummaryProps> = ({ totalMargin, tripCount }) => {
  // Solo renderizamos si hay actividad en la sesión
  if (tripCount === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 animate-in zoom-in-95 duration-300">
      {/* Tarjeta de Ganancias */}
      <div className="glass-card rounded-2xl p-4 border border-green-500/20 bg-green-500/5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3 h-3 text-green-400" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
            Ganancias
          </span>
        </div>
        <p className="text-xl font-black text-white">
${(totalMargin || 0).toLocaleString('es-AR')}        </p>
      </div>

      {/* Tarjeta de Viajes */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-3 h-3 text-nodo-petrol" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
            Viajes
          </span>
        </div>
        <p className="text-xl font-black text-white">{tripCount}</p>
      </div>
    </div>
  );
};