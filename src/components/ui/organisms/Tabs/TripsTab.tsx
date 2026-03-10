import React, { useMemo } from 'react';
import { AlertTriangle, RotateCcw } from '../../../../lib/icons';
import { useProfileStore } from '../../../../store/useProfileStore';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useProfitability } from '../../../../hooks/useProfitability';
import type { SavedTrip } from '../../../../types/calculator.types';

// Componentes
import { ProfitabilityScore } from '../ProfitabilityScore';
import { TripInputForm } from '../TripInputForm';
import { MiniSummary } from '../../molecules/MiniSummary';

export const TripsTab: React.FC = () => {
    const { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings, vertical } = useProfileStore();
    const {
        fare, distTrip, duration, startTime, tip, tolls,
        sessionTrips, addTrip, resetInputs
    } = useCalculatorStore();

    // Convertimos duration (minutos) a horas para la lógica interna de rentabilidad (preview)
    const durationHours = (parseFloat(duration) || 0) / 60;

    const metrics = useProfitability(
        { fare, distTrip, distPickup: '0', tip, tolls, activeTime: durationHours.toString() },
        vertical,
        { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings }
    );

    // Filtramos los viajes para mostrar en el MiniSummary SÓLO los de hoy
    const tripsToday = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        return sessionTrips.filter(t => t.timestamp >= startOfToday);
    }, [sessionTrips]);

    const totalMargin = useMemo(() => tripsToday.reduce((acc, t) => acc + t.margin, 0), [tripsToday]);
    const tripCount = tripsToday.length;

    // Calculamos el EPH de hoy
    const totalEPH = useMemo(() => {
        const withTime = tripsToday.filter(t => (t.duration || 0) > 0);
        if (!withTime.length) return 0;
        const totalNet = withTime.reduce((acc, t) => acc + t.margin, 0);
        const totalMins = withTime.reduce((acc, t) => acc + (t.duration || 0), 0);
        const hours = totalMins / 60;
        return hours > 0 ? Math.round(totalNet / hours) : 0;
    }, [tripsToday]);

    const saveTrip = () => {
        if (!metrics.isValid) return;
        const newTrip: SavedTrip = {
            id: Date.now(),
            fare: parseFloat(fare),
            margin: metrics.netMargin,
            distance: parseFloat(distTrip) || 0,
            duration: parseFloat(duration) || 0, // se guarda en minutos
            startTime: startTime || undefined,
            timestamp: Date.now(),
            vertical: vertical || undefined,
            tip: parseFloat(tip) || 0,
            tolls: parseFloat(tolls) || 0,
        };
        addTrip(newTrip);
        resetInputs();
    };

    return (
        <div className="pb-32 space-y-5 animate-in fade-in duration-500">
            {/* 1. Score de Rentabilidad (Preview) */}
            <div className="sticky top-0 z-20 bg-black/80 supports-backdrop-filter:backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5">
                <ProfitabilityScore metrics={metrics} />
            </div>

            <div className="space-y-6">
                {/* 2. Resumen acumulado de turnos de HOY */}
                {tripCount > 0 && (
                    <MiniSummary totalMargin={totalMargin} tripCount={tripCount} eph={totalEPH} />
                )}

                {/* 3. Auto-detección de tráfico — solo informativo */}
                {metrics.wasHeavyTraffic && metrics.isValid && (
                    <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-2xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
                        <p className="text-xs text-starlight font-bold mb-0">
                            Tráfico pesado detectado <span className="text-accent">(velocidad prom &lt; 20 km/h)</span>. Consumo ajustado automáticamente.
                        </p>
                    </div>
                )}

                {/* 4. Formulario de Ingreso */}
                <TripInputForm onSave={saveTrip} isValid={metrics.isValid} />

                {/* Acción de Limpieza */}
                <button onClick={resetInputs} className="w-full py-4 text-xs font-black text-white/20 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest">
                    <RotateCcw className="w-3 h-3" /> Limpiar Formulario
                </button>
            </div>
        </div>
    );
};
