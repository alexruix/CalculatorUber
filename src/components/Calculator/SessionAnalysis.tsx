import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Trophy, Zap, Clock,
  Target, Lightbulb, Award, ChevronDown, ChevronUp, Star,
  BarChart3, Activity, Trash2, Rocket, BrainCircuit
} from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';
import { useSessionInsights } from '../../hooks/useSessionInsights';

interface SessionAnalysisProps {
  trips: SavedTrip[];
  onClear: () => void;
}

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ trips, onClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const insights = useSessionInsights(trips);

  // Colores dinámicos para badges
  const badgeColors: Record<string, string> = {
    sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  // --- 1. EMPTY STATE ---
  if (trips.length === 0) {
    return (
      <div className="glass-card rounded-[2rem] p-8 text-center border-dashed border-white/10 animate-in fade-in duration-500">
        <div className="relative w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <div className="absolute inset-0 bg-nodo-petrol/10 blur-xl rounded-full" />
          <BarChart3 className="relative w-8 h-8 text-white/10" />
        </div>
        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Garage vacío</h3>
        <p className="text-[10px] text-white/20 uppercase font-bold mt-2 tracking-widest">
          Nivel 1 • Sin viajes registrados
        </p>
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-[9px] text-white/30 italic">
            Anotá tus viajes del día para que el Radar Manguito te tire la posta de tu rentabilidad.          </p>
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Calentando Motores</h3>          </div>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="text-[9px] font-black text-white/40 uppercase">{trips.length}/3 VIAJES</span>
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-4 flex gap-4 items-center">
          <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
          <p className="text-[11px] text-white/60 leading-relaxed font-medium">
            Anotá <span className="text-white font-bold">{3 - trips.length} viajes más</span> para que el análisis de tendencias y racha se active.          </p>
        </div>

        <button
          onClick={() => setIsExpanded(true)}
          className="w-full mt-4 py-2 text-[9px] font-black text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors"
        >
          Ver análisis preliminar
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 animate-in fade-in duration-500">

      {/* 2. HEADER: Sistema de Niveles y XP (NUEVO) */}
      <div className="px-6 pt-6 pb-5 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.1em] text-white italic">Radar Manguito</h3>
<p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Balance de la jornada</p>            </div>
          </div>

          <button
          onClick={() => confirm('¿Limpiamos el balance del día?') && onClear()}
          className="p-2 text-white/10 hover:text-nodo-wine transition-colors rounded-full hover:bg-white/5"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        </div>

        {/* Barra de Progreso de Nivel (Usa los nuevos datos del hook) */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-amber-400 italic">RANGO {insights.driverLevel}</span>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
              {insights.pointsToNextLevel} puntos para subir de rango
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-300 rounded-full transition-all duration-1000"
              style={{ width: `${100 - (insights.pointsToNextLevel * 10)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. GRID DE PERFORMANCE */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 text-center group hover:bg-white/[0.04] transition-colors">
            <Target className="w-4 h-4 text-green-400 mx-auto mb-2 opacity-50" />
            <p className="text-2xl font-black text-green-400 italic tracking-tighter">{insights.profitableTripsPercent}%</p>
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Puntería</p>
          </div>

          <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 text-center group hover:bg-white/[0.04] transition-colors">
            <div className="flex justify-center mb-2">
              {insights.trend === 'improving' && <TrendingUp className="w-4 h-4 text-sky-400" />}
              {insights.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
              {insights.trend === 'stable' && <Minus className="w-4 h-4 text-white/20" />}
            </div>
            <p className="text-[9px] font-black text-white uppercase italic">
              {insights.trend === 'improving' ? 'Subiendo' : insights.trend === 'declining' ? 'En bajada' : 'Parejo'}            </p>
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">El rumbo</p>
          </div>

          <div className="bg-white/[0.02] p-4 rounded-3xl border border-white/5 text-center group hover:bg-white/[0.04] transition-colors">
            <Zap className="w-4 h-4 text-orange-400 mx-auto mb-2 opacity-50" />
            <p className="text-2xl font-black text-orange-400 italic tracking-tighter">{insights.profitableStreak}</p>
            <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Seguidilla</p>
          </div>
        </div>
      </div>

      {/* 4. BADGES / LOGROS (Scroll Horizontal) */}
      {insights.badges.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-3.5 h-3.5 text-white/20" />
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Medallas del día</span>          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {insights.badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all animate-in zoom-in-95 ${badgeColors[badge.color]}`}
              >
                <span className="text-xl">{badge.icon}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">{badge.name}</span>
                  <span className="text-[8px] opacity-60 font-bold uppercase">{badge.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BOTÓN DE EXPANSIÓN */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 border-t border-white/5 flex items-center justify-between hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-nodo-petrol" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
            {isExpanded ? 'Cerrar carpeta' : 'Ver el análisis fino'}          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
      </button>

      {/* 6. TIPS Y COMPARATIVA (Expandible) */}
      {isExpanded && (
        <div className="border-t border-white/5 px-6 py-8 space-y-8 bg-black/20 animate-in slide-in-from-top-4 duration-500">

          {/* Tips Mejorados (Usa la nueva lógica del hook) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Consejos</p>            </div>
            <div className="grid grid-cols-1 gap-3">
              {insights.tips.map((tip, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white/[0.02] rounded-3xl border border-white/5 items-start">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-amber-500">{i + 1}</span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen Final Motivacional */}
          <div className="p-6 bg-gradient-to-br from-nodo-petrol/20 to-sky-500/10 rounded-[2rem] border border-nodo-petrol/30 text-center relative overflow-hidden">
            <Rocket className="absolute -right-2 -bottom-2 w-16 h-16 text-white/5 -rotate-12" />
            <p className="text-sm font-black text-white italic mb-1 uppercase tracking-tighter">
              {insights.profitableTripsPercent >= 80 ? 'La tenés clarísima' : 'Afilando el criterio'}            </p>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
              Promedio de hoy: <span className="text-white">${insights.avgMarginPerTrip.toLocaleString('es-AR')}</span> por viaje            </p>
          </div>
        </div>
      )}
    </div>
  );
};