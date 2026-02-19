import { useMemo } from 'react';
import type { SavedTrip, SessionInsights, Badge } from '../types/calculator.types';

/**
 * Hook para calcular la data y las chapas (badges) de la sesión.
 * Transforma los números fríos en consejos de colega.
 */
export const useSessionInsights = (trips: SavedTrip[]): SessionInsights => {
  return useMemo(() => {
    // Si no hay viajes, devolvemos el garage vacío
    if (trips.length === 0) {
      return {
        bestTrip: null,
        worstTrip: null,
        trend: 'stable',
        profitableTripsPercent: 0,
        avgMarginPerTrip: 0,
        profitableStreak: 0,
        tips: [],
        badges: [],
        driverLevel: 1,
        pointsToNextLevel: 10,
        totalPoints: 0,
      };
    }

    // === 1. IDENTIFICAR LA JOYITA Y EL CLAVO DEL DÍA ===
    const bestTrip = trips.reduce((best, trip) => 
      trip.margin > best.margin ? trip : best
    );
    
    const worstTrip = trips.reduce((worst, trip) => 
      trip.margin < worst.margin ? trip : worst
    );

    // === 2. ¿CÓMO VIENE LA MANO? (TENDENCIA) ===
    const trend = calculateTrend(trips);

    // === 3. PUNTERÍA (PORCENTAJE DE VIAJES QUE SIRVEN) ===
    const profitableTrips = trips.filter(t => t.margin > 0);
    const profitableTripsPercent = Math.round((profitableTrips.length / trips.length) * 100);

    // === 4. PROMEDIO DE GUITA LIMPIA ===
    const totalMargin = trips.reduce((sum, t) => sum + t.margin, 0);
    const avgMarginPerTrip = Math.round(totalMargin / trips.length);

    // === 5. SEGUIDILLA DE BUENAS RENTABILIDADES ===
    const profitableStreak = calculateProfitableStreak(trips);

    // === 6. LOS CONSEJOS DEL VIEJO LOBO (TIPS) ===
    const tips = generateTips(trips, profitableTripsPercent, avgMarginPerTrip, bestTrip, worstTrip);

    // === 7. LAS CHAPAS (BADGES) ===
    const badges = calculateBadges(trips, profitableStreak, profitableTripsPercent, totalMargin, avgMarginPerTrip);

    // === 8. EL RANGO DE CALLE (NIVEL) ===
    const { level, points, pointsToNext } = calculateLevel(trips.length, totalMargin);

    return {
      bestTrip,
      worstTrip,
      trend,
      profitableTripsPercent,
      avgMarginPerTrip,
      profitableStreak,
      tips,
      badges,
      driverLevel: level,
      pointsToNextLevel: pointsToNext,
      totalPoints: points,
    };
  }, [trips]);
};

/**
 * Calcula si la jornada viene repuntando o cayendo
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
 * Cuenta cuántos viajes buenos metiste al hilo
 */
const calculateProfitableStreak = (trips: SavedTrip[]): number => {
  let streak = 0;
  // Contamos desde el último viaje hacia atrás
  // (Asumiendo que trips[0] es el más reciente, si no, invertir lógica)
  // Nota: Ajustar según cómo ordenes el array en tu estado global.
  // Aquí asumo que iteramos sobre todos y cortamos cuando uno no es rentable.
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
 * Genera los consejos con voz de "Manguito"
 */
const generateTips = (
  trips: SavedTrip[], 
  profitablePercent: number, 
  avgMargin: number,
  bestTrip: SavedTrip,
  worstTrip: SavedTrip
): string[] => {
  const tips: string[] = [];

  // Analizar patrones
  const avgFare = trips.reduce((sum, t) => sum + t.fare, 0) / trips.length;
  const highMarginTrips = trips.filter(t => t.margin > avgMargin);
  const avgFareOfGoodTrips = highMarginTrips.length > 0 
    ? highMarginTrips.reduce((sum, t) => sum + t.fare, 0) / highMarginTrips.length 
    : avgFare;

  // Tip 1: Piso de tarifa
  if (avgMargin < 1000) {
    const minRecommended = Math.round(avgFareOfGoodTrips * 0.9);
    tips.push(`No regales el laburo. Tratá de no agarrar viajes de menos de $${minRecommended.toLocaleString('es-AR')}. Ahí es donde perdés plata.`);
  }

  // Tip 2: Replicar el éxito
  if (bestTrip && trips.length >= 3) {
    const bestFare = bestTrip.fare;
    tips.push(`¡Esa es la actitud! Tu mejor vuelta dejó buena guita ($${bestTrip.margin.toLocaleString('es-AR')} limpios). Buscá más viajes como ese.`);
  }

  // Tip 3: Alerta de clavos
  const lowMarginTrips = trips.filter(t => t.margin < avgMargin * 0.5);
  if (lowMarginTrips.length > trips.length * 0.3) {
    tips.push(`Ojo al piojo: El ${Math.round((lowMarginTrips.length / trips.length) * 100)}% de tus viajes son "clavos" (tarifas bajas, mucho gasto). Aprendé a decir que no.`);
  }

  // Tip 4: Consistencia
  if (profitablePercent === 100 && trips.length >= 3) {
    tips.push(`Venís invicto. Ni un solo viaje a pérdida hoy. Mantené ese criterio que el auto te lo agradece.`);
  }

  // Tip 5: Ratio ganancia/tarifa (Eficiencia pura)
  const bestRatio = bestTrip ? (bestTrip.margin / bestTrip.fare) * 100 : 0;
  if (bestRatio > 40 && trips.length >= 3) {
    tips.push(`Cazaste un viaje corto y caro: el sueño del pibe. Te quedó el ${Math.round(bestRatio)}% de la tarifa en el bolsillo. ¡Esos son los que valen!`);
  }

  // Fallback si no hay nada específico
  if (tips.length === 0) {
    tips.push(`El secreto es la selección. No te desesperes por agarrar todo; agarrá lo que rinde.`);
  }

  return tips.slice(0, 3); // Máximo 3 tips
};

/**
 * Calcula las medallas (Gamificación argenta)
 */
const calculateBadges = (
  trips: SavedTrip[], 
  streak: number, 
  profitablePercent: number,
  totalMargin: number,
  avgMargin: number
): Badge[] => {
  const badges: Badge[] = [];

  // --- CANTIDAD DE VIAJES ---
  if (trips.length >= 1) {
    badges.push({
      id: 'first_trip',
      name: 'Primer Laburo',
      description: 'Arrancó el día',
      icon: '🔑',
      color: 'sky',
      unlockedNow: trips.length === 1,
    });
  }

  if (trips.length >= 5) {
    badges.push({
      id: 'productive_day',
      name: 'Metiendo Pata',
      description: '5 viajes adentro',
      icon: '⚡',
      color: 'amber',
      unlockedNow: trips.length === 5,
    });
  }

  if (trips.length >= 10) {
    badges.push({
      id: 'marathon',
      name: 'Remador',
      description: '10 viajes (y contando)',
      icon: '🚣',
      color: 'orange',
      unlockedNow: trips.length === 10,
    });
  }

  if (trips.length >= 15) {
    badges.push({
      id: 'unstoppable',
      name: 'Dueño de la Calle',
      description: '¡15 viajes! Sos una máquina',
      icon: '🚀',
      color: 'red',
      unlockedNow: trips.length === 15,
    });
  }

  // --- CALIDAD ---
  if (profitablePercent === 100 && trips.length >= 3) {
    badges.push({
      id: 'perfect_day',
      name: 'Cero Clavos',
      description: 'Puros viajes rentables hoy',
      icon: '💎',
      color: 'purple',
      unlockedNow: true, // Se mantiene si sigue perfecto
    });
  }

  // --- RACHAS ---
  if (streak >= 3) {
    badges.push({
      id: 'on_fire',
      name: 'Racha Picante',
      description: '3 al hilo sumando fuerte',
      icon: '🔥',
      color: 'orange',
      unlockedNow: streak === 3,
    });
  }

  if (streak >= 5) {
    badges.push({
      id: 'hot_streak',
      name: 'Imparable',
      description: '5 seguidos en verde',
      icon: '😤',
      color: 'red',
      unlockedNow: streak === 5,
    });
  }

  // --- DINERO EN MANO ---
  if (totalMargin >= 5000) {
    badges.push({
      id: 'earner',
      name: 'Para el Asado',
      description: '$5.000 limpios en el bolsillo',
      icon: '🥩',
      color: 'green',
      unlockedNow: true,
    });
  }

  if (totalMargin >= 10000) {
    badges.push({
      id: 'big_earner',
      name: 'Caja Fuerte',
      description: 'Pasaste las 10 lucas hoy',
      icon: '💰',
      color: 'green',
      unlockedNow: true,
    });
  }

  if (totalMargin >= 20000) {
    badges.push({
      id: 'money_maker',
      name: 'La Bóveda',
      description: '¡$20.000 de ganancia neta!',
      icon: '🏦',
      color: 'green',
      unlockedNow: true,
    });
  }

  // --- PROMEDIOS ---
  if (avgMargin >= 1500 && trips.length >= 5) {
    badges.push({
      id: 'high_roller',
      name: 'Fino y Elegante',
      description: 'Promedio >$1.500 por viaje',
      icon: '🎩',
      color: 'amber',
      unlockedNow: true,
    });
  }

  if (avgMargin >= 2000 && trips.length >= 5) {
    badges.push({
      id: 'elite',
      name: 'Limpia-Asfalto',
      description: 'Promedio >$2.000 (Nivel Dios)',
      icon: '👑',
      color: 'purple',
      unlockedNow: true,
    });
  }

  if (profitablePercent >= 90 && trips.length >= 5) {
    badges.push({
      id: 'efficient',
      name: 'Francotirador',
      description: 'No errás casi nunca (90%+)',
      icon: '🎯',
      color: 'sky',
      unlockedNow: true,
    });
  }

  return badges;
};

/**
 * Calcula nivel y puntos de calle
 */
const calculateLevel = (tripCount: number, totalMargin: number) => {
  // Sistema: 1 punto por viaje + 1 punto por cada $1000 de ganancia
  // Esto premia tanto el esfuerzo (cantidad) como la inteligencia (calidad)
  const points = tripCount + Math.floor(totalMargin / 1000);
  
  // Niveles cada 10 puntos
  const level = Math.max(1, Math.floor(points / 10) + 1);
  
  // Puntos para el próximo escalón
  const pointsForNextLevel = level * 10;
  const pointsToNext = pointsForNextLevel - points;

  return {
    level,
    points,
    pointsToNext: Math.max(0, pointsToNext)
  };
};