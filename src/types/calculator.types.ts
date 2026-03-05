/**
 * Manejate - Type Definitions
 * Interfaces y tipos para el sistema de cálculo de rentabilidad
 */

/**
 * Vertical settings
 */
export type VerticalType = 'transport' | 'delivery' | 'logistics';

export interface TripDataInput {
  fare: string;
  distTrip: string;
  distPickup: string;
  tip?: string;
  tolls?: string;
  /** Horas en viaje (activo). Derivado de los datos del resumen de la app. */
  activeTime?: string;
}

/**
 * Métricas calculadas de rentabilidad de un viaje
 */
export interface TripMetrics {
  /** Indica si los datos ingresados son válidos para cálculo */
  isValid: boolean;
  /** Costo total del viaje (combustible + mantenimiento + amortización) */
  totalCost: number;
  /** Ganancia neta (tarifa - costo total) */
  netMargin: number;
  /** Ganancia por kilómetro recorrido */
  profitPerKm: number;
  /** Ganancia Por Hora — EPH (Eficiencia de la jornada) */
  profitPerHour: number;
  /** Si el tráfico fue detectado como pesado automáticamente */
  wasHeavyTraffic: boolean;
  roi: number;
  /** Estado de rentabilidad basado en umbrales */
  status: 'excellent' | 'fair' | 'poor' | 'danger' | 'neutral';
}

/**
 * Viaje guardado en la sesión del día
 */
export interface SavedTrip {
  /** ID único del viaje (timestamp) */
  id: number;
  /** Tarifa cobrada por el viaje */
  fare: number;
  /** Margen de ganancia neta */
  margin: number;
  /** Timestamp de cuando se guardó el viaje */
  timestamp: number;
  distance: number;
  duration: number;
  vertical?: VerticalType;
  tip?: number;
  tolls?: number;
  activeTime?: number;
  
  // Nuevos campos de Arquitectura V2
  /** Velocidad promedio del viaje (km/h). 0 si no hay datos suficientes. */
  avgSpeed?: number;
  /** "HH:MM" — hora de inicio del viaje (opcional) */
  startTime?: string;
  /** minutos de espera desde el fin del viaje anterior */
  waitMinutes?: number;
}

/**
 * Cierre de Jornada (Shift Close)
 */
export interface ShiftClose {
  /** "HH:MM" — hora de inicio de todo el turno */
  shiftStartTime: string;
  /** "HH:MM" — hora de fin del turno */
  shiftEndTime: string;
  /** Km del odómetro al iniciar (opcional) */
  odometerStart?: number;
  /** Km del odómetro al terminar (opcional) */
  odometerEnd?: number;
  /** Gastos extras de la jornada (comida, peajes, etc.) */
  extraExpenses?: number;
}

/**
 * Configuración de toggle para tipos de gastos
 */
export interface ExpenseToggle {
  /** Identificador único del gasto */
  id: string;
  /** Etiqueta mostrada al usuario */
  label: string;
  /** Estado de activación del gasto */
  enabled: boolean;
}

/**
 * Tema visual para el componente de score
 * card = clase DS score-card-* (incluye border + background)
 */
export interface ProfitabilityTheme {
  /** Clase combinada de borde+fondo del Design System (score-card-*) */
  card: string;
  /** Clase de text color de Tailwind */
  text: string;
  /** Etiqueta mostrada al usuario */
  label: string;
}

export interface Trip {
  id: string;
  fare: number;
  distance: number;
  duration: number;
  pickupDistance: number;
  deadheadDistance: number; // 👈 Nuevo: KM desde el viaje anterior hasta este
  platform: 'Uber' | 'Didi' | 'Cabify' | 'Particular'; // 👈 Nuevo
  metrics: {
    netMargin: number;
    profitPerKm: number;
    profitPerHour: number; // 👈 Nuevo: Ganancia real por hora de trabajo
    efficiencyRatio: number; // 👈 Nuevo: % de KM facturados
  }
}


/**
 * Análisis de sesión con insights y gamificación
 */
export interface SessionInsights {
  /** Mejor viaje del día */
  bestTrip: SavedTrip | null;
  /** Peor viaje del día */
  worstTrip: SavedTrip | null;
  /** Tendencia: mejorando, estable, empeorando */
  trend: 'improving' | 'stable' | 'declining';
  /** Porcentaje de viajes rentables (margin > 0) */
  profitableTripsPercent: number;
  /** Promedio de ganancia por viaje */
  avgMarginPerTrip: number;
  /** Hora con mejor rentabilidad */
  bestTimeOfDay: string | null;
  /** Racha de viajes rentables consecutivos */
  profitableStreak: number;
  /** Tips accionables para mejorar */
  tips: string[];
  /** Badges ganados en esta sesión */
  badges: Badge[];
  /** Nivel del conductor */
  driverLevel: number;
  pointsToNextLevel: number;
  totalPoints: number;
}


/**
 * Badge/logro ganado por el usuario
 */
export interface Badge {
  /** ID único del badge */
  id: string;
  /** Nombre del logro */
  name: string;
  /** Descripción */
  description: string;
  /** Icono emoji */
  icon: string;
  /** Color del badge */
  color: string;
  /** Si fue desbloqueado en esta sesión */
  unlockedNow: boolean;
}