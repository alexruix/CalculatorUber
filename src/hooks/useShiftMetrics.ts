import { useMemo } from 'react';
import type { SavedTrip, ShiftClose } from '../types/calculator.types';

export interface ShiftMetrics {
    totalFare: number;
    totalMargin: number;
    productiveMinutes: number;
    idleMinutes: number;
    totalShiftMinutes: number;
    productivityRatio: number; // 0 to 100
    eph: number;
    kmDriven: number;
    avgSpeedSession: number;
    hasExcessiveIdle: boolean;
    idlePercent: number;
}

export const useShiftMetrics = (trips: SavedTrip[], shiftClose: ShiftClose | null): ShiftMetrics => {
    return useMemo(() => {
        // Defaults
        let totalFare = 0;
        let totalMargin = 0;
        let productiveMinutes = 0;
        let totalKmFromTrips = 0;

        // Sum trips data
        trips.forEach(trip => {
            totalFare += trip.fare;
            totalMargin += trip.margin;
            productiveMinutes += trip.duration || 0;
            totalKmFromTrips += trip.distance || 0;
        });

        // Initialize shift metrics
        let totalShiftMinutes = 0;
        let idleMinutes = 0;
        let productivityRatio = 0;
        let idlePercent = 0;
        let hasExcessiveIdle = false;
        let kmDriven = 0;

        if (shiftClose?.shiftStartTime && shiftClose?.shiftEndTime) {
            const [startH, startM] = shiftClose.shiftStartTime.split(':').map(Number);
            const [endH, endM] = shiftClose.shiftEndTime.split(':').map(Number);

            let startTotalMins = startH * 60 + startM;
            let endTotalMins = endH * 60 + endM;

            // Handle midnight crossover
            if (endTotalMins < startTotalMins) {
                endTotalMins += 24 * 60;
            }

            totalShiftMinutes = endTotalMins - startTotalMins;

            idleMinutes = Math.max(0, totalShiftMinutes - productiveMinutes);
            
            if (totalShiftMinutes > 0) {
                productivityRatio = (productiveMinutes / totalShiftMinutes) * 100;
                // Guard: Ensure productivityRatio doesn't exceed 100%
                productivityRatio = Math.min(100, productivityRatio);
                
                idlePercent = (idleMinutes / totalShiftMinutes) * 100;
                idlePercent = Math.max(0, 100 - productivityRatio); // Sync with capped productivity
                hasExcessiveIdle = idlePercent > 40;
            }

            if (shiftClose.odometerStart !== undefined && shiftClose.odometerEnd !== undefined) {
                kmDriven = Math.max(0, shiftClose.odometerEnd - shiftClose.odometerStart);
            }
        } else {
            // Si no hay hora de cierre, tomamos el tiempo de los trips como el total conocido hasta ahora
            totalShiftMinutes = productiveMinutes;
            productivityRatio = productiveMinutes > 0 ? 100 : 0;
        }

        // Calculate EPH (Earnings Per Hour) using productive hours
        const productiveHours = productiveMinutes / 60;
        const eph = productiveHours > 0 ? totalMargin / productiveHours : 0;

        // Calculate average session speed
        const avgSpeedSession = productiveHours > 0 ? totalKmFromTrips / productiveHours : 0;

        // Apply extra expenses if any (subtract from totalMargin)
        if (shiftClose?.extraExpenses) {
            totalMargin -= shiftClose.extraExpenses;
        }

        return {
            totalFare,
            totalMargin,
            productiveMinutes,
            idleMinutes,
            totalShiftMinutes,
            productivityRatio,
            eph,
            kmDriven,
            avgSpeedSession,
            hasExcessiveIdle,
            idlePercent
        };
    }, [trips, shiftClose]);
};
