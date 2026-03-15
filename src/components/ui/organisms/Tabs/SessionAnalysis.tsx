/**
 * SessionAnalysis.tsx — v5.0 "Decision Engine"
 * ─────────────────────────────────────────────────────────────
 * Gaming HUD de inteligencia financiera para choferes.
 */

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  Flame,
  Lock,
  Calendar,
  Heart,
  ShieldCheck,
  Trash2,
  Clock,
  CheckCircle,
} from "../../../../lib/icons";
import type { SavedTrip } from "../../../../types/calculator.types";
import {
  useSessionInsights,
  type ExtendedSessionInsights,
  type TimeframeView,
} from "../../../../hooks/useSessionInsights";
import { PremiumGate } from "../../templates/PremiumGate";
import { DailyGoalHeader } from "../../molecules/DailyGoalHeader";
import { useProfileStore } from "../../../../store/useProfileStore";
import { cn, formatCurrency } from "../../../../lib/utils";
import { STATS, ONBOARDING } from "../../../../data/ui-strings";

interface SessionAnalysisProps {
  trips: SavedTrip[];
  onClear: () => void;
}

const getRankName = (level: number): string =>
  STATS.rankNames[Math.min(level - 1, STATS.rankNames.length - 1)] ?? "LEYENDA";

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({
  trips,
  onClear,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeView>("day");
  const [showPremium, setShowPremium] = useState(false);

  const dailyGoal = useProfileStore((state) => state.dailyGoal);
  const setProfile = useProfileStore((state) => state.setProfile);

  const insights = useSessionInsights(trips, dailyGoal, timeframe);

  // ── 1. EMPTY STATE ──────────────────────────────────────────
  if (trips.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center border-2 border-dashed border-white/10 animate-in fade-in duration-500">
        <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,240,104,0.1)]">
          <Activity
            className="relative w-10 h-10 text-primary animate-pulse"
            aria-hidden="true"
          />
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">
          {STATS.emptyTitle}
        </h3>
        <p className="text-sm text-white/60 font-medium leading-relaxed mb-6">
          {STATS.emptyBody}
        </p>
      </div>
    );
  }

  // ── 2. PARTIAL STATE (< 3 viajes) ───────────────────────────
  if (trips.length < 3) {
    const remaining = 3 - trips.length;
    return (
      <div className="glass-card rounded-3xl p-6 border-2 border-white/10 animate-in slide-in-from-bottom-2 duration-500 space-y-4">
        <LevelHeader insights={insights} onClear={onClear} />
        <div className="bg-black/20 rounded-2xl p-4 flex gap-3 items-start border border-white/5">
          <Activity
            className="w-5 h-5 text-warning shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-xs text-white/70 font-medium leading-relaxed">
            {STATS.partialBody(remaining)}
          </p>
        </div>
        <QuickStatsGrid insights={insights} />
      </div>
    );
  }

  // ── 3. FULL DASHBOARD ────────────────────────────────────────
  const criticalTip = insights.prioritizedTips.find(
    (t) => t.priority === "critical",
  );
  const optimizeTips = insights.prioritizedTips.filter(
    (t) => t.priority === "optimize",
  );
  const positiveTip = insights.prioritizedTips.find(
    (t) => t.priority === "positive",
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* ── A. HEADER: Meta Editable + Selector ── */}
      <div className="space-y-4">
        <DailyGoalHeader
          earned={insights.lastJourney.totalMargin}
          goal={dailyGoal}
          onGoalChange={(val) => setProfile({ dailyGoal: val })}
        />

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {(["day", "week", "month"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
                timeframe === t
                  ? "bg-primary text-black shadow-[0_0_15px_var(--color-primary-glow)]"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              {STATS.timeframeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {timeframe === "month" && (
        <PremiumGate featureName="Análisis Mensual Detallado">
          <div className="h-40 flex items-center justify-center text-white/40 uppercase font-black text-xs tracking-widest">
            Cargando inteligencia mensual...
          </div>
        </PremiumGate>
      )}

      {/* ── B. HERO METRIC: Ganancia Neta Simplificada (v5) ── */}
      <div className="glass-card rounded-3xl overflow-hidden border-2 border-primary/30 bg-primary/5 shadow-[0_0_40px_var(--color-primary-glow)]">
        <div className="p-6">
          <p className="text-xs font-black text-primary/80 uppercase tracking-widest mb-1">
            {timeframe === "day"
              ? "GANASTE HOY"
              : timeframe === "week"
                ? "GANASTE ESTA SEMANA"
                : "GANASTE ESTE MES"}
          </p>
          <div className="flex items-baseline gap-3 my-2">
            <p className="text-5xl font-black text-primary tracking-tighter leading-none">
              {formatCurrency(insights.totalMargin)}
            </p>
            {insights.vsPrev && (
              <div className="flex flex-col items-start translate-y-[-2px]">
                <span
                  className={cn(
                    "text-lg font-black leading-none",
                    insights.vsPrev.pct >= 0 ? "text-success" : "text-error",
                  )}
                >
                  {insights.vsPrev.pct >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(insights.vsPrev.pct)}%
                </span>
                <span className="text-[11px] text-white/50 uppercase tracking-widest font-black">
                  vs anterior
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-white/60">
              {insights.trend === "improving"
                ? STATS.trendImproving
                : insights.trend === "declining"
                  ? STATS.trendDeclining
                  : STATS.trendStable}
            </span>
          </div>

          {/* Breakdown colapsable honesto (Sin comisiones inventadas) */}
          <details className="mt-4 group">
            <summary className="text-[11px] font-black text-white/60 uppercase tracking-wider cursor-pointer list-none flex items-center gap-2 hover:text-white transition-colors">
              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              Ver desglose de tu bolsillo
            </summary>

            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-white/70">Ingreso por Apps:</span>
                  <span className="text-white">
                    {formatCurrency(insights.totalFare)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-white/70">Combustible/Gasto:</span>
                  <span className="text-error">
                    -{formatCurrency(insights.lastJourney.fuelCost)}
                  </span>
                </div>
                {insights.lastJourney.tolls > 0 && (
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-white/70">Peajes:</span>
                    <span className="text-error">
                      -{formatCurrency(insights.lastJourney.tolls)}
                    </span>
                  </div>
                )}

                <div className="h-px bg-white/10 my-2" />

                <div className="flex justify-between text-sm font-black uppercase">
                  <span className="text-primary">{STATS.netLabel}:</span>
                  <span className="text-primary text-glow-primary">
                    {formatCurrency(insights.totalMargin)}
                  </span>
                </div>
              </div>

              {/* Progress bar de rentabilidad */}
              <div className="space-y-2 pt-2">
                <div className="h-2.5 bg-error/20 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-primary shadow-[0_0_15px_var(--color-primary-glow)] transition-all duration-1000"
                    style={{ width: `${insights.lastJourney.netPercentage}%` }}
                  />
                </div>
                <p className="text-xs font-black text-white/60 text-right uppercase tracking-widest">
                  Te quedás con el {insights.lastJourney.netPercentage}%
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* ── B2. REFERENCIA CONSTANTE (Solo visible en vistas de largo plazo) ── */}
      {timeframe !== "day" && (
        <div className="glass-card rounded-2xl p-4 border border-white/10 bg-white/5 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">
                {STATS.lastJourneyLabel}
              </p>
              <p className="text-sm font-black text-white">
                {formatCurrency(insights.lastJourney.totalMargin)} netos
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-white/50 uppercase italic">
              {insights.lastJourney.tripCount} viajes
            </p>
          </div>
        </div>
      )}

      {/* ── C. SOPORTE EMOCIONAL / BENCHMARKING ── */}
      <EmotionalSupportSection insights={insights} />
      <BenchmarkingSection insights={insights} />

      {/* ── D. QUICK STATS: EPH · Viajes · Puntería ── */}
      <QuickStatsGrid insights={insights} />

      {/* ── E. PROYECCIÓN REALISTA (Forecasting) ── */}
      {insights.projections && timeframe !== "day" && (
        <div className="glass-card rounded-3xl p-5 border-2 border-secondary/20 bg-secondary/5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-black text-secondary/80 uppercase tracking-widest mb-1">
                {STATS.projectionTitleRealistic}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-white leading-none">
                  {formatCurrency(insights.projections.realistic)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-white/50 uppercase tracking-widest mb-1">
                Cierre Proyectado
              </p>
              <p
                className={cn(
                  "text-xs font-black",
                  insights.projections.metaAchieved
                    ? "text-success"
                    : "text-primary",
                )}
              >
                {insights.projections.metaAchieved
                  ? STATS.weeklyMetaReady
                  : STATS.weeklyMetaLeft(
                      formatCurrency(insights.projections.remToMeta),
                    )}
              </p>
            </div>
          </div>

          {insights.weekdayPerformance && (
            <PerformanceGraph data={insights.weekdayPerformance} />
          )}

          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">
                {STATS.projectionRealistic}
              </span>
            </div>
            <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">
              Top: {formatCurrency(insights.projections.optimistic)}
            </p>
          </div>
        </div>
      )}

      {/* ── F. ALERTA DE PÉRDIDA Y PATRONES ── */}
      <LossPatternsSection insights={insights} />

      {/* ── G. SEMÁFORO DE ESTRATEGIA (Actionable) ── */}
      {(criticalTip || optimizeTips.length > 0 || positiveTip) && (
        <div className="glass-card rounded-3xl p-5 border-2 border-white/10 shadow-lg">
          <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Estrategia de hoy
          </p>
          <div className="space-y-5">
            {criticalTip && (
              <div className="group space-y-3">
                <div className="flex gap-3 items-start p-4 bg-error/10 border border-error/20 rounded-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-error mt-1.5 shadow-[0_0_12px_var(--color-error)] shrink-0 animate-pulse" />
                  <div className="space-y-3 w-full">
                    <p className="text-sm text-white/90 font-bold leading-snug">
                      <span className="text-error uppercase tracking-tight">
                        {STATS.strategyAvoid}
                      </span>{" "}
                      {criticalTip.text}
                    </p>

                    {/* Loss Card Impact */}
                    {criticalTip.lossData && (
                      <div className="flex items-center gap-4 py-2 border-y border-white/10">
                        <div>
                          <p className="text-[11px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">
                            Pérdida Total
                          </p>
                          <p className="text-sm font-black text-error">
                            -{formatCurrency(criticalTip.lossData.amount)}
                          </p>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div>
                          <p className="text-[11px] font-black text-white/50 uppercase tracking-widest leading-none mb-1">
                            Viajes Clavos
                          </p>
                          <p className="text-sm font-black text-white">
                            {criticalTip.lossData.trips}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action suggested con Check de Aceptación */}
                    {criticalTip.suggestedAction && (
                      <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="text-xs font-black text-primary uppercase tracking-tight">
                            {criticalTip.suggestedAction}
                          </span>
                        </div>
                        {criticalTip.ruleId && (
                          <RuleSuggestionCheckbox ruleId={criticalTip.ruleId} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {optimizeTips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 items-start px-1">
                <div className="w-2.5 h-2.5 rounded-full bg-warning mt-1.5 shadow-[0_0_8px_var(--color-warning)] shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm text-white/90 font-medium leading-snug">
                    <span className="text-warning uppercase font-black text-[11px] tracking-tight">
                      {STATS.strategyAdjust}
                    </span>{" "}
                    {tip.text}
                  </p>
                </div>
              </div>
            ))}

            {positiveTip && (
              <div className="flex gap-3 items-start px-1">
                <div className="w-2.5 h-2.5 rounded-full bg-success mt-1.5 shadow-[0_0_8px_var(--color-success)] shrink-0" />
                <p className="text-sm text-white/80 font-medium leading-snug">
                  <span className="text-success uppercase font-black text-[11px] tracking-tight">
                    {STATS.strategyGood}
                  </span>{" "}
                  {positiveTip.text}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── H. BADGES ── */}
      <BadgesSection insights={insights} trips={trips} />

      {/* ── I. VERTICALES (Semi-pro) ── */}
      <div className="glass-card rounded-3xl border-2 border-white/10 overflow-hidden">
        <button
          onClick={() => setShowPremium(!showPremium)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/10 transition-all"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-secondary/80" />
            <span className="text-sm font-black text-white/90 uppercase tracking-widest">
              Rendimiento por App
            </span>
          </div>
          {showPremium ? (
            <ChevronUp className="w-5 h-5 opacity-60" />
          ) : (
            <ChevronDown className="w-5 h-5 opacity-60" />
          )}
        </button>

        {showPremium && (
          <div className="p-5 pt-0 space-y-3 animate-in fade-in duration-300">
            {insights.verticalPerformance.map((vp, idx) => {
              const verticalName =
                vp.vertical === "transport"
                  ? "Pasajeros"
                  : vp.vertical === "delivery"
                    ? "Reparto"
                    : "Logística";
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center text-lg">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase">
                        {verticalName}
                      </p>
                      <p className="text-[11px] text-white/60 font-bold uppercase">
                        {vp.count} viajes · {formatCurrency(vp.margin)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-primary italic leading-none">
                      {formatCurrency(vp.efficiency)}
                    </p>
                    <p className="text-[11px] text-white/50 uppercase font-bold">
                      /km
                    </p>
                  </div>
                </div>
              );
            })}
            <PremiumGate featureName="Análisis de Mercado">
              <button className="w-full py-3 text-xs font-black uppercase text-secondary/80 hover:text-secondary transition-colors tracking-widest border border-secondary/20 rounded-xl bg-secondary/5">
                Desbloquear insights profundos
              </button>
            </PremiumGate>
          </div>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// MOLECULES (Internal)
// ──────────────────────────────────────────────────────────────

const RuleSuggestionCheckbox: React.FC<{ ruleId: string }> = ({ ruleId }) => {
  const acceptedRules = useProfileStore((state) => state.acceptedRules || []);
  const toggleRule = useProfileStore((state) => state.toggleRule);
  const isAccepted = acceptedRules.includes(ruleId);

  return (
    <button
      onClick={() => toggleRule?.(ruleId)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all",
        isAccepted
          ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(0,240,104,0.2)]"
          : "bg-white/10 border-white/20 text-white/60 hover:text-white/90",
      )}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors",
          isAccepted ? "bg-primary border-primary" : "border-white/40",
        )}
      >
        {isAccepted && <CheckCircle className="w-3 h-3 text-black" />}
      </div>
      <span className="text-[11px] font-black uppercase tracking-tighter">
        {isAccepted ? "Aplicado" : "Aceptar"}
      </span>
    </button>
  );
};

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ──────────────────────────────────────────────────────────────

const LevelHeader: React.FC<{
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
            <p className="text-xs font-black text-warning/90 uppercase tracking-widest mb-0.5">
              {STATS.xpLabel} {insights.driverLevel}
            </p>
            <p className="text-base font-black text-white uppercase tracking-tight">
              {rank}
            </p>
          </div>
        </div>
        <button
          onClick={() => confirm(STATS.clearConfirm) && onClear()}
          className="p-3 text-white/50 hover:text-error/90 transition-colors rounded-xl bg-white/5 hover:bg-error/10"
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

const QuickStatsGrid: React.FC<{ insights: ExtendedSessionInsights }> = ({
  insights,
}) => {
  return (
    <div className="quick-stats grid grid-cols-3 gap-3">
      <div className="glass-card p-4 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-[11px] font-black text-white/60 uppercase mb-1 tracking-widest">
          EPH
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-xl font-black text-white leading-none">
            {formatCurrency(insights.eph)}
          </p>
        </div>
        <p className="text-[11px] text-white/50 mt-1 font-bold uppercase tracking-tight">
          / hr neto
        </p>
      </div>

      <div className="glass-card p-4 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-[11px] font-black text-white/60 uppercase mb-1 tracking-widest">
          VIAJES
        </p>
        <div className="flex items-baseline gap-1.5">
          <p className="text-xl font-black text-white leading-none">
            {insights.tripCount}
          </p>
        </div>
        <p className="text-[11px] text-white/50 mt-1 font-bold uppercase tracking-tight">
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
        <p className="text-[11px] font-black text-white/70 uppercase mb-1 tracking-widest">
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
        <p className="text-[11px] text-white/60 mt-1 font-bold uppercase tracking-tight">
          positivos
        </p>
      </div>
    </div>
  );
};

const PerformanceGraph: React.FC<{
  data: NonNullable<ExtendedSessionInsights["weekdayPerformance"]>;
}> = ({ data }) => {
  const maxMargin = Math.max(...data.map((d) => d.margin), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((day, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={cn(
              "w-full rounded-t-md transition-all duration-1000 relative",
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
              "text-[11px] font-black uppercase tracking-tighter",
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

const EmotionalSupportSection: React.FC<{
  insights: ExtendedSessionInsights;
}> = ({ insights }) => {
  const vsPrev = insights.vsPrev?.pct || 0;

  const state = useMemo(() => {
    if (vsPrev > 20)
      return {
        icon: <Flame className="w-8 h-8 text-primary animate-pulse" />,
        title: "¡NIVEL LEYENDA!",
        body: `Estás un ${Math.round(vsPrev)}% arriba. No es suerte, es estrategia pura.`,
        theme: "border-primary/40 bg-primary/10 text-primary",
      };
    if (vsPrev > 5)
      return {
        icon: <TrendingUp className="w-8 h-8 text-success" />,
        title: "RITMO GANADOR",
        body: "Venís mejorando tu promedio. Mantené la zona y el criterio.",
        theme: "border-success/40 bg-success/10 text-success",
      };
    if (vsPrev < -15)
      return {
        icon: <Heart className="w-8 h-8 text-error shrink-0" />,
        title: "DÍA DE AGUANTE",
        body: "El mercado está un poco lento. Pasa seguido, a resetear que hay revancha.",
        theme: "border-error/40 bg-error/10 text-error",
      };
    if (vsPrev < -5)
      return {
        icon: <TrendingDown className="w-8 h-8 text-warning" />,
        title: "DÍA TRANQUI",
        body: "Un poco abajo del promedio. ¿Probaste cambiar de horario?",
        theme: "border-warning/40 bg-warning/10 text-warning",
      };
    return {
      icon: <Activity className="w-8 h-8 text-white/50" />,
      title: "EN TU ZONA",
      body: "Estás rindiendo exactamente lo que proyectamos. Consistencia.",
      theme: "border-white/20 bg-white/10 text-white/80",
    };
  }, [vsPrev]);

  return (
    <div
      className={cn(
        "glass-card p-5 border-2 rounded-3xl flex gap-4 items-center animate-in zoom-in-95",
        state.theme,
      )}
    >
      <div className="shrink-0">{state.icon}</div>
      <div>
        <h4 className="text-sm font-black uppercase tracking-tight leading-none mb-1">
          {state.title}
        </h4>
        <p className="text-xs font-medium opacity-90">{state.body}</p>
      </div>
    </div>
  );
};

const LossPatternsSection: React.FC<{ insights: ExtendedSessionInsights }> = ({
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
              <p className="text-[11px] text-white/60 font-bold uppercase">
                {p.count} viajes detectados
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-error">
                -{formatCurrency(p.totalLoss)}
              </p>
              <p className="text-[11px] text-error/80 uppercase font-bold tracking-tighter">
                Pérdida
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const BenchmarkingSection: React.FC<{ insights: ExtendedSessionInsights }> = ({
  insights,
}) => {
  if (!insights.benchmark) return null;
  return (
    <div className="glass-card p-4 border-2 border-white/10 bg-white/10 rounded-3xl flex justify-between items-center">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <div>
          <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">
            {STATS.benchmarkingTitle}
          </p>
          <p className="text-xs font-black text-white uppercase italic">
            {STATS.benchmarkingStatus(insights.benchmark.percentile)}
          </p>
        </div>
      </div>
      <div className="bg-primary/20 px-3 py-1.5 rounded-xl">
        <span className="text-[11px] font-black text-primary uppercase">
          {STATS.benchmarkingVsAvg(insights.benchmark.isAboveAvg)}
        </span>
      </div>
    </div>
  );
};

const BadgesSection: React.FC<{
  insights: ExtendedSessionInsights;
  trips: SavedTrip[];
}> = ({ insights, trips }) => {
  const nextBadge = [
    { target: 5, label: STATS.badgeLabels.speed, icon: "⚡" },
    { target: 10, label: STATS.badgeLabels.rower, icon: "🚣" },
    { target: 15, label: STATS.badgeLabels.owner, icon: "🚀" },
  ].find((b) => trips.length < b.target);

  return (
    <div className="glass-card p-5 border-2 border-white/10 rounded-3xl space-y-4">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-warning" />
        <span className="text-xs font-black text-white/80 uppercase tracking-widest">
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
            <span className="text-[10px] font-black uppercase text-center px-1 leading-tight text-white/80">
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

SessionAnalysis.displayName = "SessionAnalysis";
