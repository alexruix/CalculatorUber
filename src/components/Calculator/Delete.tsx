import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, Trophy, Zap, Clock, 
  Target, Lightbulb, Award, ChevronDown, ChevronUp, Star,
  BarChart3, Activity, Trash2
} from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';
import { useSessionInsights } from '../../hooks/useSessionInsights';

interface SessionAnalysisProps {
  trips: SavedTrip[];
  onClear: () => void;
  onDeleteTrip: (id: number) => void;
}

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ trips, onClear, onDeleteTrip }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const insights = useSessionInsights(trips);

  // --- 1. EMPTY STATE: Sin viajes ---
  if (trips.length === 0) {
    return (
      <div className="glass-card rounded-[2rem] p-8 text-center border-dashed border-white/10 animate-in fade-in duration-500">
        <div className="relative w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
           <div className="absolute inset-0 bg-nodo-petrol/10 blur-xl rounded-full" />
           <BarChart3 className="relative w-8 h-8 text-white/10" />
        </div>
        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Esperando Datos</h3>
        <p className="text-[10px] text-white/20 uppercase font-bold mt-2 tracking-widest">
          Nivel 1 • 0 Viajes Registrados
        </p>
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-[9px] text-white/30 italic">
            El algoritmo NODO se activará automáticamente al detectar actividad en tu sesión.
          </p>
        </div>
      </div>
    );
  }

  // --- 2. PARTIAL STATE: Pocos viajes (< 3) ---
  if (trips.length < 3 && !isExpanded) {
    return (
      <div className="glass-card rounded-[2rem] p-6 animate-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-nodo-petrol" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Procesando Insights</h3>
          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="text-[9px] font-black text-white/40 uppercase">{trips.length}/3 VIAJES</span>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-2xl p-4 flex gap-4 items-center">
          <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
          <p className="text-[11px] text-white/60 leading-relaxed font-medium">
            Registra <span className="text-white font-bold">{3 - trips.length} viaje(s) más</span> para desbloquear las tendencias de rentabilidad y el análisis horario.
          </p>
        </div>

        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full mt-4 py-2 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors"
        >
          Forzar Análisis Detallado
        </button>
      </div>
    );
  }

  // Formato de hora para los insights
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const badgeColors: Record<string, string> = {
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 animate-in fade-in duration-500">
      
      {/* 3. HEADER: Nivel y Título */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white">
              Manguito analisis
            </h3>
          </div>
          
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-tighter">
              Nivel {insights.driverLevel}
            </span>
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

      {/* 4. GRID DE MÉTRICAS RÁPIDAS */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.03] p-3 rounded-[1.5rem] border border-white/5 text-center">
            <p className="text-xl font-black text-green-400 italic">{insights.profitableTripsPercent}%</p>
            <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mt-1">Eficiencia</p>
          </div>

          <div className="bg-white/[0.03] p-3 rounded-[1.5rem] border border-white/5 text-center">
            <div className="flex justify-center mb-1">
              {insights.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400" />}
              {insights.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {insights.trend === 'stable' && <Minus className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mt-1">Tendencia</p>
          </div>

          <div className="bg-white/[0.03] p-3 rounded-[1.5rem] border border-white/5 text-center">
            <p className="text-xl font-black text-orange-400 italic">{insights.profitableStreak}</p>
            <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mt-1">Racha</p>
          </div>
        </div>
      </div>

      {/* 5. SECCIÓN EXPANDIBLE (CÓDIGO ORIGINAL MEJORADO) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 border-t border-white/5 flex items-center justify-between hover:bg-white/5 transition-all group"
      >
        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
          {isExpanded ? 'Colapsar Informe' : 'Ver Análisis Detallado'}
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
      </button>

      {isExpanded && (
        <div className="border-t border-white/5 px-6 py-6 space-y-6 bg-black/20 animate-in slide-in-from-top-2">
          
          {/* Mejor y Peor Viaje */}
          <div className="grid grid-cols-2 gap-4">
            {insights.bestTrip && (
              <div className="space-y-2">
                <p className="text-[8px] font-black text-green-400/50 uppercase tracking-widest ml-1">Top Performance</p>
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4">
                  <p className="text-[10px] text-white/40 font-bold mb-1">{formatTime(insights.bestTrip.timestamp)}</p>
                  <p className="text-xl font-black text-green-400 italic">${insights.bestTrip.margin.toLocaleString('es-AR')}</p>
                </div>
              </div>
            )}
            {insights.worstTrip && (
              <div className="space-y-2">
                <p className="text-[8px] font-black text-red-400/50 uppercase tracking-widest ml-1">Low Margin</p>
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                  <p className="text-[10px] text-white/40 font-bold mb-1">{formatTime(insights.worstTrip.timestamp)}</p>
                  <p className="text-xl font-black text-red-400 italic">${insights.worstTrip.margin.toLocaleString('es-AR')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Horario Rentable */}
          {insights.bestTimeOfDay && (
            <div className="bg-nodo-petrol/5 border border-nodo-petrol/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black text-nodo-petrol uppercase tracking-widest mb-1">Horario de Oro</p>
                <p className="text-lg font-black text-white italic">{insights.bestTimeOfDay}</p>
              </div>
              <Clock className="w-8 h-8 text-nodo-petrol opacity-20" />
            </div>
          )}

          {/* Tips dinámicos */}
          <div className="space-y-3">
             <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">Manguito Assistant</p>
             {insights.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/70 leading-relaxed font-medium">{tip}</p>
                </div>
             ))}
          </div>

        </div>
      )}
    </div>
  );
};