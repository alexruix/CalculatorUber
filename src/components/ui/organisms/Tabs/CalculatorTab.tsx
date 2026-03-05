import React, { useMemo } from 'react';
import { AlertTriangle, RotateCcw, Activity } from '../../../../lib/icons';
import { useProfileStore } from '../../../../store/useProfileStore';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useProfitability } from '../../../../hooks/useProfitability';
import type { SavedTrip } from '../../../../types/calculator.types';

// Components
import { ProfitabilityScore } from '../ProfitabilityScore';
import { TripInputForm } from '../TripInputForm';
import { MiniSummary } from '../../molecules/MiniSummary';
import { ProductivityIndex } from '../../molecules/ProductivityIndex';

export const CalculatorTab: React.FC = () => {
    // Stores
    const { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings, vertical } = useProfileStore();
    const {
        fare, distTrip, duration, activeTime, tip, tolls,
        sessionTrips, addTrip, resetInputs
    } = useCalculatorStore();

    // Logic — pass amortizationPerKm separately from maintPerKm
    const metrics = useProfitability(
        { fare, distTrip, distPickup: '0', tip, tolls, activeTime },
        vertical,
        { kmPerLiter, maintPerKm, amortizationPerKm, fuelPrice, expenseSettings }
    );

    const totalMargin = useMemo(() => sessionTrips.reduce((acc, t) => acc + t.margin, 0), [sessionTrips]);
    const totalEPH = useMemo(() => {
        const withTime = sessionTrips.filter(t => (t.activeTime || 0) > 0);
        if (!withTime.length) return 0;
        const totalNet = withTime.reduce((acc, t) => acc + t.margin, 0);
        const totalTime = withTime.reduce((acc, t) => acc + (t.activeTime || 0), 0);
        return totalTime > 0 ? Math.round(totalNet / totalTime) : 0;
    }, [sessionTrips]);
    const tripCount = sessionTrips.length;

    const saveTrip = () => {
        if (!metrics.isValid) return;
        const newTrip: SavedTrip = {
            id: Date.now(),
            fare: parseFloat(fare),
            margin: metrics.netMargin,
            distance: parseFloat(distTrip) || 0,
            duration: parseFloat(duration) || 0,
            activeTime: parseFloat(activeTime) || 0,
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
            {/* 1. Score de Rentabilidad */}
            <div className="sticky top-0 z-20 bg-black/80 supports-[backdrop-filter]:backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5">
                <ProfitabilityScore metrics={metrics} />
            </div>

            <div className="space-y-6">
                {/* 2. Resumen acumulado de turnos */}
                {tripCount > 0 && (
                    <MiniSummary totalMargin={totalMargin} tripCount={tripCount} eph={totalEPH} />
                )}

                {/* 3. Auto-detección de tráfico — solo informativo */}
                {metrics.wasHeavyTraffic && metrics.isValid && (
                    <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <p className="text-xs text-amber-100/70 font-bold">
                            Tráfico pesado detectado <span className="text-amber-400">(velocidad prom &lt; 20 km/h)</span>. Consumo ajustado automáticamente.
                        </p>
                    </div>
                )}

                {/* 4. Índice de Productividad */}
                {parseFloat(activeTime) > 0 && parseFloat(duration) > 0 && (
                    <ProductivityIndex
                        activeTime={parseFloat(activeTime)}
                        totalTime={parseFloat(duration)}
                        eph={metrics.profitPerHour}
                    />
                )}

                {/* 5. Formulario de Ingreso */}
                <TripInputForm onSave={saveTrip} isValid={metrics.isValid} />

                {/* Acción de Limpieza */}
                <button onClick={resetInputs} className="w-full py-4 text-xs font-black text-white/20 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest">
                    <RotateCcw className="w-3 h-3" /> Limpiar Formulario
                </button>
            </div>
        </div>
    );
};
