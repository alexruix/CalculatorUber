import React, { useMemo } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { useProfileStore } from '../../../../store/useProfileStore';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useProfitability } from '../../../../hooks/useProfitability';
import type { SavedTrip } from '../../../../types/calculator.types';

// Components
import { ProfitabilityScore } from '../ProfitabilityScore';
import { TripInputForm } from '../TripInputForm';
import { MiniSummary } from '../../molecules/MiniSummary';

export const CalculatorTab: React.FC = () => {
    // Stores
    const { kmPerLiter, maintPerKm, fuelPrice, expenseSettings } = useProfileStore();
    const {
        fare, distTrip, distPickup, duration,
        isHeavyTraffic, setIsHeavyTraffic,
        sessionTrips, addTrip, resetInputs
    } = useCalculatorStore();

    // Logic
    const metrics = useProfitability(
        fare, distTrip, distPickup, kmPerLiter,
        maintPerKm, fuelPrice, isHeavyTraffic, expenseSettings
    );

    const totalMargin = useMemo(() => sessionTrips.reduce((acc, t) => acc + t.margin, 0), [sessionTrips]);
    const tripCount = sessionTrips.length;

    const saveTrip = () => {
        if (!metrics.isValid) return;
        const newTrip: SavedTrip = {
            id: Date.now(),
            fare: parseFloat(fare),
            margin: metrics.netMargin,
            distance: parseFloat(distTrip) + (parseFloat(distPickup) || 0),
            duration: parseFloat(duration),
            timestamp: Date.now()
        };
        addTrip(newTrip);
        resetInputs();
    };

    return (
        <div className="pb-32 space-y-5 animate-in fade-in duration-500">
            {/* 1. Score de Rentabilidad */}
            <div className="sticky top-0 z-20 backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5">
                <ProfitabilityScore metrics={metrics} />
            </div>

            <div className="space-y-6">
                {/* 2. Resumen Rápido */}
                <MiniSummary totalMargin={totalMargin} tripCount={tripCount} />

                {/* 3. Botón de Tránsito */}
                <button
                    onClick={() => setIsHeavyTraffic(!isHeavyTraffic)}
                    className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${isHeavyTraffic
                        ? 'border-nodo-wine bg-nodo-wine/10 text-nodo-wine'
                        : 'border-white/5 bg-white/5 text-white/40'
                        }`}
                >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-xs font-black uppercase tracking-[0.2em] opacity-50 mb-1">Tránsito</span>
                        <span className="text-sm font-black">{isHeavyTraffic ? 'PESADO (+20% Gasto)' : 'NORMAL'}</span>
                    </div>
                    <Zap className={`w-6 h-6 ${isHeavyTraffic ? 'fill-current' : ''}`} />
                </button>

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
