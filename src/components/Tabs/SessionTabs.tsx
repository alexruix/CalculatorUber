import React, { useState } from 'react';
import { Calendar, Share2, Download } from 'lucide-react';
import { SessionSummary } from '../Calculator/SessionSummary';
import { SessionAnalysis } from '../Calculator/SessionAnalysis';
import type { SavedTrip } from '../../types/calculator.types';

interface SessionTabProps {
  trips: SavedTrip[];
  onClearSession: () => void;
  onDeleteTrip: (id: number) => void;
}

/**
 * Session Tab - Vista de análisis y progreso del día
 * Diseñado para revisión rápida en semáforos/pausas
 */
export const SessionTab: React.FC<SessionTabProps> = ({
  trips,
  onClearSession,
  onDeleteTrip
}) => {

  const [showShareMenu, setShowShareMenu] = useState(false);

  // Calcular métricas rápidas
  const totalMargin = trips.reduce((sum, t) => sum + t.margin, 0);
  const totalFare = trips.reduce((sum, t) => sum + t.fare, 0);
  const profitableTrips = trips.filter(t => t.margin > 0).length;

  // Handler para compartir resumen
  const handleShare = async () => {
    const text = `📊 Manguito - Resumen del Día\n\n` +
      `Viajes: ${trips.length}\n` +
      `Ingresos: $${totalFare.toLocaleString('es-AR')}\n` +
      `Ganancia Neta: $${totalMargin.toLocaleString('es-AR')}\n` +
      `Rentables: ${profitableTrips}/${trips.length}\n\n` +
      `🚗 Powered by NODO Studio`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(text);
      alert('Resumen copiado al portapapeles');
    }
  };

  // Estado vacío
  if (trips.length === 0) {
    return (
      <div className="pb-24 px-4">
        <div className="h-[60vh] flex flex-col items-center justify-center text-center px-8">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-white/20" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">
            Sin viajes aún
          </h2>
          <p className="text-sm text-white/60 max-w-xs">
            Completa tu primer viaje para ver las estadísticas y análisis del día
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-4">
      
      {/* Header con acciones */}
      <div className="sticky top-16 z-10 bg-gradient-to-b from-slate-950 via-slate-900 to-transparent px-4 pt-4 pb-2">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Sesión de Hoy</h2>
            <p className="text-xs text-white/40">
              {new Date().toLocaleDateString('es-AR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          
          <button
            onClick={handleShare}
            className="w-12 h-12 bg-nodo-petrol/20 border border-nodo-petrol/30 rounded-xl flex items-center justify-center active:scale-95 transition-all touch-target"
            aria-label="Compartir resumen"
          >
            <Share2 className="w-5 h-5 text-nodo-petrol" />
          </button>
        </div>
      </div>

      {/* Métricas del Día - Hero Cards */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          
          {/* Ganancia Neta */}
          <div className="glass-card rounded-2xl p-4 border-l-4 border-green-500">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
              Ganancia Neta
            </p>
            <p className="text-3xl font-black text-green-400">
              ${totalMargin.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {trips.length === 1 ? '1 viaje' : `${trips.length} viajes`}
            </p>
          </div>

          {/* Ingresos Totales */}
          <div className="glass-card rounded-2xl p-4 border-l-4 border-nodo-petrol">
            <p className="text-[10px] text-white/40 uppercase font-bold mb-1">
              Ingresos
            </p>
            <p className="text-3xl font-black text-nodo-petrol">
              ${totalFare.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-white/60 mt-1">
              {profitableTrips}/{trips.length} rentables
            </p>
          </div>
        </div>
      </div>

      {/* Análisis de Sesión - Siempre visible en este tab */}
      <div className="px-4">
        <SessionAnalysis trips={trips} />
      </div>

      {/* Historial de Viajes */}
      <div className="px-4">
        <SessionSummary 
          trips={trips}
          onClear={onClearSession}
          onDeleteTrip={onDeleteTrip}
        />
      </div>

      {/* Acciones Adicionales */}
      <div className="px-4 pt-2">
        <div className="glass-card rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-white/40 uppercase">
            Acciones Rápidas
          </p>
          
          <button
            onClick={() => {/* TODO: Exportar CSV */}}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white hover:bg-white/10 transition-colors touch-target"
          >
            <Download className="w-4 h-4" />
            Exportar a CSV
          </button>

          <p className="text-xs text-white/40 text-center">
            Guarda tu historial para análisis externos
          </p>
        </div>
      </div>
    </div>
  );
};