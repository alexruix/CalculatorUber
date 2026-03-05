import type { TripDataInput, VerticalType, ExpenseToggle, TripMetrics } from '../types/calculator.types';

const HEAVY_TRAFFIC_SPEED_THRESHOLD_KMH = 20;
const HEAVY_TRAFFIC_CONSUMPTION_PENALTY = 0.75;

export const calculateProfitability = (
  tripData: TripDataInput & { totalDistanceOverride?: number },
  vertical: VerticalType | null,
  profile: {
    kmPerLiter: number;
    maintPerKm: number;
    amortizationPerKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
  }
): TripMetrics => {
    // --- Parse inputs ---
    const f      = parseFloat(tripData.fare) || 0;
    const dT     = parseFloat(tripData.distTrip) || 0;
    const dP     = parseFloat(tripData.distPickup) || 0;
    const tip    = parseFloat(tripData.tip    || '0') || 0;
    const tolls  = parseFloat(tripData.tolls  || '0') || 0;
    const active = parseFloat(tripData.activeTime || '0') || 0; // horas en viaje

    const productiveDist = dT + dP;
    const realDist = tripData.totalDistanceOverride || productiveDist;
    const deadKm = Math.max(0, realDist - productiveDist);

    // Validación básica
    if (!f || (!dT && !tripData.totalDistanceOverride) || !vertical) {
      return {
        isValid: false,
        totalCost: 0,
        netMargin: 0,
        profitPerKm: 0,
        profitPerHour: 0,
        wasHeavyTraffic: false,
        roi: 0,
        status: 'neutral',
        deadKm: 0
      };
    }

    const { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings } = profile;

    const avgSpeedKmH = active > 0 ? realDist / active : 999;
    const wasHeavyTraffic = avgSpeedKmH < HEAVY_TRAFFIC_SPEED_THRESHOLD_KMH;

    const consumoActual = (kmPerLiter > 0 && wasHeavyTraffic)
      ? kmPerLiter * HEAVY_TRAFFIC_CONSUMPTION_PENALTY
      : kmPerLiter;

    const expenses = Array.isArray(expenseSettings) ? expenseSettings : [];

    const fuelCost = expenses.find(e => e.id === 'fuel')?.enabled
      ? (consumoActual > 0 ? (realDist / consumoActual) * fuelPrice : 0)
      : 0;

    const maintCost = expenses.find(e => e.id === 'maintenance')?.enabled
      ? realDist * maintPerKm
      : 0;

    const amortizationCost = expenses.find(e => e.id === 'amortization')?.enabled
      ? realDist * amortizationPerKm
      : 0;

    const totalCost = fuelCost + maintCost + amortizationCost;

    let netMargin = 0;
    let roiValue  = 0;

    if (vertical === 'transport') {
      netMargin = f - totalCost;
    } else if (vertical === 'delivery') {
      netMargin = (f + tip) - totalCost;
    } else if (vertical === 'logistics') {
      netMargin = f - tolls - totalCost;
    }

    roiValue = totalCost > 0 ? netMargin / totalCost : 0;
    const profitPerKm = productiveDist > 0 ? netMargin / productiveDist : 0;
    const realProfitPerKm = realDist > 0 ? netMargin / realDist : 0;
    const profitPerHour = active > 0 ? netMargin / active : 0;

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
      totalCost: Math.round(totalCost),
      netMargin: Math.round(netMargin),
      profitPerKm: Math.round(profitPerKm),
      realProfitPerKm: Math.round(realProfitPerKm),
      profitPerHour: Math.round(profitPerHour),
      wasHeavyTraffic,
      roi: parseFloat(roiValue.toFixed(2)),
      status,
      deadKm: Math.round(deadKm)
    };
};
