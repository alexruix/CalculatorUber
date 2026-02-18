import React from 'react';
import { History, Trash2 } from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';

interface SessionSummaryProps {
  trips: SavedTrip[];
  onClear: () => void;
}

/**
 * Componente para mostrar el resumen de la sesión del día
 * Muestra: Ganancia neta total, número de viajes, e ingresos totales
 */
export const SessionSummary: React.FC<SessionSummaryProps> = ({ trips, onClear }) => {
  // No renderizar si no hay viajes
  if (trips.length === 0) return null;

  // Cálculos agregados
  const totalMargin = trips.reduce((acc, trip) => acc + trip.margin, 0);
  const totalFare = trips.reduce((acc, trip) => acc + trip.fare, 0);
  const tripCount = trips.length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 animate-in fade-in">
      
      {/* Header con título y botón de borrar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            Resumen Sesión
          </h3>
        </div>
        <button 
          onClick={onClear} 
          className="text-white/20 hover:text-red-400 transition-colors"
          title="Borrar historial del día"
          aria-label="Borrar historial"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Grid de Métricas */}
      <div className="grid grid-cols-3 gap-3">
        
        {/* Ganancia Neta */}
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">
            Ganancia Neta
          </p>
          <p className="text-lg font-black text-green-400">
            ${totalMargin.toLocaleString('es-AR')}
          </p>
        </div>
        
        {/* Cantidad de Viajes */}
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">
            Viajes
          </p>
          <p className="text-lg font-black text-white">
            {tripCount}
          </p>
        </div>
        
        {/* Ingresos Totales */}
        <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">
            Ingresos
          </p>
          <p className="text-lg font-black text-sky-400">
            ${totalFare.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  );
};