import React from 'react';
import { TrendingUp, Target, Clock } from '../../../lib/icons';

interface MiniSummaryProps {
  totalMargin?: number;
  tripCount?: number;
  /** Ganancia Por Hora acumulada del día (EPH) */
  eph?: number;
}

export const MiniSummary: React.FC<MiniSummaryProps> = ({ totalMargin, tripCount, eph }) => {
  if (tripCount === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 animate-in zoom-in-95 duration-300">
      {/* Ganancia Neta */}
      <div className="glass-card rounded-2xl p-4 border border-success/20 bg-success/5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3 h-3 text-success" />
          <span className="text-xs font-black text-white/40 uppercase tracking-widest">Ganancia Neta</span>
        </div>
        <p className="text-xl font-black text-white">${(totalMargin || 0).toLocaleString('es-AR')}</p>
      </div>

      {/* Cantidad de Turnos */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-3 h-3 text-info" />
          <span className="text-xs font-black text-white/40 uppercase tracking-widest">Turnos</span>
        </div>
        <p className="text-xl font-black text-white">{tripCount}</p>
      </div>

      {/* EPH: Ganancia Por Hora — solo si hay dato */}
      {eph && eph > 0 ? (
        <div className="col-span-2 glass-card rounded-2xl p-4 border border-info/20 bg-info/5">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-info" />
            <span className="text-xs font-black text-white/40 uppercase tracking-widest">EPH — Ganancia Por Hora</span>
          </div>
          <p className="text-xl font-black text-white">
            ${eph.toLocaleString('es-AR')}<span className="text-xs font-bold text-white/30">/hr</span>
          </p>
        </div>
      ) : null}
    </div>
  );
};