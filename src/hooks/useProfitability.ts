import { useMemo } from 'react';
import type { TripMetrics, ExpenseToggle, TripDataInput, VerticalType } from '../types/calculator.types';

export const useProfitability = (
  tripData: TripDataInput,
  vertical: VerticalType | null,
  profile: {
    kmPerLiter: number;
    maintPerKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
  },
  isHeavyTraffic: boolean
): TripMetrics => {

  return useMemo(() => {
    // Parse inputs
    const f = parseFloat(tripData.fare) || 0;
    const dT = parseFloat(tripData.distTrip) || 0;
    const dP = parseFloat(tripData.distPickup) || 0;
    const tip = parseFloat(tripData.tip || '0') || 0;
    const tolls = parseFloat(tripData.tolls || '0') || 0;
    
    const totalDist = dT + dP;

    // Validación básica
    if (!f || !dT || !vertical) {
      return {
        isValid: false,
        totalCost: 0,
        netMargin: 0,
        profitPerKm: 0,
        roi: 0,
        status: 'neutral'
      };
    }

    const { kmPerLiter, maintPerKm, fuelPrice, expenseSettings } = profile;

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
    
    let netMargin = 0;
    let roiValue = 0;

    if (vertical === 'transport') {
      netMargin = f - totalCost;
      roiValue = totalCost > 0 ? netMargin / totalCost : 0;
    } else if (vertical === 'delivery') {
      netMargin = (f + tip) - totalCost;
      roiValue = totalCost > 0 ? netMargin / totalCost : 0;
    } else if (vertical === 'logistics') {
      netMargin = f - tolls - totalCost;
      roiValue = totalCost > 0 ? netMargin / totalCost : 0;
    }

    const profitPerKm = totalDist > 0 ? netMargin / totalDist : 0;

    // 🚀 LÓGICA DINÁMICA: Determinación del status basada en el Costo Operativo
    // Esto soluciona el Pain Point de vehículos pesados como la Hilux
    let status: TripMetrics['status'] = 'poor';

    if (netMargin > 0) {
      if (roiValue >= 1.8) {
        status = 'excellent'; // Ganas 1.8x veces más de lo que gastas
      } else if (roiValue >= 1) {
        status = 'fair'; // Margen aceptable sobre el gasto
      }
    }

    return {
      isValid: true,
      totalCost,
      netMargin: Math.round(netMargin),
      profitPerKm: Math.round(profitPerKm),
      roi: parseFloat(roiValue.toFixed(2)),
      status
    };
  }, [tripData, vertical, profile.kmPerLiter, profile.maintPerKm, profile.fuelPrice, profile.expenseSettings, isHeavyTraffic]);
};

