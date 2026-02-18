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
export const SessionSummary: React.FC<SessionSummaryProps> = ({ trips, onClear, onDeleteTrip }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

      {/* Botón expandir/contraer historial */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-3 border-t border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors touch-target"
      >
        <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
          Ver Historial Detallado
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>

      {/* Historial Expandible */}
      {isExpanded && (
        <div className="border-t border-white/5 max-h-96 overflow-y-auto">
          {trips.map((trip, index) => (
            <div 
              key={trip.id} 
              className="px-5 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Info del viaje */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-white/30 uppercase">
                      Viaje #{tripCount - index}
                    </span>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-[10px] text-white/40">
                      {formatTime(trip.timestamp)}
                    </span>
                  </div>
                  
                  {/* Métricas del viaje */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-tight">Tarifa</p>
                      <p className="text-sm font-bold text-white">
                        ${trip.fare.toLocaleString('es-AR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-tight">Ganancia</p>
                      <p className={`text-sm font-bold ${
                        trip.margin > 0 ? 'text-green-400' : 'text-nodo-wine'
                      }`}>
                        ${trip.margin.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón eliminar viaje individual */}
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este viaje del historial?')) {
                      onDeleteTrip(trip.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-nodo-wine touch-target"
                  title="Eliminar viaje"
                  aria-label="Eliminar este viaje"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};