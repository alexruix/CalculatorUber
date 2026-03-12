import React, { useState, useMemo, useCallback } from 'react';
import { AlertTriangle, RotateCcw } from '../../../../lib/icons';
import { useProfileStore } from '../../../../store/useProfileStore';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useProfitability } from '../../../../hooks/useProfitability';
import { calculateTimestamp, getTodayString } from '../../../../lib/journey';
import type { SavedTrip } from '../../../../types/calculator.types';
import { formatDateLatam } from '../../../../lib/utils';

// Componentes
import { ProfitabilityScore } from '../ProfitabilityScore';
import { TripInputForm } from '../TripInputForm';
import { MiniSummary } from '../../molecules/MiniSummary';
import { QuickStatsGrid } from '../../molecules/QuickStatsGrid';
// import { FloatingActionButton } from '../../atoms/FloatingActionButton';
import { DateOverrideModal } from '../DateOverrideModal';

export const TripsTab: React.FC = () => {
    const { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings, vertical } = useProfileStore();
    const {
        fare, distTrip, duration, startTime, tip, tolls,
        addTrip, resetInputs, sessionTrips // Traemos sessionTrips puro
    } = useCalculatorStore();

    const [showDateOverride, setShowDateOverride] = useState(false);
    const [overrideDate, setOverrideDate] = useState<string | undefined>(undefined);

    const durationHours = (parseFloat(duration) || 0) / 60;

    const metrics = useProfitability(
        { fare, distTrip, distPickup: '0', tip, tolls, activeTime: durationHours.toString() },
        vertical,
        { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings }
    );

    // ✅ FIX DE RENDIMIENTO: Memoizamos el filtrado localmente
    const tripsToday = useMemo(() => {
        const todayDate = getTodayString();
        return sessionTrips.filter(trip => trip.date === todayDate);
    }, [sessionTrips]);

    const totalMargin = useMemo(
        () => tripsToday.reduce((acc: number, t: SavedTrip) => acc + t.margin, 0),
        [tripsToday]
    );
    const tripCount = tripsToday.length;

    const totalEPH = useMemo(() => {
        const withTime = tripsToday.filter((t: SavedTrip) => (t.duration || 0) > 0);
        if (!withTime.length) return 0;
        const totalNet = withTime.reduce((acc: number, t: SavedTrip) => acc + t.margin, 0);
        const totalMins = withTime.reduce((acc: number, t: SavedTrip) => acc + (t.duration || 0), 0);
        const hours = totalMins / 60;
        return hours > 0 ? Math.round(totalNet / hours) : 0;
    }, [tripsToday]);

    const saveTrip = useCallback(() => {
        if (!metrics.isValid) return;

        const journeyDate = overrideDate ?? getTodayString();
        const timestamp = startTime
            ? calculateTimestamp(journeyDate, startTime)
            : Date.now();

        const newTrip: SavedTrip = {
            id: Date.now(),
            fare: parseFloat(fare),
            margin: metrics.netMargin,
            distance: parseFloat(distTrip) || 0,
            duration: parseFloat(duration) || 0,
            startTime: startTime || undefined,
            timestamp,
            vertical: vertical || undefined,
            tip: parseFloat(tip) || 0,
            tolls: parseFloat(tolls) || 0,
        };

        addTrip(newTrip);
        resetInputs();
        setOverrideDate(undefined);
    }, [metrics, fare, distTrip, duration, startTime, tip, tolls, vertical, overrideDate, addTrip, resetInputs]);

    const handleDateOverrideConfirm = (date: string) => {
        setOverrideDate(date);
        setShowDateOverride(false);
    };

    return (
        <div className="pb-32 space-y-5 animate-in fade-in duration-500">
            <div className="sticky top-0 z-20 bg-black/80 supports-backdrop-filter:backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5">
                <ProfitabilityScore metrics={metrics} />
            </div>

            <div className="space-y-5">
                {tripCount > 0 && (
                    <QuickStatsGrid trips={tripsToday} />
                )}

                {tripCount > 0 && (
                    <MiniSummary totalMargin={totalMargin} tripCount={tripCount} eph={totalEPH} />
                )}

                {metrics.wasHeavyTraffic && metrics.isValid && (
                    <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
                        <p className="text-xs text-starlight font-bold mb-0">
                            Tráfico pesado detectado <span className="text-accent">(velocidad prom &lt; 20 km/h)</span>. Consumo ajustado.
                        </p>
                    </div>
                )}

                

                <TripInputForm
                    onSave={saveTrip}
                    isValid={metrics.isValid}
                    onOpenDateOverride={() => setShowDateOverride(true)}
                    // Inyectamos el estado y la acción de limpieza
                    overrideDate={overrideDate}
                    onClearDateOverride={() => setOverrideDate(undefined)}
                />

                <button
                    type="button"
                    onClick={resetInputs}
                    className="w-full py-4 text-xs font-black text-white/20 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Limpiar Formulario
                </button>
            </div>



            <DateOverrideModal
                isOpen={showDateOverride}
                onCancel={() => setShowDateOverride(false)}
                onConfirm={handleDateOverrideConfirm}
            />
        </div>
    );
};