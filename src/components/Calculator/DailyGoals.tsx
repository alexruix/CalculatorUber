import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';

interface DailyGoalsProps {
  currentMargin: number; // Recibe el acumulado del Session Tracker
}

export const DailyGoals = ({ currentMargin }: DailyGoalsProps) => {
  // Estado para la meta diaria (persiste en localStorage)
  const [goal, setGoal] = useState<number>(15000); // Meta por defecto: $15.000
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem('nodo_daily_goal');
    if (savedGoal) setGoal(Number(savedGoal));
  }, []);

  const saveGoal = (newGoal: number) => {
    setGoal(newGoal);
    localStorage.setItem('nodo_daily_goal', newGoal.toString());
    setIsEditing(false);
  };

  const progress = Math.min((currentMargin / goal) * 100, 100);
  const isGoalReached = currentMargin >= goal;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-nodo-petrol" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80">Meta Diaria</h3>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-white/5 rounded-lg transition-all"
        >
          <Edit2 className="w-3 h-3 text-white/20" />
        </button>
      </div>

      {isEditing ? (
        <div className="flex gap-2 mb-4 animate-in zoom-in-95 duration-200">
          <input 
            type="number" 
            autoFocus
            className="flex-1 bg-black/40 border border-nodo-petrol rounded-xl px-4 py-2 text-sm font-mono outline-none"
            placeholder="Set Goal (ARS)"
            onBlur={(e) => saveGoal(Number(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && saveGoal(Number(e.currentTarget.value))}
          />
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-2xl font-black text-white">
              ${currentMargin.toLocaleString('es-AR')}
              <span className="text-xs text-white/20 font-medium ml-2 uppercase">/ ${goal.toLocaleString('es-AR')}</span>
            </p>
            {isGoalReached ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <span className="text-[10px] font-bold text-nodo-sand">
                {Math.round(100 - progress)}% restante
              </span>
            )}
          </div>

          {/* Barra de Progreso NODO Style */}
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${isGoalReached ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-nodo-petrol'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 items-start p-3 bg-white/5 rounded-2xl border border-white/5">
        <AlertCircle className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-white/40 italic">
          {isGoalReached 
            ? "¡Meta alcanzada! Todo el ingreso extra de ahora en más es ganancia neta pura." 
            : `Necesitás aproximandamente $${(goal - currentMargin).toLocaleString('es-AR')} más para cubrir tu objetivo de hoy.`}
        </p>
      </div>
    </div>
  );
};