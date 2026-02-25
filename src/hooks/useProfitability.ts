import { useMemo } from 'react';
import type { TripMetrics, ExpenseToggle } from '../types/calculator.types';

/**
 * Hook principal para cálculos de rentabilidad
 * Maneja toda la lógica de negocio del calculador
 * 
 * @param fare - Tarifa del viaje (string del input)
 * @param distTrip - Distancia del viaje en KM
 * @param distPickup - Distancia hasta el pasajero en KM
 * @param kmPerLiter - Eficiencia del vehículo (km/L)
 * @param maintPerKm - Costo de mantenimiento por KM
 * @param fuelPrice - Precio del combustible por litro
 * @param isHeavyTraffic - Si hay tráfico pesado (reduce eficiencia 20%)
 * @param expenseSettings - Configuración de gastos activos
 * @returns Métricas calculadas de rentabilidad
 * 
 * @example
 * const metrics = useProfitability('3500', '12', '2', 9, 10, 1600, false, expenseSettings);
 */
export const useProfitability = (
  fare: string,
  distTrip: string,
  distPickup: string,
  kmPerLiter: number,
  maintPerKm: number,
  fuelPrice: number,
  isHeavyTraffic: boolean,
  expenseSettings: ExpenseToggle[]
): TripMetrics => {

  return useMemo(() => {
    // Parse inputs
    const f = parseFloat(fare) || 0;
    const dT = parseFloat(distTrip) || 0;
    const dP = parseFloat(distPickup) || 0;
    const totalDist = dT + dP;

    // Validación básica
    if (!f || !dT) {
      return {
        isValid: false,
        totalCost: 0,
        netMargin: 0,
        profitPerKm: 0,
        roi: 0,
        status: 'neutral'
      };
    }

    // Ajuste de eficiencia según tráfico
    // En tráfico pesado, el consumo aumenta (eficiencia disminuye 20%)
    const consumoActual = isHeavyTraffic ? kmPerLiter * 0.8 : kmPerLiter;

    // Cálculo condicional de gastos según configuración del usuario
    const fuelCost = expenseSettings.find(e => e.id === 'fuel')?.enabled
      ? (totalDist / consumoActual) * fuelPrice
      : 0;

    const maintCost = expenseSettings.find(e => e.id === 'maintenance')?.enabled
      ? totalDist * maintPerKm
      : 0;

    const amortizationCost = expenseSettings.find(e => e.id === 'amortization')?.enabled
      ? totalDist * (maintPerKm * 0.5) // Estimación: 50% del costo de mantenimiento
      : 0;

    // Cálculos finales
    const totalCost = fuelCost + maintCost + amortizationCost;
    const netMargin = f - totalCost;
    const profitPerKm = totalDist > 0 ? netMargin / totalDist : 0;

    // Si el ROI es 1.5, significa que por cada $1 gastado, ganaste $1.50 de ganancia limpia.
    const roi = totalCost > 0 ? netMargin / totalCost : 0;

    // 🚀 LÓGICA DINÁMICA: Determinación del status basada en el Costo Operativo
    // Esto soluciona el Pain Point de vehículos pesados como la Hilux
    let status: TripMetrics['status'] = 'poor';

    if (netMargin > 0) {
      // Calculamos la relación Beneficio/Costo (ROI)
      const roi = netMargin / totalCost;

      if (roi >= 1.8) {
        status = 'excellent'; // Ganas 1.8x veces más de lo que gastas
      } else if (roi >= 1) {
        status = 'fair'; // Margen aceptable sobre el gasto
      }
    }

    return {
      isValid: true,
      totalCost,
      netMargin: Math.round(netMargin),
      profitPerKm: Math.round(profitPerKm),
      roi: parseFloat(roi.toFixed(2)),
      status
    };
  }, [fare, distTrip, distPickup, kmPerLiter, maintPerKm, fuelPrice, isHeavyTraffic, expenseSettings]);
};

