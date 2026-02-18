/**
 * NODO Calculator - Type Definitions
 * Interfaces y tipos para el sistema de cálculo de rentabilidad
 */

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
  /** Estado de rentabilidad basado en umbrales */
  status: 'excellent' | 'fair' | 'poor' | 'neutral';
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
 */
export interface ProfitabilityTheme {
  /** Clase de border de Tailwind */
  border: string;
  /** Clase de background de Tailwind */
  bg: string;
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