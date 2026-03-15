import React from "react";
import {
  Trophy,
  Award,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Activity,
} from "../../../../lib/icons";
import { cn, formatCurrency } from "../../../../lib/utils";
import { STATS } from "../../../../data/ui-strings";
import type { ExtendedSessionInsights } from "../../../../hooks/useSessionInsights";
import type { SavedTrip } from "../../../../types/calculator.types";

// Helper for Rank Names
const getRankName = (level: number): string =>
  STATS.rankNames[Math.min(level - 1, STATS.rankNames.length - 1)] ?? "LEYENDA";

/** 
 * LevelHeader - Con visibilidad de Trash2 corregida y tipografía XS
 */
export const LevelHeader: React.FC<{
  insights: ExtendedSessionInsights;
  onClear: () => void;
}> = ({ insights, onClear }) => {
  const rank = getRankName(insights.driverLevel);
  const xpPercent = Math.max(
    0,
    Math.min(100, 100 - insights.pointsToNextLevel * 10),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-warning/15 rounded-2xl flex items-center justify-center border border-warning/30">
            <Trophy className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-xs font-bold text-warning/90 uppercase tracking-widest mb-0.5">
              {STATS.xpLabel} {insights.driverLevel}
            </p>
            <p className="text-base font-black text-white uppercase tracking-tight">
              {rank}
            </p>
          </div>
        </div>
        <button
          onClick={() => confirm(STATS.clearConfirm) && onClear()}
          className="p-3 text-white/70 hover:text-error transition-colors rounded-xl bg-white/10 hover:bg-error/20"
          aria-label="Limpiar jornada"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-linear-to-r from-warning/80 to-warning shadow-[0_0_10px_var(--color-warning)] transition-all duration-1000"
          style={{ width: `${xpPercent}%` }}
        />
      </div>
    </div>
  );
};

/**
 * QuickStatsGrid - Tipografía XS y pesos estandarizados
 */
export const QuickStatsGrid: React.FC<{ insights: ExtendedSessionInsights }> = ({
  insights,
}) => {
  return (
    <div className="quick-stats grid grid-cols-3 gap-3">
      <div className="glass-card p-4 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-xs font-bold text-white/60 uppercase mb-1 tracking-widest">
          EPH
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-xl font-black text-white leading-none">
            {formatCurrency(insights.eph)}
          </p>
        </div>
        <p className="text-xs text-white/50 mt-1 font-bold uppercase tracking-tight">
          / hr neto
        </p>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-xs font-bold text-white/60 uppercase mb-1 tracking-widest">
          VIAJES
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-xl font-black text-white leading-none">
            {insights.tripCount}
          </p>
        </div>
        <p className="text-xs text-white/50 mt-1 font-bold uppercase tracking-tight">
          completados
        </p>
      </div>

      <div
        className={cn(
          "glass-card p-4 rounded-2xl border transition-all",
          insights.profitableTripsPercent >= 90
            ? "border-success/40 bg-success/10"
            : insights.profitableTripsPercent >= 70
              ? "border-primary/40 bg-primary/10"
              : "border-error/40 bg-error/10",
        )}
      >
        <p className="text-xs font-bold text-white/70 uppercase mb-1 tracking-widest">
          PUNTERÍA
        </p>
        <div className="flex items-baseline gap-1.5">
          <p
            className={cn(
              "text-xl font-black leading-none",
              insights.profitableTripsPercent >= 90
                ? "text-success"
                : insights.profitableTripsPercent >= 70
                  ? "text-primary"
                  : "text-error",
            )}
          >
            {insights.profitableTripsPercent}%
          </p>
        </div>
        <p className="text-xs text-white/60 mt-1 font-bold uppercase tracking-tight">
          positivos
        </p>
      </div>
    </div>
  );
};

/**
 * PerformanceGraph - Etiquetas XS
 */
export const PerformanceGraph: React.FC<{
  data: NonNullable<ExtendedSessionInsights["weekdayPerformance"]>;
}> = ({ data }) => {
  const maxMargin = Math.max(...data.map((d) => d.margin), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-full rounded-t-sm transition-all duration-1000 relative",
              day.isStar
                ? "bg-primary shadow-[0_0_10px_var(--color-primary-glow)]"
                : day.isLow
                  ? "bg-white/20"
                  : "bg-white/30",
            )}
            style={{
              height: `${Math.max((day.margin / maxMargin) * 100, 10)}%`,
            }}
          />
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-tighter",
              day.isStar ? "text-primary" : "text-white/60",
            )}
          >
            {day.day}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * LossPatternsSection
 */
export const LossPatternsSection: React.FC<{ insights: ExtendedSessionInsights }> = ({
  insights,
}) => {
  if (!insights.lossPatterns || insights.lossPatterns.length === 0) return null;
  return (
    <div className="glass-card p-5 border-2 border-error/30 bg-error/10 rounded-3xl space-y-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
      <div className="flex items-center gap-2 text-error">
        <AlertTriangle className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-widest leading-none">
          Puntos de Fuga Detectados
        </span>
      </div>

      {insights.lossPatterns.map((p) => (
        <div key={p.id} className="space-y-3">
          <div className="flex justify-between items-center bg-black/50 p-3 rounded-2xl border border-error/20">
            <div>
              <p className="text-xs font-black text-white uppercase tracking-tight">
                {p.label}
              </p>
              <p className="text-xs text-white/60 font-bold uppercase">
                {p.count} viajes detectados
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-error">
                -{formatCurrency(p.totalLoss)}
              </p>
              <p className="text-xs text-error/80 font-bold uppercase tracking-tighter">
                Pérdida
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * BenchmarkingSection
 */
export const BenchmarkingSection: React.FC<{
  insights: ExtendedSessionInsights;
}> = ({ insights }) => {
  if (!insights.benchmark) return null;
  return (
    <div className="glass-card p-4 border-2 border-white/10 bg-white/10 rounded-3xl flex justify-between items-center">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <div>
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
            {STATS.benchmarkingTitle}
          </p>
          <p className="text-xs font-black text-white uppercase italic">
            {STATS.benchmarkingStatus(insights.benchmark.percentile)}
          </p>
        </div>
      </div>
      <div className="bg-primary/20 px-3 py-1.5 rounded-xl">
        <span className="text-xs font-black text-primary uppercase">
          {STATS.benchmarkingVsAvg(insights.benchmark.isAboveAvg)}
        </span>
      </div>
    </div>
  );
};

/**
 * BadgesSection
 */
export const BadgesSection: React.FC<{
  insights: ExtendedSessionInsights;
  trips: SavedTrip[];
}> = ({ insights, trips }) => {
  return (
    <div className="glass-card p-5 border-2 border-white/10 rounded-3xl space-y-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-warning" />
        <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
          {STATS.badgesTitle}
        </span>
        <span className="ml-auto text-xs font-black text-warning/90">
          {STATS.badgesUnlocked(insights.badges.length)}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {insights.badges.map((b) => (
          <div
            key={b.id}
            className="shrink-0 w-20 h-24 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-inner"
          >
            <span className="text-3xl">{b.icon}</span>
            <span className="text-xs font-bold uppercase text-center px-1 leading-tight text-white/80">
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
