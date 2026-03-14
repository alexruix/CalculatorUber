import React, { useState, useMemo, useCallback } from 'react';
import { AlertTriangle, RotateCcw } from '../../../../lib/icons';
import { useProfileStore } from '../../../../store/useProfileStore';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useProfitability } from '../../../../hooks/useProfitability';
import { calculateTimestamp, getTodayString, getJourneyDate } from '../../../../lib/journey';
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
    
    const journeyDate = overrideDate ?? getTodayString();
    // ✅ FIX DE RENDIMIENTO: Memoizamos el filtrado localmente
    const tripsToday = useMemo(() => {
    const todayDate = getTodayString();
    return sessionTrips.filter(trip => {
        // Si el viaje no tiene fecha grabada (legacy), la calculamos al vuelo
        const tripJourneyDate = trip.date ?? getJourneyDate(trip.timestamp);
        return tripJourneyDate === todayDate;
    });
}, [sessionTrips]);

    const totalMargin = useMemo(
        () => tripsToday.reduce((acc: number, t: SavedTrip) => acc + t.margin, 0),
        [tripsToday]
    );
    const tripCount = tripsToday.length;

    const totalMinsToday = useMemo(() => {
        return tripsToday.reduce((acc: number, t: SavedTrip) => acc + (t.duration || 0), 0);
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
            date: journeyDate,
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
            {/* 1. HUD DE RENTABILIDAD (Sticky & Compact) */}
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md -mx-4 px-4 py-3 border-b border-white/5">
                <ProfitabilityScore metrics={metrics} />
            </div>

            <div className="space-y-5">
                {/* 2. RESUMEN DE HOY (Unificado y más compacto) */}
                {tripCount > 0 && (
                    <div className="space-y-3 px-1 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-1">
                            {/* <Activity className="w-3 h-3 text-white/20" /> */}
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Tu jornada hoy</span>
                        </div>
                        {/* Consolidamos los dos en un grupo visual */}
                        <div className="glass-card p-4 rounded-3xl border border-white/5 bg-white/2 space-y-4">
                            {/* <QuickStatsGrid trips={tripsToday} compact /> */}
                            <MiniSummary totalMargin={totalMargin} tripCount={tripCount} activeMinutes={totalMinsToday} compact />
                            {/* <div className="h-px bg-white/5 w-full" /> */}
                        </div>
                    </div>
                )}

                {/* 3. ALERTAS CRÍTICAS */}
                {metrics.wasHeavyTraffic && metrics.isValid && (
                    <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3 mx-1">
                        <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
                        <p className="text-[11px] text-starlight font-bold mb-0 leading-tight">
                            Tráfico pesado detectado. Consumo ajustado automáticamente.
                        </p>
                    </div>
                )}

                {/* 4. EL FORMULARIO (Ahora respira más) */}
                <TripInputForm
                    onSave={saveTrip}
                    isValid={metrics.isValid}
                    onOpenDateOverride={() => setShowDateOverride(true)}
                    overrideDate={overrideDate}
                    onClearDateOverride={() => setOverrideDate(undefined)}
                />

                <button
                    type="button"
                    onClick={resetInputs}
                    className="w-full py-4 text-xs font-black text-white/20 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Limpiar formulario
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


