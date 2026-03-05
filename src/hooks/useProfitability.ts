import { useMemo } from 'react';
import type { TripMetrics, ExpenseToggle, TripDataInput, VerticalType } from '../types/calculator.types';

/**
 * Umbral de velocidad promedio para detectar tráfico pesado automáticamente.
 * Si el usuario manejó menos de 20 km/h en promedio durante el turno,
 * se considera tráfico pesado (ciudad congestionada).
 */
const HEAVY_TRAFFIC_SPEED_THRESHOLD_KMH = 20;

/**
 * Penalización de consumo en tráfico pesado (+25%: arranques/frenadas frecuentes).
 * Basado en estudios de consumo urbano vs. interurbano de la AAETA y CESVI Argentina.
 */
const HEAVY_TRAFFIC_CONSUMPTION_PENALTY = 0.75; // km/L se multiplica por este factor

export const useProfitability = (
  tripData: TripDataInput,
  vertical: VerticalType | null,
  profile: {
    kmPerLiter: number;
    maintPerKm: number;
    /** Amortización por KM: vehicleValue / vehicleLifetimeKm */
    amortizationPerKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
  }
): TripMetrics => {

  return useMemo(() => {
    // --- Parse inputs ---
    const f      = parseFloat(tripData.fare) || 0;
    const dT     = parseFloat(tripData.distTrip) || 0;
    const dP     = parseFloat(tripData.distPickup) || 0;
    const tip    = parseFloat(tripData.tip    || '0') || 0;
    const tolls  = parseFloat(tripData.tolls  || '0') || 0;
    const active = parseFloat(tripData.activeTime || '0') || 0; // horas en viaje

    const totalDist = dT + dP;

    // Validación básica
    if (!f || !dT || !vertical) {
      return {
        isValid: false,
        totalCost: 0,
        netMargin: 0,
        profitPerKm: 0,
        profitPerHour: 0,
        wasHeavyTraffic: false,
        roi: 0,
        status: 'neutral'
      };
    }

    const { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings } = profile;

    // --- Auto-detección de Tráfico Pesado ---
    // Velocidad promedio = distancia total / horas activas
    // Si < umbral → tráfico pesado. Si no hay datos de tiempo, asumimos tráfico normal.
    const avgSpeedKmH = active > 0 ? totalDist / active : 999;
    const wasHeavyTraffic = avgSpeedKmH < HEAVY_TRAFFIC_SPEED_THRESHOLD_KMH;

    // Ajuste del consumo según tráfico detectado
    const consumoActual = wasHeavyTraffic
      ? kmPerLiter * HEAVY_TRAFFIC_CONSUMPTION_PENALTY
      : kmPerLiter;

    // --- Cálculo de Costos ---
    const fuelCost = expenseSettings.find(e => e.id === 'fuel')?.enabled
      ? (consumoActual > 0 ? (totalDist / consumoActual) * fuelPrice : 0)
      : 0;

    const maintCost = expenseSettings.find(e => e.id === 'maintenance')?.enabled
      ? totalDist * maintPerKm
      : 0;

    // Amortización real: vehicleValue / vehicleLifetimeKm (independiente del mantenimiento)
    const amortizationCost = expenseSettings.find(e => e.id === 'amortization')?.enabled
      ? totalDist * amortizationPerKm
      : 0;

    const totalCost = fuelCost + maintCost + amortizationCost;

    // --- Cálculo de Margen por Vertical ---
    let netMargin = 0;
    let roiValue  = 0;

    if (vertical === 'transport') {
      netMargin = f - totalCost;
    } else if (vertical === 'delivery') {
      // Propina = ganancia limpia sin costo operativo adicional
      netMargin = (f + tip) - totalCost;
    } else if (vertical === 'logistics') {
      // Peajes = gasto deducible del ingreso
      netMargin = f - tolls - totalCost;
    }

    roiValue = totalCost > 0 ? netMargin / totalCost : 0;

    const profitPerKm   = totalDist > 0 ? netMargin / totalDist : 0;

    // --- EPH: Ganancia Por Hora (Earnings Per Hour) ---
    // Métrica única: cuántos pesos netos generó por cada hora que estuvo en viaje.
    // Se calcula solo si hay dato de horas activas (del resumen de Uber/Didi).
    const profitPerHour = active > 0 ? netMargin / active : 0;

    // --- Status dinámico basado en ROI vs costo operativo ---
    let status: TripMetrics['status'] = 'poor';

    if (netMargin < 0) {
      status = 'danger';
    } else if (netMargin > 0) {
      const currentRoi = totalCost > 0 ? netMargin / totalCost : 0;
      if (currentRoi >= 1.8) {
        status = 'excellent';
      } else if (currentRoi >= 1.0) {
        status = 'fair';
      } else {
        status = 'poor';
      }
    }

    return {
      isValid: true,
      totalCost,
      netMargin: Math.round(netMargin),
      profitPerKm: Math.round(profitPerKm),
      profitPerHour: Math.round(profitPerHour),
      wasHeavyTraffic,
      roi: parseFloat(roiValue.toFixed(2)),
      status
    };
  }, [tripData, vertical, profile.kmPerLiter, profile.maintPerKm, profile.amortizationPerKm, profile.fuelPrice, profile.expenseSettings]);
};
