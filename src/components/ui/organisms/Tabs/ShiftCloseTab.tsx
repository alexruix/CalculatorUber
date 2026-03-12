import React from 'react';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { useShiftData } from '../../../../hooks/useShiftData';

// Components
import { SessionAnalysis } from './SessionAnalysis';

interface ShiftCloseTabProps {
    onNavigateTrips?: () => void;
}

export const ShiftCloseTab: React.FC<ShiftCloseTabProps> = ({ onNavigateTrips }) => {
    const { sessionTrips, clearSession } = useCalculatorStore();

    // Obtenemos métricas globales del turno usando el nuevo hook unificado
    const metrics = useShiftData();

    return (
        <div className="pb-32 space-y-6 animate-in slide-in-from-right-4 duration-500">

            {/* Análisis detallado expandible */}
            <div className="pt-2">
                <SessionAnalysis trips={sessionTrips} onClear={clearSession} />
            </div>
        </div>
    );
};
