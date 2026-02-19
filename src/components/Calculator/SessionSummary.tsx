import React, { useState } from 'react';
import { History, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';

interface SessionSummaryProps {
  trips: SavedTrip[];
  onClear: () => void;
  onDeleteTrip: (id: number) => void;
}

/**
 * Componente mejorado para mostrar el resumen de la sesión del día
 * Muestra: Ganancia neta total, número de viajes, ingresos totales
 * Incluye: Historial expandible con cada viaje individual
 */
export const SessionSummary: React.FC<SessionSummaryProps> = ({ trips, onClear, onDeleteTrip }) => {  const [isExpanded, setIsExpanded] = useState(false);

  // No renderizar si no hay viajes
  if (trips.length === 0) return null;

  // Cálculos agregados
  const totalMargin = trips.reduce((acc, trip) => acc + trip.margin, 0);
  const totalFare = trips.reduce((acc, trip) => acc + trip.fare, 0);
  const tripCount = trips.length;
  const avgMarginPerTrip = tripCount > 0 ? Math.round(totalMargin / tripCount) : 0;

  // Formato de hora
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden animate-in fade-in">
      
      {/* Header con título y botón de borrar */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-nodo-petrol" />
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Resumen Sesión
            </h3>
          </div>
          <button 
            onClick={onClear} 
            className="text-white/20 hover:text-nodo-wine transition-colors touch-target"
            title="Borrar historial del día"
            aria-label="Borrar historial completo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Grid de Métricas Principales */}
      <div className="px-5 pb-3">
        <div className="grid grid-cols-2 gap-3 mb-3">
          
          {/* Ganancia Neta */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter mb-1">
              Ganancia Neta
            </p>
            <p className="text-2xl font-black text-green-400">
              ${totalMargin.toLocaleString('es-AR')}
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              ~${avgMarginPerTrip}/viaje
            </p>
          </div>
          
          {/* Ingresos Totales */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter mb-1">
              Ingresos
            </p>
            <p className="text-2xl font-black text-nodo-petrol">
              ${totalFare.toLocaleString('es-AR')}
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              {tripCount} {tripCount === 1 ? 'viaje' : 'viajes'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};