import React from 'react';
import { Calendar, Share2, Download, BarChart3, ArrowRight } from 'lucide-react';
import { SessionSummary } from '../Calculator/SessionSummary';
import { SessionAnalysis } from '../Calculator/SessionAnalysis';
import type { SavedTrip } from '../../types/calculator.types';

interface SessionTabProps {
  trips: SavedTrip[];
  onClearSession: () => void;
  onDeleteTrip: (id: number) => void;
  onNavigateToCalc: () => void; // Prop sugerida para mejorar UX
}

export const SessionTab: React.FC<SessionTabProps> = ({
  trips,
  onClearSession,
  onDeleteTrip,
  onNavigateToCalc
}) => {

  const totalMargin = trips.reduce((sum, t) => sum + t.margin, 0);
  const totalFare = trips.reduce((sum, t) => sum + t.fare, 0);
  const profitableTrips = trips.filter(t => t.margin > 0).length;

  const handleShare = async () => {
    const text = `📊 MANGUITO Intelligence\n\n` +
      `Viajes: ${trips.length}\n` +
      `Ingresos: $${totalFare.toLocaleString('es-AR')}\n` +
      `Ganancia Neta: $${totalMargin.toLocaleString('es-AR')}\n` +
      `Rentables: ${profitableTrips}/${trips.length}\n\n` +
      `🚗 NODO Studio 2026`;

    if (navigator.share) {
      try { await navigator.share({ text }); } catch (err) { console.log('Share cancelled'); }
    } else {
      navigator.clipboard.writeText(text);
      alert('Resumen copiado');
    }
  };

  // --- 1. EMPTY STATE REDISEÑADO (NODO Style) ---
  if (trips.length === 0) {
    return (
      <div className="pb-32 px-6 animate-in fade-in duration-700">
        <div className="h-[70vh] flex flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-nodo-petrol/20 blur-3xl rounded-full" />
            <div className="relative w-28 h-28 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
              <BarChart3 className="w-12 h-12 text-white/10" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3 italic tracking-tighter">
            HISTORIAL VACÍO
          </h2>
          <p className="text-sm text-white/40 max-w-[240px] leading-relaxed mb-10 font-medium">
            Registra tus viajes del día para desbloquear el análisis de rentabilidad.
          </p>

          <button 
            onClick={onNavigateToCalc}
            className="group flex items-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            Ir a Calculadora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-6 animate-in slide-in-from-right-4 duration-500">
      
      {/* 2. HEADER CON CONTEXTO TEMPORAL */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md -mx-4 px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.15em]">Sesión Activa</h2>
          <p className="text-[10px] text-nodo-petrol font-bold uppercase tracking-widest mt-0.5">
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
          </p>
        </div>
        
        <button
          onClick={handleShare}
          className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-lg"
        >
          <Share2 className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* 3. HERO METRICS (BI Edition) */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-[2rem] p-6 border-l-4 border-green-500 shadow-xl">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 block">Net Profit</span>
            <p className="text-3xl font-black text-green-400 tracking-tighter italic">
              ${totalMargin.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </p>
            <div className="flex items-center gap-1 mt-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[9px] text-white/40 font-bold uppercase">{trips.length} Viajes</span>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 border-l-4 border-nodo-petrol shadow-xl">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 block">Revenue</span>
            <p className="text-3xl font-black text-nodo-petrol tracking-tighter italic">
              ${totalFare.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </p>
            <span className="text-[9px] text-white/40 font-bold uppercase mt-2 block">
              {profitableTrips} Rentables
            </span>
          </div>
        </div>
      </div>

      {/* 4. ANÁLISIS PROFUNDO */}
      <div className="px-4">
        <SessionAnalysis trips={trips} />
      </div>

      {/* 5. HISTORIAL DETALLADO */}
      <div className="px-4">
        <SessionSummary 
          trips={trips}
          onClear={onClearSession}
          onDeleteTrip={onDeleteTrip}
        />
      </div>

      {/* 6. DATA EXPORT TOOL */}
      <div className="px-4">
        <div className="p-6 border-2 border-white/5 rounded-[2.5rem] bg-white/[0.02] flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Download className="w-5 h-5 text-white/20" />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Backup de Datos</h3>
          <p className="text-[10px] text-white/30 mb-5 max-w-[180px]">Exporta tu sesión actual a formato CSV para Excel o Sheets.</p>
          
          <button
            onClick={() => {/* TODO: Export Logic */}}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Descargar CSV
          </button>
        </div>
      </div>

    </div>
  );
};