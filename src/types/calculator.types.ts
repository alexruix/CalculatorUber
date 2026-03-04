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
  waitTime?: string;
  tolls?: string;
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
  /** New segment fields */
  vertical?: VerticalType;
  tip?: number;
  waitTime?: number;
  tolls?: number;
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