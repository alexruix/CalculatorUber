/**
 * SessionAnalysis.tsx — v3.0 "Stats Dashboard"
 * ─────────────────────────────────────────────────────────────
 * Gaming HUD de inteligencia financiera para choferes.
 *
 * Jerarquía de información:
 *   1. LevelHeader    → Rango + XP
 *   2. HeroMetric     → Ganancia total HOY
 *   3. QuickStats     → EPH · Viajes · Puntería
 *   4. MetaProgress   → Barra de meta diaria
 *   5. CriticalTip    → Acción recomendada prioritaria
 *   6. BadgesSection  → Logros desbloqueados + en progreso
 *   7. [PRO] Premium  → Análisis temporal + Verticales
 */

import React, { useState } from 'react';
import {
  Trophy, Zap, Target, Award, ChevronDown, ChevronUp,
  BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle,
  Activity, Flame, Lock
} from '../../../../lib/icons';
import type { SavedTrip } from '../../../../types/calculator.types';
import { useSessionInsights } from '../../../../hooks/useSessionInsights';
import { PremiumGate } from '../../templates/PremiumGate';
import { cn, formatCurrency } from '../../../../lib/utils';
import { STATS } from '../../../../data/ui-strings';

interface SessionAnalysisProps {
  trips: SavedTrip[];
  onClear: () => void;
  dailyGoal?: number;
}

/** Rango por nivel */
const getRankName = (level: number): string =>
  STATS.rankNames[Math.min(level - 1, STATS.rankNames.length - 1)] ?? 'LEYENDA';

// ──────────────────────────────────────────────────────────────
// EXPORT
// ──────────────────────────────────────────────────────────────

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({
  trips,
  onClear,
  dailyGoal = 0,
}) => {
  const [showPremium, setShowPremium] = useState(false);
  const [dismissedTip, setDismissedTip] = useState(false);
  const insights = useSessionInsights(trips);

  // ── 1. EMPTY STATE ──────────────────────────────────────────
  if (trips.length === 0) {
    return (
      <div
        className="glass-card rounded-3xl p-8 text-center border-2 border-dashed border-white/10 animate-in fade-in duration-500"
        role="status"
      >
        <div className="relative w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <div className="absolute inset-0 bg-secondary/10 blur-xl rounded-full" />
          <BarChart3 className="relative w-8 h-8 text-white/10" aria-hidden="true" />
        </div>
        <h3 className="text-sm font-black text-white/50 uppercase tracking-widest mb-2">
          {STATS.emptyTitle}
        </h3>
        <p className="text-xs text-white/25 font-bold uppercase tracking-wider leading-relaxed">
          {STATS.emptyBody}
        </p>
      </div>
    );
  }

  // ── 2. PARTIAL STATE (< 3 viajes) ───────────────────────────
  if (trips.length < 3) {
    const remaining = 3 - trips.length;
    return (
      <div className="glass-card rounded-3xl p-6 border-2 border-white/10 animate-in slide-in-from-bottom-2 duration-500">
        <LevelHeader insights={insights} onClear={onClear} />
        <div className="mt-4 bg-black/20 rounded-2xl p-4 flex gap-3 items-start border border-white/5">
          <Zap className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-white/60 font-medium leading-relaxed">
            {STATS.partialBody(remaining)}
          </p>
        </div>
        <QuickStatsGrid insights={insights} />
      </div>
    );
  }

  // ── 3. FULL DASHBOARD ────────────────────────────────────────
  const criticalTip = insights.prioritizedTips.find(t => t.priority === 'critical');
  const optimizeTips = insights.prioritizedTips.filter(t => t.priority === 'optimize');
  const positiveTip = insights.prioritizedTips.find(t => t.priority === 'positive');

  const goalProgress = dailyGoal > 0
    ? Math.min(Math.round((insights.totalMargin / dailyGoal) * 100), 100)
    : 0;
  const goalAchieved = dailyGoal > 0 && insights.totalMargin >= dailyGoal;
  const goalRemaining = dailyGoal > 0 ? Math.max(0, dailyGoal - insights.totalMargin) : 0;

  const unlockedBadges = insights.badges;
  const nextBadgeThresholds = [
    { trips: 5,  label: 'Metiendo Pata', icon: '⚡', current: trips.length, target: 5 },
    { trips: 10, label: 'Remador',       icon: '🚣', current: trips.length, target: 10 },
    { trips: 15, label: 'Dueño del Asfalto', icon: '🚀', current: trips.length, target: 15 },
  ].find(b => trips.length < b.target);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">

      {/* ── A. HEADER: Nivel + XP ── */}
      <div className="glass-card rounded-3xl p-5 border-2 border-white/10">
        <LevelHeader insights={insights} onClear={onClear} />
      </div>

      {/* ── B. HERO METRIC: Ganancia del día ── */}
      <div className="glass-card rounded-3xl p-6 border-2 border-primary/30 bg-primary/5 shadow-[0_0_40px_var(--color-primary-glow)]">
        <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">
          {STATS.heroLabel}
        </p>
        <p className="text-5xl font-black text-primary tracking-tighter leading-none mb-2">
          {formatCurrency(insights.totalMargin)}
        </p>
        <div className="flex items-center gap-2">
          {insights.trend === 'improving'
            ? <TrendingUp className="w-3.5 h-3.5 text-success" aria-hidden="true" />
            : insights.trend === 'declining'
            ? <TrendingDown className="w-3.5 h-3.5 text-error" aria-hidden="true" />
            : <Minus className="w-3.5 h-3.5 text-white/30" aria-hidden="true" />
          }
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            insights.trend === 'improving' ? 'text-success' :
            insights.trend === 'declining' ? 'text-error' : 'text-white/30'
          )}>
            {insights.trend === 'improving' ? 'Tendencia en alza' :
             insights.trend === 'declining' ? 'Tendencia a la baja' : 'Tendencia estable'}
          </span>
        </div>
      </div>

      {/* ── C. QUICK STATS: EPH · Viajes · Puntería ── */}
      <QuickStatsGrid insights={insights} />

      {/* ── D. META DEL DÍA ── */}
      {dailyGoal > 0 && (
        <div className={cn(
          "glass-card rounded-3xl p-5 border-2 transition-all",
          goalAchieved
            ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_var(--color-primary-glow)]"
            : "border-white/10"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                {STATS.metaLabel}
              </span>
            </div>
            <span className={cn(
              "text-sm font-black uppercase tracking-tight",
              goalAchieved ? "text-primary" : "text-white"
            )}>
              {formatCurrency(dailyGoal)}
            </span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-2" role="progressbar" aria-valuenow={goalProgress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                goalAchieved
                  ? "bg-linear-to-r from-primary to-primary/60 shadow-[0_0_10px_var(--color-primary-glow)]"
                  : "bg-linear-to-r from-primary/80 to-primary/40"
              )}
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              {goalAchieved ? STATS.metaDone : STATS.metaMissing(formatCurrency(goalRemaining))}
            </p>
            <p className="text-[10px] font-black text-primary/80 uppercase tracking-widest">
              {STATS.metaSuffix(goalProgress)}
            </p>
          </div>
        </div>
      )}

      {/* ── E. TIP CRÍTICO ── */}
      {criticalTip && !dismissedTip && (
        <div
          className="rounded-3xl p-5 border-2 border-error/40 bg-error/5 animate-in zoom-in-95 duration-300"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-[10px] font-black text-error/70 uppercase tracking-widest mb-1">
                {STATS.tipCritical}
              </p>
              <p className="text-sm font-bold text-white/90 leading-relaxed mb-1">
                {criticalTip.text}
              </p>
              {criticalTip.impact && (
                <p className="text-[10px] font-black text-success/70 uppercase tracking-widest">
                  Impacto: {criticalTip.impact}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setDismissedTip(true)}
            className="mt-3 ml-8 text-[10px] font-black text-white/20 hover:text-white/60 uppercase tracking-widest transition-colors"
          >
            {STATS.tipDismiss}
          </button>
        </div>
      )}

      {/* ── F. BADGES ── */}
      <div className="glass-card rounded-3xl p-5 border-2 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-warning" aria-hidden="true" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">
            {STATS.badgesTitle}
          </span>
          {unlockedBadges.length > 0 && (
            <span className="ml-auto text-[10px] font-black text-warning/70 uppercase">
              {STATS.badgesUnlocked(unlockedBadges.length)}
            </span>
          )}
        </div>

        {unlockedBadges.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
            {unlockedBadges.map(badge => (
              <div
                key={badge.id}
                className={cn(
                  "shrink-0 flex flex-col items-center gap-1 px-3 pt-3 pb-2 rounded-2xl border-2 transition-all",
                  badge.color === 'sky'    && "bg-info/10 border-info/30",
                  badge.color === 'amber' && "bg-warning/10 border-warning/30",
                  badge.color === 'orange'&& "bg-warning/10 border-warning/30",
                  badge.color === 'purple'&& "bg-secondary/10 border-secondary/30",
                  badge.color === 'green' && "bg-success/10 border-success/30",
                  badge.color === 'red'   && "bg-error/10 border-error/30",
                  badge.unlockedNow && "shadow-[0_0_15px_currentColor] animate-in zoom-in-95"
                )}
                aria-label={`${badge.name}: ${badge.description}`}
              >
                <span className="text-2xl" role="img">{badge.icon}</span>
                <span className="text-[9px] font-black uppercase tracking-tighter text-white/60 whitespace-nowrap">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Próximo logro en progreso */}
        {nextBadgeThresholds && (
          <div className="bg-white/3 rounded-2xl p-3 border border-white/5">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
              {STATS.badgesInProgress}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xl">{nextBadgeThresholds.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-black text-white/70 mb-1">{nextBadgeThresholds.label}</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning/60 rounded-full transition-all"
                    style={{ width: `${Math.round((trips.length / nextBadgeThresholds.target) * 100)}%` }}
                  />
                </div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">
                  {trips.length}/{nextBadgeThresholds.target} viajes · {STATS.badgesRemaining(nextBadgeThresholds.target - trips.length)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── G. OPTIMIZACIONES Y POSITIVO ── */}
      {(optimizeTips.length > 0 || positiveTip) && (
        <div className="glass-card rounded-3xl p-5 border-2 border-white/10 space-y-4">
          {optimizeTips.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                {STATS.tipOptimize}
              </p>
              <div className="space-y-2">
                {optimizeTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-white/3 rounded-2xl border border-white/5">
                    <div className="w-5 h-5 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-secondary">{i + 1}</span>
                    </div>
                    <p className="text-xs text-white/70 font-medium leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {positiveTip && (
            <div className="flex gap-3 items-start p-4 bg-success/5 rounded-2xl border border-success/20">
              <span className="text-base mt-0.5" role="img" aria-label="positivo">💡</span>
              <div>
                <p className="text-[10px] font-black text-success/60 uppercase tracking-widest mb-1">
                  {STATS.tipPositive}
                </p>
                <p className="text-xs text-white/80 font-medium leading-relaxed">{positiveTip.text}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── H. PREMIUM: Vertical Performance ── */}
      <button
        onClick={() => setShowPremium(!showPremium)}
        className="w-full flex items-center justify-between px-5 py-4 glass-card rounded-3xl border-2 border-secondary/20 hover:border-secondary/40 transition-all"
        aria-expanded={showPremium}
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-secondary/60" aria-hidden="true" />
          <span className="text-xs font-black text-secondary/70 uppercase tracking-widest">
            {STATS.premiumTitle}
          </span>
        </div>
        {showPremium
          ? <ChevronUp className="w-4 h-4 text-white/20" aria-hidden="true" />
          : <ChevronDown className="w-4 h-4 text-white/20" aria-hidden="true" />
        }
      </button>

      {showPremium && (
        <PremiumGate featureName="Análisis Pro y Verticales">
          <div className="glass-card rounded-3xl p-5 border-2 border-secondary/20 space-y-6 animate-in slide-in-from-top-2 duration-300">

            {/* Racha */}
            {insights.profitableStreak >= 3 && (
              <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-2xl border border-accent/20">
                <Flame className="w-5 h-5 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-black text-accent/70 uppercase tracking-widest">RACHA ACTIVA</p>
                  <p className="text-sm font-black text-white">
                    {insights.profitableStreak} viajes rentables al hilo 🔥
                  </p>
                </div>
              </div>
            )}

            {/* Verticales */}
            {insights.verticalPerformance.length > 0 && (
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                  {STATS.verticalTitle}
                </p>
                <div className="space-y-2">
                  {insights.verticalPerformance.map((vp, idx) => {
                    const verticalName = vp.vertical === 'transport' ? 'Transporte' : vp.vertical === 'delivery' ? 'Delivery' : vp.vertical === 'logistics' ? 'Logística' : 'Otros';
                    const medals = ['🥇', '🥈', '🥉'];
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/3 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-base">{medals[idx] ?? '•'}</span>
                          <div>
                            <p className="text-xs font-black text-white uppercase">{verticalName}</p>
                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{vp.count} viajes · {formatCurrency(vp.margin)} netos</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-success italic">{formatCurrency(vp.efficiency)}<span className="text-[9px] text-white/30 not-italic">/km</span></p>
                      </div>
                    );
                  })}
                </div>
                {insights.verticalPerformance.length >= 2 && (() => {
                  const best = insights.verticalPerformance[0];
                  const worst = insights.verticalPerformance[insights.verticalPerformance.length - 1];
                  const pct = worst.efficiency > 0 ? Math.round(((best.efficiency - worst.efficiency) / worst.efficiency) * 100) : 0;
                  const bestName = best.vertical === 'transport' ? 'Transporte' : best.vertical === 'delivery' ? 'Delivery' : 'Logística';
                  return pct > 5 ? (
                    <p className="text-[10px] font-bold text-white/40 italic mt-2 text-center">
                      💡 {STATS.verticalRec(bestName, pct)}
                    </p>
                  ) : null;
                })()}
              </div>
            )}

            {/* Promedio por viaje */}
            <div className="flex items-center justify-between p-4 bg-white/3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-secondary/60" aria-hidden="true" />
                <p className="text-xs font-black text-white/60 uppercase tracking-widest">Promedio / viaje</p>
              </div>
              <p className="text-lg font-black text-secondary">{formatCurrency(insights.avgMarginPerTrip)}</p>
            </div>

          </div>
        </PremiumGate>
      )}
    </div>
  );
};

SessionAnalysis.displayName = 'SessionAnalysis';

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ──────────────────────────────────────────────────────────────

const LevelHeader: React.FC<{
  insights: ReturnType<typeof useSessionInsights>;
  onClear: () => void;
}> = ({ insights, onClear }) => {
  const rank = getRankName(insights.driverLevel);
  const xpPercent = Math.max(0, Math.min(100, 100 - (insights.pointsToNextLevel * 10)));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-warning/15 rounded-xl flex items-center justify-center border border-warning/25">
            <Trophy className="w-5 h-5 text-warning" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-black text-warning/70 uppercase tracking-widest">{STATS.xpLabel} {insights.driverLevel}</p>
            <p className="text-sm font-black text-white uppercase tracking-tight">{rank}</p>
          </div>
        </div>
        <button
          onClick={() => confirm('¿Limpiamos el balance del día?') && onClear()}
          className="p-2 text-white/10 hover:text-error/60 transition-colors rounded-xl hover:bg-white/5"
          aria-label="Limpiar historial del día"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="space-y-1">
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-warning to-warning/50 rounded-full transition-all duration-1000"
            style={{ width: `${xpPercent}%` }}
            role="progressbar"
            aria-valuenow={xpPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de nivel"
          />
        </div>
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-right">
          {STATS.xpToNext(insights.pointsToNextLevel)}
        </p>
      </div>
    </div>
  );
};

const QuickStatsGrid: React.FC<{
  insights: ReturnType<typeof useSessionInsights>;
}> = ({ insights }) => (
  <div className="grid grid-cols-3 gap-3">
    {/* EPH */}
    <div className="glass-card rounded-2xl p-4 border-2 border-secondary/20 bg-secondary/5 text-center">
      <p className="text-[9px] font-black text-secondary/60 uppercase tracking-widest mb-1">{STATS.quickEph}</p>
      <p className="text-xl font-black text-secondary leading-none">
        {insights.eph > 0 ? formatCurrency(insights.eph) : '—'}
      </p>
      <p className="text-[8px] text-white/20 font-bold uppercase mt-1">/hr</p>
    </div>
    {/* Viajes */}
    <div className="glass-card rounded-2xl p-4 border-2 border-white/10 text-center">
      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{STATS.quickTrips}</p>
      <p className="text-xl font-black text-white leading-none">{insights.tripCount}</p>
      <p className="text-[8px] text-white/20 font-bold uppercase mt-1">total</p>
    </div>
    {/* Puntería */}
    <div className={cn(
      "glass-card rounded-2xl p-4 border-2 text-center",
      insights.profitableTripsPercent >= 90 ? "border-success/30 bg-success/5" :
      insights.profitableTripsPercent >= 70 ? "border-primary/20" : "border-error/20 bg-error/5"
    )}>
      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 truncate">{STATS.quickAim}</p>
      <p className={cn(
        "text-xl font-black leading-none",
        insights.profitableTripsPercent >= 90 ? "text-success" :
        insights.profitableTripsPercent >= 70 ? "text-primary" : "text-error"
      )}>
        {insights.profitableTripsPercent}%
      </p>
      <p className="text-[8px] text-white/20 font-bold uppercase mt-1">ok</p>
    </div>
  </div>
);