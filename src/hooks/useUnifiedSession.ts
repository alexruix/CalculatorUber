import { useShallow } from 'zustand/react/shallow';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { useProfileStore } from '../store/useProfileStore';

/**
 * useUnifiedSession
 * Hook central para la gestión del estado de la sesión, hidratación y recuperación.
 * Evita la dispersión de lógica de inicialización en componentes de UI.
 */
export const useUnifiedSession = () => {
    // 1. Estados de carga e hidratación (Zero-flicker policy)
    const isInitialLoading = useProfileStore(state => state.isInitialLoading);
    const isFetchingProfile = useProfileStore(state => state.isFetchingProfile);
    
    // 2. Datos de sesión activa (Uso de useShallow para evitar re-renders por cambios en otros campos del store)
    const { 
        sessionTrips, 
        startingOdometer, 
        currentOdometer,
        setStartingOdometer,
        setCurrentOdometer,
        clearSession,
        activeTab,
        setActiveTab,
        deleteTrip
    } = useCalculatorStore(useShallow(state => ({
        sessionTrips: state.sessionTrips,
        startingOdometer: state.startingOdometer,
        currentOdometer: state.currentOdometer,
        setStartingOdometer: state.setStartingOdometer,
        setCurrentOdometer: state.setCurrentOdometer,
        clearSession: state.clearSession,
        activeTab: state.activeTab,
        setActiveTab: state.setActiveTab,
        deleteTrip: state.deleteTrip
    })));

    const { user, isConfigured } = useProfileStore(useShallow(state => ({
        user: state.user,
        isConfigured: state.isConfigured
    })));

    /**
     * Inicia un nuevo turno/sesión reseteando datos previos
     * e inicializando el odómetro si es necesario.
     */
    const startShift = (odoValue: string) => {
        clearSession();
        setStartingOdometer(odoValue);
        setCurrentOdometer(odoValue);
    };

    /**
     * Finaliza la sesión actual.
     */
    const endShift = () => {
        clearSession();
    };

    return {
        // Status
        isReady: !isInitialLoading && !isFetchingProfile,
        isInitialLoading,
        isConfigured,
        user,

        // Data
        sessionTrips,
        startingOdometer,
        currentOdometer,
        activeTab,

        // Actions
        startShift,
        endShift,
        setStartingOdometer,
        setCurrentOdometer,
        clearSession,
        setActiveTab,
        deleteTrip
    };
};
