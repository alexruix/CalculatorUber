import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';

interface DailyGoalsProps {
  currentMargin: number; // Asegúrate de pasar 'totalDayMargin' desde Calculator.tsx
}

export const DailyGoals = ({ currentMargin = 0 }: DailyGoalsProps) => {
  const [goal, setGoal] = useState<number>(15000);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState<string>(goal.toString());

  useEffect(() => {
    const savedGoal = localStorage.getItem('nodo_daily_goal');
    if (savedGoal) {
      const numGoal = Number(savedGoal);
      setGoal(numGoal);
      setTempGoal(numGoal.toString());
    }
  }, []);

  const saveGoal = () => {
    const newGoal = Number(tempGoal);
    if (newGoal > 0) {
      setGoal(newGoal);
      localStorage.setItem('nodo_daily_goal', newGoal.toString());
    }
    setIsEditing(false);
  };

  const progress = Math.min((currentMargin / goal) * 100, 100);
  const isGoalReached = currentMargin >= goal;

  return (
    <div className="glass-card rounded-[2rem] p-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-nodo-petrol/20 rounded-lg">
            <Target className="w-4 h-4 text-nodo-petrol" />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Meta Diaria</h3>
        </div>
        <button 
          onClick={() => {
            setTempGoal(goal.toString());
            setIsEditing(!isEditing);
          }}
          className="p-2 hover:bg-white/5 rounded-full transition-all touch-target"
        >
          <Edit2 className="w-3 h-3 text-white/20" />
        </button>
      </div>

      {isEditing ? (
        <div className="flex gap-2 mb-4 animate-in zoom-in-95 duration-200">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
            <input 
              type="number" 
              autoFocus
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="w-full bg-black/40 border-2 border-nodo-petrol rounded-2xl py-3 pl-8 pr-4 text-lg font-black text-white outline-none"
              placeholder="Nueva Meta"
              onBlur={saveGoal}
              onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white italic">
                ${(currentMargin || 0).toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] text-white/20 font-black uppercase tracking-tighter">
                / ${(goal || 0).toLocaleString('es-AR')}
              </span>
            </div>
            
            {isGoalReached ? (
              <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[8px] font-black text-green-500 uppercase">Logrado</span>
              </div>
            ) : (
              <span className="text-[10px] font-black text-nodo-sand italic">
                {Math.round(100 - progress)}% restante
              </span>
            )}
          </div>

          {/* Barra de Progreso MANGUITO Style */}
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${
                isGoalReached 
                ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                : 'bg-gradient-to-r from-nodo-petrol to-sky-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tip Dinámico */}
      <div className="flex gap-3 items-center p-3 bg-white/5 rounded-2xl border border-white/5">
        <AlertCircle className="w-4 h-4 text-white/20 shrink-0" />
        <p className="text-[10px] font-bold leading-none text-white/40 italic uppercase tracking-tighter">
          {isGoalReached 
            ? "¡Meta alcanzada! Ganancia neta pura activa." 
            : `Faltan $${(goal - currentMargin).toLocaleString('es-AR')} para el objetivo.`}
        </p>
      </div>
    </div>
  );
};