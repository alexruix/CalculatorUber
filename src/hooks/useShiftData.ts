import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { useProfileStore } from '../store/useProfileStore';
import { calculateProfitability } from '../lib/profitabilityLogic';

export const useShiftData = () => {
    const sessionTrips = useCalculatorStore(state => state.sessionTrips);
    const startingOdometer = useCalculatorStore(state => state.startingOdometer);
    const currentOdometer = useCalculatorStore(state => state.currentOdometer);
    const shiftClose = useCalculatorStore(state => state.shiftClose);

    const profile = useProfileStore(useShallow(state => ({
        kmPerLiter: state.kmPerLiter,
        maintPerKm: state.maintPerKm,
        fuelPrice: state.fuelPrice,
        amortizationPerKm: state.amortizationPerKm,
        expenseSettings: state.expenseSettings,
        vertical: state.vertical
    })));

    return useMemo(() => {
        // 1. Totales básicos
        let totalFare = 0;
        let totalProductiveKm = 0;
        let totalDuration = 0;
        let totalTip = 0;
        let totalTolls = 0;

        sessionTrips.forEach(t => {
            totalFare += t.fare;
            totalProductiveKm += t.distance;
            totalDuration += t.duration || 0;
            totalTip += t.tip || 0;
            totalTolls += t.tolls || 0;
        });

        // 2. Cálculos de Odómetro (Dead KM)
        const startOdo = parseFloat(startingOdometer) || 0;
        const currOdo = parseFloat(currentOdometer) || 0;
        
        // La distancia real recorrida es la diferencia de odómetro o, si no hay, la suma de viajes
        const realDist = (currOdo > startOdo) ? (currOdo - startOdo) : totalProductiveKm;

        // 3. Rentabilidad Unificada (Session Level)
        const metrics = calculateProfitability(
            {
                fare: totalFare.toString(),
                distTrip: totalProductiveKm.toString(),
                distPickup: '0',
                tip: totalTip.toString(),
                tolls: totalTolls.toString(),
                activeTime: (totalDuration / 60).toString(),
                totalDistanceOverride: realDist
            },
            profile.vertical,
            profile
        );

        // 4. Métricas de Eficiencia (Shift Metrics logic)
        let productivityRatio = 0;
        let totalShiftMinutes = 0;
        let idleMinutes = 0;

        if (shiftClose?.shiftStartTime) {
            const [startH, startM] = shiftClose.shiftStartTime.split(':').map(Number);
            const now = new Date();
            const endH = shiftClose.shiftEndTime ? parseInt(shiftClose.shiftEndTime.split(':')[0]) : now.getHours();
            const endM = shiftClose.shiftEndTime ? parseInt(shiftClose.shiftEndTime.split(':')[1]) : now.getMinutes();

            let totalMinsStart = startH * 60 + startM;
            let totalMinsEnd = endH * 60 + endM;
            
            if (totalMinsEnd < totalMinsStart) totalMinsEnd += 24 * 60;
            totalShiftMinutes = totalMinsEnd - totalMinsStart;

            if (totalShiftMinutes > 0) {
                productivityRatio = Math.min(100, (totalDuration / totalShiftMinutes) * 100);
                idleMinutes = Math.max(0, totalShiftMinutes - totalDuration);
            }
        }

        return {
            ...metrics,
            totalFare,
            totalProductiveKm,
            totalKmDriven: realDist,
            totalDuration,
            productivityRatio,
            totalShiftMinutes,
            idleMinutes,
            tripCount: sessionTrips.length
        };
    }, [sessionTrips, startingOdometer, currentOdometer, shiftClose, profile]);
};
