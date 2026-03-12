import { useMemo } from 'react';
import type { SavedTrip, SessionInsights, Badge } from '../types/calculator.types';
import { formatCurrency } from '../lib/utils';

// ──────────────────────────────────────────────────────────────
// TIPOS EXTENDIDOS
// ──────────────────────────────────────────────────────────────

export type TipPriority = 'critical' | 'optimize' | 'positive';

export interface PrioritizedTip {
  text: string;
  priority: TipPriority;
  impact?: string;  // Opcional: impacto estimado (ej: "+$2.000/día")
}

export interface ExtendedSessionInsights extends SessionInsights {
  /** Ganancia neta total de la jornada */
  totalMargin: number;
  /** Recaudación bruta total */
  totalFare: number;
  /** Ganancia por hora (EPH) estimada */
  eph: number;
  /** Tiempo activo total estimado (minutos) */
  activeMinutes: number;
  /** Cantidad de viajes */
  tripCount: number;
  /** Tips con prioridad para el dashboard */
  prioritizedTips: PrioritizedTip[];
}

/**
 * Hook para calcular la data y las chapas (badges) de la sesión.
 * v2.0 — Extiende con EPH, totalMargin, y tips con prioridad.
 */
export const useSessionInsights = (trips: SavedTrip[]): ExtendedSessionInsights => {
  return useMemo(() => {
    const empty: ExtendedSessionInsights = {
      bestTrip: null,
      worstTrip: null,
      trend: 'stable',
      profitableTripsPercent: 0,
      avgMarginPerTrip: 0,
      profitableStreak: 0,
      tips: [],
      prioritizedTips: [],
      badges: [],
      driverLevel: 1,
      pointsToNextLevel: 10,
      totalPoints: 0,
      bestTimeOfDay: null,
      verticalPerformance: [],
      totalMargin: 0,
      totalFare: 0,
      eph: 0,
      activeMinutes: 0,
      tripCount: 0,
    };

    if (trips.length === 0) return empty;

    // === 1. MEJOR Y PEOR VIAJE ===
    const bestTrip = trips.reduce((best, trip) =>
      trip.margin > best.margin ? trip : best
    );
    const worstTrip = trips.reduce((worst, trip) =>
      trip.margin < worst.margin ? trip : worst
    );

    // === 2. TENDENCIA ===
    const trend = calculateTrend(trips);

    // === 3. PUNTERÍA ===
    const profitableTrips = trips.filter(t => t.margin > 0);
    const profitableTripsPercent = Math.round((profitableTrips.length / trips.length) * 100);

    // === 4. TOTALES ===
    const totalMargin = trips.reduce((sum, t) => sum + t.margin, 0);
    const totalFare = trips.reduce((sum, t) => sum + t.fare, 0);
    const avgMarginPerTrip = Math.round(totalMargin / trips.length);

    // === 5. EPH (Eficiencia por hora) ===
    // Usamos activeTime (minutos) de cada viaje + duración como fallback
    const activeMinutes = trips.reduce((sum, t) => {
      const minutes = t.activeTime ?? t.duration ?? 0;
      return sum + minutes;
    }, 0);
    const activeHours = activeMinutes / 60;
    const eph = activeHours > 0 ? Math.round(totalMargin / activeHours) : 0;

    // === 6. RACHA ===
    const profitableStreak = calculateProfitableStreak(trips);

    // === 7. TIPS CON PRIORIDAD ===
    const prioritizedTips = generatePrioritizedTips(
      trips, profitableTripsPercent, avgMarginPerTrip, bestTrip, worstTrip, totalMargin
    );
    const tips = prioritizedTips.map(t => t.text);

    // === 8. BADGES ===
    const badges = calculateBadges(trips, profitableStreak, profitableTripsPercent, totalMargin, avgMarginPerTrip);

    // === 9. NIVEL ===
    const { level, points, pointsToNext } = calculateLevel(trips.length, totalMargin);

    // === 10. VERTICALES ===
    const verticalStats: Record<string, { margin: number, distance: number, count: number }> = {};
    trips.forEach(t => {
      const v = t.vertical || 'unknown';
      if (!verticalStats[v]) verticalStats[v] = { margin: 0, distance: 0, count: 0 };
      verticalStats[v].margin += t.margin;
      verticalStats[v].distance += (t.distance || 0);
      verticalStats[v].count += 1;
    });
    const verticalPerformance = Object.entries(verticalStats).map(([v, stats]) => ({
      vertical: v as any,
      margin: stats.margin,
      distance: stats.distance,
      count: stats.count,
      efficiency: stats.distance > 0 ? Math.round(stats.margin / stats.distance) : 0,
    })).sort((a, b) => b.efficiency - a.efficiency);

    return {
      bestTrip,
      worstTrip,
      trend,
      profitableTripsPercent,
      avgMarginPerTrip,
      profitableStreak,
      tips,
      prioritizedTips,
      badges,
      driverLevel: level,
      pointsToNextLevel: pointsToNext,
      totalPoints: points,
      bestTimeOfDay: null,
      verticalPerformance,
      totalMargin,
      totalFare,
      eph,
      activeMinutes,
      tripCount: trips.length,
    };
  }, [trips]);
};

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────

const calculateTrend = (trips: SavedTrip[]): 'improving' | 'stable' | 'declining' => {
  if (trips.length < 3) return 'stable';
  const half = Math.floor(trips.length / 2);
  const firstHalf = trips.slice(0, half);
  const secondHalf = trips.slice(half);
  const firstAvg = firstHalf.reduce((sum, t) => sum + t.margin, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, t) => sum + t.margin, 0) / secondHalf.length;
  const improvement = ((secondAvg - firstAvg) / Math.abs(firstAvg || 1)) * 100;
  if (improvement > 10) return 'improving';
  if (improvement < -10) return 'declining';
  return 'stable';
};

const calculateProfitableStreak = (trips: SavedTrip[]): number => {
  let streak = 0;
  for (let i = 0; i < trips.length; i++) {
    if (trips[i].margin > 0) streak++;
    else break;
  }
  return streak;
};

/**
 * Genera tips con prioridad: critical → optimize → positive
 * Solo entrega 1 critical + 2 optimize máx + 1 positive
 */
const generatePrioritizedTips = (
  trips: SavedTrip[],
  profitablePercent: number,
  avgMargin: number,
  bestTrip: SavedTrip,
  worstTrip: SavedTrip,
  totalMargin: number,
): PrioritizedTip[] => {
  const critical: PrioritizedTip[] = [];
  const optimize: PrioritizedTip[] = [];
  const positive: PrioritizedTip[] = [];

  const avgFare = trips.reduce((sum, t) => sum + t.fare, 0) / trips.length;
  const highMarginTrips = trips.filter(t => t.margin > avgMargin);
  const minRecommendedFare = highMarginTrips.length > 0
    ? Math.round(highMarginTrips.reduce((sum, t) => sum + t.fare, 0) / highMarginTrips.length * 0.85)
    : Math.round(avgFare * 0.85);

  // CRÍTICO: Muchos clavos
  const lowMarginTrips = trips.filter(t => t.margin < avgMargin * 0.5);
  if (lowMarginTrips.length > trips.length * 0.3) {
    const pct = Math.round((lowMarginTrips.length / trips.length) * 100);
    critical.push({
      priority: 'critical',
      text: `Evitá viajes de menos de ${formatCurrency(minRecommendedFare)}. El ${pct}% de tus viajes son clavos.`,
      impact: '+$2.000/día estimado',
    });
  }

  // CRÍTICO: Margen promedio muy bajo
  if (avgMargin < 800 && trips.length >= 3) {
    critical.push({
      priority: 'critical',
      text: `Tu margen promedio es bajo (${formatCurrency(avgMargin)}/viaje). Filtrá mejor los destinos cortos.`,
      impact: `+${formatCurrency(800 - avgMargin)}/viaje potencial`,
    });
  }

  // OPTIMIZACIÓN: Replicar el mejor viaje
  if (bestTrip && trips.length >= 3) {
    optimize.push({
      priority: 'optimize',
      text: `Tu mejor viaje dejó ${formatCurrency(bestTrip.margin)} limpios. Buscá más viajes con esa relación tarifa-distancia.`,
    });
  }

  // OPTIMIZACIÓN: Tendencia
  const trend = calculateTrend(trips);
  if (trend === 'declining' && trips.length >= 4) {
    optimize.push({
      priority: 'optimize',
      text: 'Tus últimos viajes rinden menos que los primeros. Considerá cortar y retomar después del pico.',
    });
  }

  // POSITIVO: 100% puntería
  if (profitablePercent === 100 && trips.length >= 3) {
    positive.push({
      priority: 'positive',
      text: 'Venís invicto. Ni un solo viaje a pérdida hoy. Ese es el criterio del profesional.',
    });
  }

  // POSITIVO: Gran día
  if (totalMargin >= 10000) {
    positive.push({
      priority: 'positive',
      text: `${formatCurrency(totalMargin)} de ganancia neta. Día de esos que se festejan.`,
    });
  }

  // POSITIVO fallback
  if (positive.length === 0 && trips.length >= 1) {
    positive.push({
      priority: 'positive',
      text: 'Cada viaje que registrás es data para tomar mejores decisiones. Seguí así.',
    });
  }

  // Armar resultado: 1 critical + max 2 optimize + 1 positive
  return [
    ...critical.slice(0, 1),
    ...optimize.slice(0, 2),
    ...positive.slice(0, 1),
  ];
};

/**
 * Calcula las medallas (gamificación argenta)
 */
const calculateBadges = (
  trips: SavedTrip[],
  streak: number,
  profitablePercent: number,
  totalMargin: number,
  avgMargin: number,
): Badge[] => {
  const badges: Badge[] = [];

  if (trips.length >= 1)  badges.push({ id: 'first_trip',   name: 'Primer Laburo',  description: 'Arrancó el día',            icon: '🔑', color: 'sky',    unlockedNow: trips.length === 1 });
  if (trips.length >= 5)  badges.push({ id: 'productive',   name: 'Metiendo Pata',  description: '5 viajes adentro',          icon: '⚡', color: 'amber',  unlockedNow: trips.length === 5 });
  if (trips.length >= 10) badges.push({ id: 'marathon',     name: 'Remador',        description: '10 viajes (y contando)',     icon: '🚣', color: 'orange', unlockedNow: trips.length === 10 });
  if (trips.length >= 15) badges.push({ id: 'unstoppable',  name: 'Dueño del Asfalto', description: '15 viajes, sos una máquina', icon: '🚀', color: 'red',    unlockedNow: trips.length === 15 });

  if (profitablePercent === 100 && trips.length >= 3) badges.push({ id: 'perfect_day',  name: 'Cero Clavos',    description: 'Puros viajes rentables hoy', icon: '💎', color: 'purple', unlockedNow: true });
  if (streak >= 3) badges.push({ id: 'streak_3', name: 'Racha Picante', description: '3 al hilo en verde',      icon: '🔥', color: 'orange', unlockedNow: streak === 3 });
  if (streak >= 5) badges.push({ id: 'streak_5', name: 'Imparable',     description: '5 seguidos en positivo',  icon: '😤', color: 'red',    unlockedNow: streak === 5 });

  if (totalMargin >= 5000)  badges.push({ id: 'earner',     name: 'Para el Asado',  description: '$5.000 limpios en el bolsillo', icon: '🥩', color: 'green', unlockedNow: true });
  if (totalMargin >= 10000) badges.push({ id: 'big_earner', name: 'Caja Fuerte',    description: '$10.000 de ganancia neta',      icon: '💰', color: 'green', unlockedNow: true });
  if (totalMargin >= 20000) badges.push({ id: 'vault',      name: 'La Bóveda',      description: '$20.000 de ganancia ¡brutal!',  icon: '🏦', color: 'green', unlockedNow: true });

  if (avgMargin >= 1500 && trips.length >= 5)  badges.push({ id: 'high_roller', name: 'Fino y Elegante', description: 'Promedio >$1.500/viaje', icon: '🎩', color: 'amber',  unlockedNow: true });
  if (avgMargin >= 2000 && trips.length >= 5)  badges.push({ id: 'elite',       name: 'Limpia-Asfalto', description: 'Promedio >$2.000 (Nivel Dios)', icon: '👑', color: 'purple', unlockedNow: true });
  if (profitablePercent >= 90 && trips.length >= 5) badges.push({ id: 'sniper', name: 'Francotirador',  description: '90%+ de viajes rentables', icon: '🎯', color: 'sky',  unlockedNow: true });

  return badges;
};

const calculateLevel = (tripCount: number, totalMargin: number) => {
  const points = tripCount + Math.floor(totalMargin / 1000);
  const level = Math.max(1, Math.floor(points / 10) + 1);
  const pointsForNextLevel = level * 10;
  const pointsToNext = Math.max(0, pointsForNextLevel - points);
  return { level, points, pointsToNext };
};