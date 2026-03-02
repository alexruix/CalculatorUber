import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedTrip } from '../types/calculator.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from './useProfileStore';

export type TabId = 'calculator' | 'history' | 'analysis' | 'profile';

interface CalculatorState {
    // Inputs del form
    fare: string;
    distTrip: string;
    distPickup: string;
    duration: string;
    tip: string;
    waitTime: string;
    tolls: string;

    // Controles de entorno
    isHeavyTraffic: boolean;

    // Sesión y navegación
    activeTab: TabId;
    sessionTrips: SavedTrip[];

    // Acciones (Actions)
    setFare: (val: string) => void;
    setDistTrip: (val: string) => void;
    setDistPickup: (val: string) => void;
    setDuration: (val: string) => void;
    setTip: (val: string) => void;
    setWaitTime: (val: string) => void;
    setTolls: (val: string) => void;
    setIsHeavyTraffic: (val: boolean) => void;
    setActiveTab: (tab: TabId) => void;

    // Trip management
    // Trip management
    addTrip: (trip: SavedTrip) => void;
    deleteTrip: (id: number | string) => void;
    clearSession: () => void;
    initTrips: () => Promise<void>;
    resetInputs: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
    persist(
        (set) => ({
            fare: '',
            distTrip: '',
            distPickup: '',
            duration: '',
            tip: '',
            waitTime: '',
            tolls: '',
            isHeavyTraffic: false,
            activeTab: 'calculator',
            sessionTrips: [],

            setFare: (val) => set({ fare: val }),
            setDistTrip: (val) => set({ distTrip: val }),
            setDistPickup: (val) => set({ distPickup: val }),
            setDuration: (val) => set({ duration: val }),
            setTip: (val) => set({ tip: val }),
            setWaitTime: (val) => set({ waitTime: val }),
            setTolls: (val) => set({ tolls: val }),
            setIsHeavyTraffic: (val) => set({ isHeavyTraffic: val }),
            setActiveTab: (val) => set({ activeTab: val }),

            addTrip: async (trip) => {
                set((state) => ({ sessionTrips: [trip, ...state.sessionTrips] }));

                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured()) {
                    await supabase.from('trips').insert({
                        id: trip.id,
                        user_id: user.id,
                        fare: trip.fare,
                        margin: trip.margin,
                        distance: trip.distance,
                        duration: trip.duration,
                        vertical: trip.vertical,
                        tip: trip.tip,
                        tolls: trip.tolls,
                        timestamp: new Date().toISOString() // Or use trip timestamp if it had one
                    });
                }
            },
            deleteTrip: async (id) => {
                set((state) => ({
                    sessionTrips: state.sessionTrips.filter(t => t.id !== id)
                }));

                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured()) {
                    await supabase.from('trips').delete().eq('id', id).eq('user_id', user.id);
                }
            },
            clearSession: async () => {
                set({ sessionTrips: [] });

                const user = useProfileStore.getState().user;
                // Si limpia la sesión actual, en un modelo real quizás solo borramos de la vista local 
                // o borramos de la BD los de las últimas 24hs. Por simplicidad de este sprint, borramos todo de este usuario.
                if (user && isSupabaseConfigured()) {
                    await supabase.from('trips').delete().eq('user_id', user.id);
                }
            },
            initTrips: async () => {
                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured()) {
                    const { data, error } = await supabase
                        .from('trips')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('timestamp', { ascending: false });

                    if (data && !error) {
                        const loadedTrips: SavedTrip[] = data.map(dbTrip => ({
                            id: dbTrip.id,
                            fare: Number(dbTrip.fare),
                            margin: Number(dbTrip.margin),
                            distance: Number(dbTrip.distance),
                            duration: Number(dbTrip.duration),
                            vertical: dbTrip.vertical,
                            tip: Number(dbTrip.tip || 0),
                            tolls: Number(dbTrip.tolls || 0),
                            timestamp: dbTrip.timestamp,
                        }));
                        set({ sessionTrips: loadedTrips });
                    }
                }
            },

            resetInputs: () => set({ fare: '', distTrip: '', distPickup: '', duration: '', tip: '', waitTime: '', tolls: '' }),
        }),
        {
            name: 'nodo_session_v1', // Replaces useSessionStorage custom hook
            partialize: (state) => ({ sessionTrips: state.sessionTrips }), // Only persist the trips array
        }
    )
);
