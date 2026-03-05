import React, { useMemo } from "react";
import { Target, Clock } from "lucide-react";
import type { SavedTrip } from "../../../types/calculator.types";

interface DailyGoalTrackerProps {
  dailyGoal: number;
  dailyHours: number;
  todayTrips: SavedTrip[];
  onGoalChange: (value: number) => void;
  onHoursChange: (value: number) => void;
}

export const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({
  dailyGoal,
  dailyHours,
  todayTrips,
  onGoalChange,
  onHoursChange,
}) => {
  const todayNet = useMemo(
    () => todayTrips.reduce((acc, t) => acc + t.margin, 0),
    [todayTrips],
  );

  const progressPct =
    dailyGoal > 0 ? Math.min(100, Math.round((todayNet / dailyGoal) * 100)) : 0;

  const isReached = dailyGoal > 0 && todayNet >= dailyGoal;
  const remaining = Math.max(0, dailyGoal - todayNet);

  return (
    <div className="space-y-4">
      {/* Goal input row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="field-wrapper">
          <label
            htmlFor="daily-goal"
            className="label-base flex items-center gap-1.5"
          >
            <Target size={12} aria-hidden="true" />
            Meta diaria ($)
          </label>
          <div className="field-input-wrapper">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-white/30 pointer-events-none"
              aria-hidden="true"
            >
              $
            </span>
            <input
              id="daily-goal"
              type="number"
              inputMode="numeric"
              value={dailyGoal || ""}
              onChange={(e) => onGoalChange(Number(e.target.value))}
              placeholder="40000"
              min="0"
              step="1000"
              className="input-base input-focus text-sm pl-10"
            />
          </div>
        </div>

        <div className="field-wrapper">
          <label
            htmlFor="daily-hours"
            className="label-base flex items-center gap-1.5"
          >
            <Clock size={12} aria-hidden="true" />
            Horas objetivo
          </label>
          <div className="field-input-wrapper">
            <input
              id="daily-hours"
              type="number"
              inputMode="numeric"
              value={dailyHours || ""}
              onChange={(e) => onHoursChange(Number(e.target.value))}
              placeholder="8"
              min="1"
              max="24"
              step="0.5"
              className="input-base input-focus text-sm pr-11"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-white/35 pointer-events-none">
              hs
            </span>
          </div>
        </div>
      </div>

      {/* Progress section — only shown if goal is set */}
      {dailyGoal > 0 && (
        <div
          className={`p-4 rounded-3xl border transition-all duration-500 ${isReached
              ? "bg-success/10 border-success/30"
              : "bg-white/3 border-white/[0.07]"
            }`}
          role="status"
          aria-label={`Progreso diario: ${progressPct}% de la meta alcanzado`}
        >
          {/* Numbers row */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-0.5">
                Ganado hoy
              </p>
              <p
                className={`text-2xl font-black ${isReached ? "text-success" : "text-white"}`}
              >
                ${todayNet.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-0.5">
                {isReached ? "¡Meta!" : "Faltan"}
              </p>
              <p
                className={`text-base font-black ${isReached ? "text-success" : "text-white/60"}`}
              >
                {isReached ? "🎯" : `$${remaining.toLocaleString("es-AR")}`}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-track" aria-hidden="true">
            <div
              className={
                isReached ? "progress-fill-success" : "progress-fill-default"
              }
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-2 text-right">
            {progressPct}% completado
          </p>
        </div>
      )}

      {dailyGoal === 0 && (
        <p className="label-hint text-center py-2">
          Seteá una meta para ver tu progreso en tiempo real 🎯
        </p>
      )}
    </div>
  );
};
