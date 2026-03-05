import { useMemo } from 'react';
import type { TripMetrics, ExpenseToggle, TripDataInput, VerticalType } from '../types/calculator.types';
import { calculateProfitability } from '../lib/profitabilityLogic';

export const useProfitability = (
  tripData: TripDataInput & { totalDistanceOverride?: number },
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
    return calculateProfitability(tripData, vertical, profile);
  }, [tripData, vertical, profile.kmPerLiter, profile.maintPerKm, profile.amortizationPerKm, profile.fuelPrice, profile.expenseSettings]);
};
