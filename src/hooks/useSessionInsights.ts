import { useMemo } from 'react';
import type { SavedTrip, SessionInsights, Badge } from '../types/calculator.types';

/**
 * Hook para calcular insights y gamificación de la sesión
 * Analiza todos los viajes y genera estadísticas, tips y badges
 */
export const useSessionInsights = (trips: SavedTrip[]): SessionInsights => {
  return useMemo(() => {
    // Si no hay viajes, retornar estado vacío
    if (trips.length === 0) {
      return {
        bestTrip: null,
        worstTrip: null,
        trend: 'stable',
        profitableTripsPercent: 0,
        avgMarginPerTrip: 0,
        bestTimeOfDay: null,
        profitableStreak: 0,
        tips: [],
        badges: [],
        driverLevel: 1,
      };
    }

    // === 1. IDENTIFICAR MEJOR Y PEOR VIAJE ===
    const bestTrip = trips.reduce((best, trip) => 
      trip.margin > best.margin ? trip : best
    );
    
    const worstTrip = trips.reduce((worst, trip) => 
      trip.margin < worst.margin ? trip : worst
    );

    // === 2. CALCULAR TENDENCIA ===
    const trend = calculateTrend(trips);

    // === 3. CALCULAR PORCENTAJE DE VIAJES RENTABLES ===
    const profitableTrips = trips.filter(t => t.margin > 0);
    const profitableTripsPercent = Math.round((profitableTrips.length / trips.length) * 100);

    // === 4. PROMEDIO DE GANANCIA ===
    const totalMargin = trips.reduce((sum, t) => sum + t.margin, 0);
    const avgMarginPerTrip = Math.round(totalMargin / trips.length);

    // === 5. MEJOR HORA DEL DÍA ===
    const bestTimeOfDay = findBestTimeOfDay(trips);

    // === 6. RACHA DE VIAJES RENTABLES ===
    const profitableStreak = calculateProfitableStreak(trips);

    // === 7. GENERAR TIPS ACCIONABLES ===
    const tips = generateTips(trips, profitableTripsPercent, avgMarginPerTrip);

    // === 8. CALCULAR BADGES ===
    const badges = calculateBadges(trips, profitableStreak, profitableTripsPercent);

    // === 9. CALCULAR NIVEL DEL CONDUCTOR ===
    const driverLevel = calculateDriverLevel(trips.length, totalMargin);

    return {
      bestTrip,
      worstTrip,
      trend,
      profitableTripsPercent,
      avgMarginPerTrip,
      bestTimeOfDay,
      profitableStreak,
      tips,
      badges,
      driverLevel,
    };
  }, [trips]);
};

/**
 * Calcula la tendencia de rentabilidad
 */
const calculateTrend = (trips: SavedTrip[]): 'improving' | 'stable' | 'declining' => {
  if (trips.length < 3) return 'stable';

  const half = Math.floor(trips.length / 2);
  const firstHalf = trips.slice(0, half);
  const secondHalf = trips.slice(half);

  const firstHalfAvg = firstHalf.reduce((sum, t) => sum + t.margin, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, t) => sum + t.margin, 0) / secondHalf.length;

  const improvement = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

  if (improvement > 10) return 'improving';
  if (improvement < -10) return 'declining';
  return 'stable';
};

/**
 * Encuentra la mejor hora del día (en ventanas de 2 horas)
 */
const findBestTimeOfDay = (trips: SavedTrip[]): string | null => {
  if (trips.length < 2) return null;

  // Agrupar por ventanas de 2 horas
  const timeWindows: Record<string, { total: number; count: number }> = {};

  trips.forEach(trip => {
    const date = new Date(trip.timestamp);
    const hour = date.getHours();
    const window = Math.floor(hour / 2) * 2; // 0-2, 2-4, 4-6, etc
    const windowKey = `${window}:00-${window + 2}:00`;

    if (!timeWindows[windowKey]) {
      timeWindows[windowKey] = { total: 0, count: 0 };
    }
    timeWindows[windowKey].total += trip.margin;
    timeWindows[windowKey].count += 1;
  });

  // Encontrar la ventana con mejor promedio
  let bestWindow = null;
  let bestAvg = -Infinity;

  Object.entries(timeWindows).forEach(([window, data]) => {
    const avg = data.total / data.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestWindow = window;
    }
  });

  return bestWindow;
};

/**
 * Calcula la racha actual de viajes rentables
 */
const calculateProfitableStreak = (trips: SavedTrip[]): number => {
  let streak = 0;
  
  // Contar desde el viaje más reciente (index 0)
  for (let i = 0; i < trips.length; i++) {
    if (trips[i].margin > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Genera tips accionables basados en el análisis
 */
const generateTips = (
  trips: SavedTrip[], 
  profitablePercent: number, 
  avgMargin: number
): string[] => {
  const tips: string[] = [];

  // Tip 1: Rentabilidad general
  if (profitablePercent < 70) {
    tips.push('Solo el ' + profitablePercent + '% de tus viajes fueron rentables. Intenta rechazar viajes con distancias largas hasta el pasajero.');
  } else if (profitablePercent === 100) {
    tips.push('¡Todos tus viajes fueron rentables! Sigue eligiendo viajes inteligentemente.');
  }

  // Tip 2: Ganancia promedio
  if (avgMargin < 800) {
    tips.push('Tu ganancia promedio es de $' + avgMargin + ' por viaje. Busca viajes con tarifas más altas o distancias más cortas.');
  } else if (avgMargin > 1500) {
    tips.push('Excelente ganancia promedio de $' + avgMargin + ' por viaje. ¡Así se hace!');
  }

  // Tip 3: Consistencia
  const margins = trips.map(t => t.margin);
  const maxMargin = Math.max(...margins);
  const minMargin = Math.min(...margins);
  const variance = maxMargin - minMargin;

  if (variance > 2000 && trips.length >= 3) {
    tips.push('Tus ganancias varían mucho ($' + minMargin + ' a $' + maxMargin + '). Intenta mantener criterios más consistentes.');
  }

  // Tip 4: Volumen
  if (trips.length >= 10) {
    tips.push('¡Gran volumen hoy! Hiciste ' + trips.length + ' viajes. Recuerda descansar para mantener la concentración.');
  }

  // Tip 5: Si no hay tips específicos, dar uno motivacional
  if (tips.length === 0) {
    tips.push('Sigue así, conductor. Cada viaje te acerca más a tus metas.');
  }

  return tips.slice(0, 3); // Máximo 3 tips
};

/**
 * Calcula badges ganados en esta sesión
 */
const calculateBadges = (
  trips: SavedTrip[], 
  streak: number, 
  profitablePercent: number
): Badge[] => {
  const badges: Badge[] = [];

  // Badge: Primera sesión
  if (trips.length >= 1) {
    badges.push({
      id: 'first_trip',
      name: 'Primera Vuelta',
      description: 'Completaste tu primer viaje',
      icon: '🚗',
      color: 'sky',
      unlockedNow: trips.length === 1,
    });
  }

  // Badge: 5 viajes en una sesión
  if (trips.length >= 5) {
    badges.push({
      id: 'productive_day',
      name: 'Día Productivo',
      description: '5+ viajes en una sesión',
      icon: '⚡',
      color: 'amber',
      unlockedNow: trips.length === 5,
    });
  }

  // Badge: 10 viajes en una sesión
  if (trips.length >= 10) {
    badges.push({
      id: 'marathon',
      name: 'Maratonista',
      description: '10+ viajes en una sesión',
      icon: '🏃',
      color: 'orange',
      unlockedNow: trips.length === 10,
    });
  }

  // Badge: 100% rentable
  if (profitablePercent === 100 && trips.length >= 3) {
    badges.push({
      id: 'perfect_day',
      name: 'Día Perfecto',
      description: 'Todos tus viajes fueron rentables',
      icon: '💎',
      color: 'purple',
      unlockedNow: true,
    });
  }

  // Badge: Racha de 5
  if (streak >= 5) {
    badges.push({
      id: 'hot_streak',
      name: 'En Racha',
      description: '5 viajes rentables consecutivos',
      icon: '🔥',
      color: 'red',
      unlockedNow: streak === 5,
    });
  }

  // Badge: Ganancia alta
  const totalMargin = trips.reduce((sum, t) => sum + t.margin, 0);
  if (totalMargin >= 10000) {
    badges.push({
      id: 'big_earner',
      name: 'Gran Ganador',
      description: '$10,000+ de ganancia neta',
      icon: '💰',
      color: 'green',
      unlockedNow: true,
    });
  }

  return badges;
};

/**
 * Calcula el nivel del conductor basado en viajes y ganancias
 */
const calculateDriverLevel = (tripCount: number, totalMargin: number): number => {
  // Sistema simple: 1 punto por viaje + 1 punto por cada $1000 de ganancia
  const points = tripCount + Math.floor(totalMargin / 1000);
  
  // Niveles cada 10 puntos
  return Math.max(1, Math.floor(points / 10) + 1);
};