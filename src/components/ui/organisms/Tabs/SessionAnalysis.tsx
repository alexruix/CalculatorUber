/**
 * SessionAnalysis.tsx — v3.0 "Decision Engine"
 * ─────────────────────────────────────────────────────────────
 * Gaming HUD de inteligencia financiera para choferes.
 *
 * Jerarquía de información:
 * 1. LevelHeader      → Rango + XP
 * 2. HeroMetric       → Ganancia Neta Real HOY
 * 3. LossAlert        → [NUEVO] Muro de la verdad (Dinero quemado)
 * 4. WeeklyProjection → [NUEVO] Forecasting y Seguridad Psicológica
 * 5. QuickStats       → EPH · Viajes · Puntería
 * 6. MetaProgress     → Barra de meta diaria
 * 7. DecisionLight    → [NUEVO] Semáforo de Estrategia
 * 8. BadgesSection    → Logros desbloqueados
 * 9. [PRO] Premium    → Análisis temporal + Verticales
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
  const insights = useSessionInsights(trips);

  // ── LÓGICA DE DECISIÓN EN TIEMPO REAL ─────────────────────────
  const lossTrips = trips.filter(t => t.margin < 0);
  const lossTripCount = lossTrips.length;
  const totalLossValue = Math.abs(lossTrips.reduce((sum, t) => sum + t.margin, 0));
  
  // Proyección simplificada: Toma lo ganado hoy y lo proyecta a 6 días más (semana)
  const weeklyProjection = insights.totalMargin > 0 ? insights.totalMargin * 7 : 0;

  // ── 1. EMPTY STATE ──────────────────────────────────────────
  if (trips.length === 0) {
    return (
      <div
        className="glass-card rounded-3xl p-10 text-center border-2 border-dashed border-white/10 animate-in fade-in duration-500"
        role="status"
      >
        <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,240,104,0.1)]">
          <Activity className="relative w-10 h-10 text-primary animate-pulse" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">
          ¿Arrancamos la jornada?
        </h3>
        <p className="text-sm text-white/60 font-medium leading-relaxed mb-6">
          Cargá tu primer viaje para ver el radar de inteligencia en acción y empezar a tomar mejores decisiones.
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
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">

      {/* ── A. HEADER: Nivel + XP ── */}
      <div className="glass-card rounded-3xl p-5 border-2 border-white/10">
        <LevelHeader insights={insights} onClear={onClear} />
      </div>

      {/* ── B. HERO METRIC: Ganancia del día ── */}
      <div className="glass-card rounded-3xl p-6 border-2 border-primary/30 bg-primary/5 shadow-[0_0_40px_var(--color-primary-glow)]">
        <p className="text-xs font-black text-primary/60 uppercase tracking-widest mb-1">
          {STATS.heroLabel}
        </p>
        <p className="text-5xl font-black text-primary tracking-tighter leading-none mb-2">
          {formatCurrency(insights.totalMargin)}
        </p>
        <div className="flex items-center gap-2">
          {insights.trend === 'improving'
            ? <TrendingUp className="w-4 h-4 text-success" aria-hidden="true" />
            : insights.trend === 'declining'
            ? <TrendingDown className="w-4 h-4 text-error" aria-hidden="true" />
            : <Minus className="w-4 h-4 text-white/50" aria-hidden="true" />
          }
          <span className={cn(
            "text-xs font-black uppercase tracking-widest",
            insights.trend === 'improving' ? 'text-success' :
            insights.trend === 'declining' ? 'text-error' : 'text-white/60'
          )}>
            {insights.trend === 'improving' ? 'Tendencia en alza' :
             insights.trend === 'declining' ? 'Tendencia a la baja' : 'Tendencia estable'}
          </span>
        </div>
      </div>

      {/* ── C. [NUEVO] ALERTA DE PÉRDIDA (El muro de la verdad) ── */}
      {lossTripCount > 0 && (
        <div className="glass-card rounded-3xl p-5 border-2 border-error/30 bg-error/5 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-error">
            <AlertTriangle className="w-5 h-5 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-widest">Alerta de Pérdida</span>
          </div>
          <p className="text-sm font-bold text-white/90">
            Hoy tuviste <span className="text-error">{lossTripCount} viajes</span> que no cubrieron tus costos operativos.
          </p>
          <div className="p-4 bg-black/40 rounded-2xl border border-error/20 flex justify-between items-center">
            <span className="text-xs font-black text-white/60 uppercase">Dinero quemado</span>
            <span className="text-2xl font-black text-error">-{formatCurrency(totalLossValue)}</span>
          </div>
          <p className="text-xs text-white/60 italic font-medium leading-tight">
            💡 Si filtrás esos viajes, tu ganancia de hoy sería de 
            <span className="text-success font-black"> {formatCurrency(insights.totalMargin + totalLossValue)}</span>.
          </p>
        </div>
      )}

      {/* ── D. QUICK STATS: EPH · Viajes · Puntería ── */}
      <QuickStatsGrid insights={insights} />

      {/* ── E. [NUEVO] PROYECCIÓN SEMANAL ── */}
      <div className="glass-card rounded-3xl p-5 border-2 border-secondary/20 bg-secondary/5">
        <div className="flex justify-between items-end mb-5">
          <div>
            <p className="text-xs font-black text-secondary/80 uppercase tracking-widest mb-1">Proyección Semanal</p>
            <p className="text-3xl font-black text-white leading-none">{formatCurrency(weeklyProjection)}</p>
          </div>
          {dailyGoal > 0 && (
            <div className="text-right">
              <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">Cierre Hoy</p>
              <p className={cn("text-xs font-black", goalAchieved ? "text-success" : "text-primary")}>
                {goalAchieved ? "¡Meta lista!" : `Faltan ${formatCurrency(goalRemaining)}`}
              </p>
            </div>
          )}
        </div>
        {/* Mini Gráfico Visual CSS */}
        <div className="flex items-end gap-1.5 h-12 mt-2">
          {[40, 65, 80, 100, 0, 0, 0].map((h, i) => (
            <div 
              key={i} 
              className={cn(
                "flex-1 rounded-t-md transition-all duration-1000",
                i === 3 ? "bg-primary" : i < 3 ? "bg-primary/30" : "bg-white/5 border border-dashed border-white/10"
              )}
              style={{ height: h > 0 ? `${h}%` : '20%' }}
            />
          ))}
        </div>
        <p className="text-xs font-black text-white/50 uppercase tracking-widest mt-3 flex justify-between">
          <span>Lun</span><span>Mie</span><span>Vie</span><span>Dom</span>
        </p>
      </div>

      {/* ── F. META DEL DÍA ── */}
      {dailyGoal > 0 && (
        <div className={cn(
          "glass-card rounded-3xl p-5 border-2 transition-all",
          goalAchieved
            ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_var(--color-primary-glow)]"
            : "border-white/10"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="text-xs font-black text-white/70 uppercase tracking-widest">
                {STATS.metaLabel}
              </span>
            </div>
            <span className={cn(
              "text-base font-black uppercase tracking-tight",
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
        </div>
      )}

      {/* ── G. [NUEVO] SEMÁFORO DE DECISIONES ── */}
      {(criticalTip || optimizeTips.length > 0 || positiveTip) && (
        <div className="glass-card rounded-3xl p-5 border-2 border-white/10">
          <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-4">
            Estrategia de hoy
          </p>
          <div className="space-y-4">
            
            {/* Acción Positiva */}
            {positiveTip && (
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-success mt-1 shadow-[0_0_10px_var(--color-success)] shrink-0" />
                <p className="text-sm text-white/90 font-medium leading-snug">
                  <span className="font-black text-success">¡Bien hecho!</span> {positiveTip.text}
                </p>
              </div>
            )}

            {/* Acción a Optimizar */}
            {optimizeTips.map((tip, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-warning mt-1 shadow-[0_0_10px_var(--color-warning)] shrink-0" />
                <p className="text-sm text-white/90 font-medium leading-snug">
                  <span className="font-black text-warning">Ajuste:</span> {tip.text}
                </p>
              </div>
            ))}

            {/* Acción Crítica (Roja) */}
            {criticalTip && (
              <div className="flex gap-3 items-start">
                <div className="w-2.5 h-2.5 rounded-full bg-error mt-1 shadow-[0_0_10px_var(--color-error)] shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm text-white/90 font-medium leading-snug">
                    <span className="font-black text-error">Evitá esto:</span> {criticalTip.text}
                  </p>
                  {criticalTip.impact && (
                    <p className="text-xs font-black text-error/70 uppercase tracking-widest mt-1">
                      Impacto: {criticalTip.impact}
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── H. BADGES ── */}
      <div className="glass-card rounded-3xl p-5 border-2 border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-warning" aria-hidden="true" />
          <span className="text-xs font-black text-white/70 uppercase tracking-widest">
            {STATS.badgesTitle}
          </span>
          {unlockedBadges.length > 0 && (
            <span className="ml-auto text-xs font-black text-warning/90 uppercase">
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
                  "shrink-0 flex flex-col items-center gap-1.5 px-4 pt-4 pb-3 rounded-2xl border-2 transition-all",
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
                <span className="text-3xl" role="img">{badge.icon}</span>
                <span className="text-xs font-black uppercase tracking-tighter text-white/80 whitespace-nowrap">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Próximo logro en progreso */}
        {nextBadgeThresholds && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-3">
              {STATS.badgesInProgress}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-2xl">{nextBadgeThresholds.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-black text-white/90 mb-2">{nextBadgeThresholds.label}</p>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning/80 rounded-full transition-all duration-700"
                    style={{ width: `${Math.round((trips.length / nextBadgeThresholds.target) * 100)}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mt-2">
                  {trips.length}/{nextBadgeThresholds.target} viajes · {STATS.badgesRemaining(nextBadgeThresholds.target - trips.length)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── I. PREMIUM: Vertical Performance ── */}
      <button
        onClick={() => setShowPremium(!showPremium)}
        className="w-full flex items-center justify-between px-5 py-4 glass-card rounded-3xl border-2 border-secondary/20 hover:border-secondary/40 transition-all"
        aria-expanded={showPremium}
      >
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-secondary/80" aria-hidden="true" />
          <span className="text-sm font-black text-secondary/90 uppercase tracking-widest">
            {STATS.premiumTitle}
          </span>
        </div>
        {showPremium
          ? <ChevronUp className="w-5 h-5 text-white/40" aria-hidden="true" />
          : <ChevronDown className="w-5 h-5 text-white/40" aria-hidden="true" />
        }
      </button>

      {showPremium && (
        <PremiumGate featureName="Análisis Pro y Verticales">
          <div className="glass-card rounded-3xl p-5 border-2 border-secondary/20 space-y-6 animate-in slide-in-from-top-2 duration-300">

            {/* Racha */}
            {insights.profitableStreak >= 3 && (
              <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-2xl border border-accent/20">
                <Flame className="w-6 h-6 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-black text-accent/80 uppercase tracking-widest">RACHA ACTIVA</p>
                  <p className="text-base font-black text-white">
                    {insights.profitableStreak} viajes rentables al hilo 🔥
                  </p>
                </div>
              </div>
            )}

            {/* Verticales */}
            {insights.verticalPerformance.length > 0 && (
              <div>
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-3">
                  {STATS.verticalTitle}
                </p>
                <div className="space-y-2">
                  {insights.verticalPerformance.map((vp, idx) => {
                    const verticalName = vp.vertical === 'transport' ? 'Transporte' : vp.vertical === 'delivery' ? 'Delivery' : vp.vertical === 'logistics' ? 'Logística' : 'Otros';
                    const medals = ['🥇', '🥈', '🥉'];
                    return (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 transition-colors hover:bg-white/10">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center text-lg">
                            {medals[idx] ?? '•'}
                           </div>
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{verticalName}</p>
                            <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-0.5">{vp.count} viajes · {formatCurrency(vp.margin)} netos</p>
                          </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-primary italic leading-none">{formatCurrency(vp.efficiency)}</p>
                            <p className="text-xs text-white/50 uppercase font-black tracking-tighter mt-1">/km</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Promedio por viaje */}
            <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-secondary/80" aria-hidden="true" />
                <p className="text-sm font-black text-white/80 uppercase tracking-widest">Promedio por viaje</p>
              </div>
              <p className="text-xl font-black text-secondary">{formatCurrency(insights.avgMarginPerTrip)}</p>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-warning/15 rounded-2xl flex items-center justify-center border border-warning/25">
            <Trophy className="w-6 h-6 text-warning" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black text-warning/80 uppercase tracking-widest mb-0.5">{STATS.xpLabel} {insights.driverLevel}</p>
            <p className="text-base font-black text-white uppercase tracking-tight">{rank}</p>
          </div>
        </div>
        <button
          onClick={() => confirm('¿Limpiamos el balance del día?') && onClear()}
          className="p-3 text-white/30 hover:text-error/80 transition-colors rounded-xl hover:bg-white/10"
          aria-label="Limpiar historial del día"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-linear-to-r from-warning/80 to-warning shadow-[0_0_10px_var(--color-warning)] rounded-full transition-all duration-1000"
            style={{ width: `${xpPercent}%` }}
            role="progressbar"
            aria-valuenow={xpPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de nivel"
          />
        </div>
        <p className="text-xs font-bold text-white/60 uppercase tracking-widest text-right">
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
    <div className="glass-card rounded-2xl p-4 border border-white/10 bg-white/5 text-center group transition-all hover:border-secondary/40">
      <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1 group-hover:text-secondary/90 transition-colors">{STATS.quickEph}</p>
      <p className="text-2xl font-black text-white leading-none group-hover:text-secondary transition-colors">
        {insights.eph > 0 ? formatCurrency(insights.eph) : '—'}
      </p>
      <p className="text-xs text-white/50 font-bold uppercase mt-1">/hr</p>
    </div>
    {/* Viajes */}
    <div className="glass-card rounded-2xl p-4 border border-white/10 bg-white/5 text-center transition-all hover:border-white/30">
      <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1 transition-colors">{STATS.quickTrips}</p>
      <p className="text-2xl font-black text-white leading-none">{insights.tripCount}</p>
      <p className="text-xs text-white/50 font-bold uppercase mt-1">total</p>
    </div>
    {/* Puntería */}
    <div className={cn(
      "glass-card rounded-2xl p-4 border transition-all text-center",
      insights.profitableTripsPercent >= 90 ? "border-success/40 bg-success/10" :
      insights.profitableTripsPercent >= 70 ? "border-white/10 bg-white/5 hover:border-primary/40" : "border-error/30 bg-error/10"
    )}>
      <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1 truncate">{STATS.quickAim}</p>
      <p className={cn(
        "text-2xl font-black leading-none",
        insights.profitableTripsPercent >= 90 ? "text-success" :
        insights.profitableTripsPercent >= 70 ? "text-primary" : "text-error"
      )}>
        {insights.profitableTripsPercent}%
      </p>
      <p className="text-xs text-white/50 font-bold uppercase mt-1">ok</p>
    </div>
  </div>
);