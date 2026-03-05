import React from 'react';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useShiftMetrics } from '../../../../hooks/useShiftMetrics';

// Components
import { ShiftCloseForm } from '../ShiftCloseForm';
import { ShiftSummaryCard } from '../../molecules/ShiftSummaryCard';
import { SessionAnalysis } from './SessionAnalysis';

interface ShiftCloseTabProps {
    onNavigateTrips?: () => void;
}

export const ShiftCloseTab: React.FC<ShiftCloseTabProps> = ({ onNavigateTrips }) => {
    const { sessionTrips, shiftClose, clearSession } = useCalculatorStore();

    // Filtramos para mostrar análisis solo de turnos de hoy (opcional, por ahora usamos todos)
    // Obtenemos métricas globales del turno
    const metrics = useShiftMetrics(sessionTrips, shiftClose);

    return (
        <div className="pb-32 space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* 1. Resumen Final de la Jornada */}
            <div className="px-4 pt-4">
                <ShiftSummaryCard
                    metrics={metrics}
                    onAddTrip={() => {
                        if (onNavigateTrips) onNavigateTrips();
                    }}
                />
            </div>

            {/* 2. Carga Manual del Turno */}
            <div className="px-4">
                <ShiftCloseForm />
            </div>

            {/* 3. Análisis detallado expandible */}
            <div className="pt-2">
                <SessionAnalysis trips={sessionTrips} onClear={clearSession} />
            </div>
        </div>
    );
};
