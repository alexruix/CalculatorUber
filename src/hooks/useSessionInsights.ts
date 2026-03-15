import { useMemo } from 'react';
import type { SavedTrip, SessionInsights, Badge, ActionableTip, LossPattern } from '../types/calculator.types';
import { formatCurrency } from '../lib/utils';

// ──────────────────────────────────────────────────────────────
// TIPOS EXTENDIDOS V5
// ──────────────────────────────────────────────────────────────

export type TimeframeView = 'day' | 'week' | 'month';


export interface ExtendedSessionInsights extends SessionInsights {
  totalMargin: number;
  totalFare: number;
  eph: number;
  vsPrev?: { amount: number; pct: number; eph?: number; trips?: number };
  prioritizedTips: ActionableTip[];
  activeMinutes: number;
  tripCount: number;
  projections?: {
    realistic: number;
    optimistic: number;
    conservative: number;
    remToMeta: number;
    metaAchieved: boolean;
  };
  lossPatterns: LossPattern[];
  weekdayPerformance?: Array<{ day: string; margin: number; count: number; eph: number; isStar?: boolean; isLow?: boolean }>;
  benchmark?: { percentile: number; isAboveAvg: boolean; avgProfitablePercent: number };
  lastJourney: {
    totalMargin: number;
    totalFare: number;
    fuelCost: number;
    tolls: number;
    appFee: number;
    tripCount: number;
    eph: number;
    date: string;
    netPercentage: number;
  };
}

export const useSessionInsights = (
  trips: SavedTrip[], 
  dailyGoal: number = 20000,
  timeframe: TimeframeView = 'day'
): ExtendedSessionInsights => {
  return useMemo(() => {
    // 0. Performance Fix: Limitar historial a los últimos 60 días para cálculos ágiles
    const now = new Date();
    const limitDate = now.getTime() - (60 * 24 * 60 * 60 * 1000);
    const recentTrips = trips.filter(t => t.timestamp >= limitDate);
    
    // 1. Identificar Última Jornada (Datos 100% Reales, sin inventar comisiones)
    const sortedTrips = [...recentTrips].sort((a, b) => b.timestamp - a.timestamp);
    const lastJourneyDate = sortedTrips[0]?.date || '';
    const lastJourneyTrips = recentTrips.filter(t => t.date === lastJourneyDate);
    const totalFuelUsed = lastJourneyTrips.reduce((s, t) => s + (t.fuelCost || 0), 0);
    const ljMargin = lastJourneyTrips.reduce((s, t) => s + t.margin, 0);
    const ljFare = lastJourneyTrips.reduce((s, t) => s + t.fare, 0);
    const ljTolls = lastJourneyTrips.reduce((s, t) => s + (t.tolls || 0), 0);
    const ljActiveMins = lastJourneyTrips.reduce((s, t) => s + (t.duration || 0), 0);
        

    const lastJourney = {
      totalMargin: ljMargin,
      totalFare: ljFare,
      fuelCost: totalFuelUsed, 
      tolls: ljTolls,
      appFee: 0, // Lo dejamos en 0 ya que no lo pedimos al usuario
      tripCount: lastJourneyTrips.length,
      eph: ljActiveMins > 0 ? Math.round(ljMargin / (ljActiveMins / 60)) : 0,
      date: lastJourneyDate,
      netPercentage: ljFare > 0 ? Math.round((ljMargin / ljFare) * 100) : 0
    };

    const empty: ExtendedSessionInsights = {
      bestTrip: null, worstTrip: null, trend: 'stable', profitableTripsPercent: 0,
      avgMarginPerTrip: 0, profitableStreak: 0, tips: [], prioritizedTips: [],
      badges: [], driverLevel: 1, pointsToNextLevel: 10, totalPoints: 0, bestTimeOfDay: null,
      verticalPerformance: [], totalMargin: 0, totalFare: 0, eph: 0, activeMinutes: 0,
      tripCount: 0, lossPatterns: [], lastJourney
    };

    if (recentTrips.length === 0) return empty;

    // 2. Filtrar por Timeframe Actual y Periodo Anterior (para vsPrev)
    let currentTrips = recentTrips;
    let previousTrips: SavedTrip[] = [];
    let daysInPeriod = 1;

    const msPerDay = 24 * 60 * 60 * 1000;

    if (timeframe === 'day') {
      daysInPeriod = 1;
      currentTrips = lastJourneyTrips;
      // Periodo anterior = el día trabajado inmediatamente anterior
      const previousDate = sortedTrips.find(t => t.date !== lastJourneyDate)?.date;
      previousTrips = previousDate ? recentTrips.filter(t => t.date === previousDate) : [];
    
    } else if (timeframe === 'week') {
      daysInPeriod = 7;
      const oneWeekAgo = now.getTime() - (7 * msPerDay);
      const twoWeeksAgo = now.getTime() - (14 * msPerDay);
      currentTrips = recentTrips.filter(t => t.timestamp >= oneWeekAgo);
      previousTrips = recentTrips.filter(t => t.timestamp >= twoWeeksAgo && t.timestamp < oneWeekAgo);
    
    } else if (timeframe === 'month') {
      daysInPeriod = 30;
      const oneMonthAgo = now.getTime() - (30 * msPerDay);
      const twoMonthsAgo = now.getTime() - (60 * msPerDay);
      currentTrips = recentTrips.filter(t => t.timestamp >= oneMonthAgo);
      previousTrips = recentTrips.filter(t => t.timestamp >= twoMonthsAgo && t.timestamp < oneMonthAgo);
    }

    // 3. Cálculos Base del Periodo Actual
    const totalMargin = currentTrips.reduce((sum, t) => sum + t.margin, 0);
    const totalFare = currentTrips.reduce((sum, t) => sum + t.fare, 0);
    const activeMinutes = currentTrips.reduce((sum, t) => sum + (t.duration || 0), 0);
    const eph = activeMinutes > 0 ? Math.round(totalMargin / (activeMinutes / 60)) : 0;
    const avgMarginPerTrip = currentTrips.length > 0 ? Math.round(totalMargin / currentTrips.length) : 0;

    // 4. Comparativa Justa (vs Periodo Inmediato Anterior)
    const prevMargin = previousTrips.reduce((s, t) => s + t.margin, 0);
    const prevMins = previousTrips.reduce((s, t) => s + (t.duration || 0), 0);
    const prevEph = prevMins > 0 ? Math.round(prevMargin / (prevMins / 60)) : 0;

    const vsPrev = {
      amount: totalMargin - prevMargin,
      pct: prevMargin > 0 ? Math.round(((totalMargin - prevMargin) / prevMargin) * 100) : 0,
      eph: eph - prevEph,
      trips: currentTrips.length - previousTrips.length
    };

    // 5. Proyecciones Realistas (Predictivas)
    // Calcula cuántos días únicos trabajó en este periodo
    const uniqueDaysWorked = new Set(currentTrips.map(t => t.date)).size;
    const dailyAvgCurrent = totalMargin / Math.max(uniqueDaysWorked, 1);
    
    // Proyecta el promedio diario por la cantidad de días del periodo seleccionado
    const projectedTotal = dailyAvgCurrent * daysInPeriod;
    const goalMultiplier = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 1;
    const periodGoal = dailyGoal * goalMultiplier;

    const projections = {
      realistic: Math.round(projectedTotal),
      optimistic: Math.round(projectedTotal * 1.15),
      conservative: Math.round(projectedTotal * 0.85),
      remToMeta: Math.max(0, periodGoal - totalMargin),
      metaAchieved: totalMargin >= periodGoal
    };

    // 6. Patrones de Pérdida Dinámicos (Usando el promedio del usuario)
    const lossPatterns: LossPattern[] = [];
    const distanceThreshold = 15; // km
    const poorMarginThreshold = avgMarginPerTrip * 0.5; // Menos de la mitad de su promedio normal
    
    const longPoorTrips = currentTrips.filter(t => t.distance > distanceThreshold && t.margin < poorMarginThreshold);
    
    if (longPoorTrips.length > 0) {
      const avgLoss = Math.round(avgMarginPerTrip - (longPoorTrips.reduce((s, t) => s + t.margin, 0) / longPoorTrips.length));
      lossPatterns.push({
        id: 'dist-pattern',
        type: 'distance',
        label: `Viajes Largos (>${distanceThreshold}km) y mal pagos`,
        value: `>${distanceThreshold}km`,
        count: longPoorTrips.length,
        totalLoss: longPoorTrips.reduce((s, t) => s + Math.max(0, avgMarginPerTrip - t.margin), 0),
        avgLoss,
        saving: avgLoss * longPoorTrips.length,
        suggestedRule: `Rechazar >${distanceThreshold}km si neto es menor a ${formatCurrency(poorMarginThreshold)}`
      });
    }

    // 7. Tips Accionables Dinámicos
    const prioritizedTips = generatePrioritizedTipsV5(currentTrips, avgMarginPerTrip, vsPrev, longPoorTrips);

    const profitableTripsPercent = currentTrips.length > 0 
      ? Math.round((currentTrips.filter(t => t.margin > 0).length / currentTrips.length) * 100) 
      : 0;

    return {
      bestTrip: null, worstTrip: null, trend: calculateTrend(currentTrips),
      profitableTripsPercent, avgMarginPerTrip,
      profitableStreak: calculateProfitableStreak(currentTrips),
      tips: prioritizedTips.map(t => t.text),
      prioritizedTips,
      badges: calculateBadges(currentTrips, calculateProfitableStreak(currentTrips), profitableTripsPercent, totalMargin, avgMarginPerTrip),
      driverLevel: Math.floor(currentTrips.length / 10) + 1,
      pointsToNextLevel: 10 - (currentTrips.length % 10),
      totalPoints: currentTrips.length * 10,
      bestTimeOfDay: null,
      verticalPerformance: [], 
      totalMargin, totalFare, eph, activeMinutes,
      tripCount: currentTrips.length,
      vsPrev, projections, lossPatterns, lastJourney,
      benchmark: { 
        percentile: eph > 8000 ? 90 : eph > 5000 ? 70 : 40, // Dinámico según inflación/mercado
        isAboveAvg: eph > 5000, 
        avgProfitablePercent: 75 
      }
    };
  }, [trips, dailyGoal, timeframe]);
};

// ──────────────────────────────────────────────────────────────
// HELPERS PUROS Y DINÁMICOS
// ──────────────────────────────────────────────────────────────

const generatePrioritizedTipsV5 = (
  trips: SavedTrip[],
  avgMargin: number,
  vsPrev: any,
  longPoorTrips: SavedTrip[]
): ActionableTip[] => {
  const tips: ActionableTip[] = [];

  // Tip de pérdida (Critical) basado en data real
  if (longPoorTrips.length > 0) {
    const totalLost = longPoorTrips.reduce((s, t) => s + Math.max(0, avgMargin - t.margin), 0);
    tips.push({
      id: 'tip-dist',
      priority: 'critical',
      text: `Detectamos ${longPoorTrips.length} viajes largos que tiraron tu promedio abajo. Estás regalando kilómetros.`,
      lossData: {
        amount: totalLost,
        trips: longPoorTrips.length,
        avgLoss: Math.round(totalLost / longPoorTrips.length)
      },
      suggestedAction: `Evitar viajes largos por menos de ${formatCurrency(avgMargin * 0.5)}`,
      ruleId: 'rule-distance-limit'
    });
  }

  // Tip de mejora (Optimize) - Realista
  if (vsPrev.pct < -10) {
    tips.push({
      id: 'tip-optimization',
      priority: 'optimize',
      text: `Tu rentabilidad bajó un ${Math.abs(vsPrev.pct)}% vs el periodo anterior. Mantené la calma y ajustá tu filtro de viajes.`,
      suggestedAction: 'Subir estándar de tarifa mínima'
    });
  }

  // Tip positivo (Dinámico)
  const highMarginTrips = trips.filter(t => t.margin > avgMargin * 1.5);
  if (highMarginTrips.length >= 3) {
    tips.push({
      id: 'tip-positive',
      priority: 'positive',
      text: `¡Agarraste ${highMarginTrips.length} viajes excelentes hoy! Tenés muy buen ojo para las tarifas.`
    });
  }

  return tips.slice(0, 3);
};

const calculateTrend = (trips: SavedTrip[]): 'improving' | 'stable' | 'declining' => {
  if (trips.length < 4) return 'stable';
  const half = Math.floor(trips.length / 2);
  const firstHalf = trips.slice(0, half);
  const secondHalf = trips.slice(half);
  
  const firstAvg = firstHalf.reduce((sum, t) => sum + t.margin, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, t) => sum + t.margin, 0) / secondHalf.length;
  
  const improvement = ((secondAvg - firstAvg) / Math.abs(firstAvg || 1)) * 100;
  if (improvement > 15) return 'improving';
  if (improvement < -15) return 'declining';
  return 'stable';
};

const calculateProfitableStreak = (trips: SavedTrip[]): number => {
  let streak = 0;
  const sorted = [...trips].sort((a,b) => b.timestamp - a.timestamp);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].margin > 0) streak++;
    else break;
  }
  return streak;
};

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
  
  if (profitablePercent === 100 && trips.length >= 3) badges.push({ id: 'perfect_day',  name: 'Cero Clavos',    description: 'Puros viajes rentables', icon: '💎', color: 'purple', unlockedNow: true });
  if (streak >= 3) badges.push({ id: 'streak_3', name: 'Racha Picante', description: '3 al hilo en verde',      icon: '🔥', color: 'orange', unlockedNow: streak === 3 });
  
  if (totalMargin >= 10000) badges.push({ id: 'big_earner', name: 'Para el Asado',  description: '$10.000 limpios en el bolsillo',     icon: '🥩', color: 'green', unlockedNow: true });
  if (avgMargin >= 3000 && trips.length >= 3)  badges.push({ id: 'elite',       name: 'Fino y Elegante', description: 'Promedio alto por viaje', icon: '🎩', color: 'purple', unlockedNow: true });

  return badges;
};