import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedTrip, ShiftClose } from '../types/calculator.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from './useProfileStore';

export type TabId = 'home' | 'trips' | 'close' | 'history' | 'profile';

interface CalculatorState {
    // Inputs del form del VIAJE
    fare: string;
    distTrip: string;
    distPickup: string;
    duration: string;
    tip: string;
    tolls: string;
    startTime: string; // "HH:MM"

    // Datos del CIERRE de turno
    shiftClose: ShiftClose | null;

    // Sesión y navegación
    activeTab: TabId;
    sessionTrips: SavedTrip[];

    // Acciones (Actions)
    setFare: (val: string) => void;
    setDistTrip: (val: string) => void;
    setDistPickup: (val: string) => void;
    setDuration: (val: string) => void;
    setTip: (val: string) => void;
    setTolls: (val: string) => void;
    setStartTime: (val: string) => void;
    setShiftClose: (data: ShiftClose | null) => void;
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
            tolls: '',
            startTime: '',
            shiftClose: null,
            activeTab: 'home',
            sessionTrips: [],

            setFare: (val) => set({ fare: val }),
            setDistTrip: (val) => set({ distTrip: val }),
            setDistPickup: (val) => set({ distPickup: val }),
            setDuration: (val) => set({ duration: val }),
            setTip: (val) => set({ tip: val }),
            setTolls: (val) => set({ tolls: val }),
            setStartTime: (val) => set({ startTime: val }),
            setShiftClose: (data) => set({ shiftClose: data }),
            setActiveTab: (val) => set({ activeTab: val }),

            addTrip: async (trip) => {
                set((state) => {
                    // Auto-calcular avgSpeed
                    const km = trip.distance || 0;
                    const mins = trip.duration || 0;
                    const avgSpeed = (km > 0 && mins > 0) ? km / (mins / 60) : 0;

                    // Auto-calcular waitMinutes desde el viaje anterior si hay startTime
                    let waitMinutes = 0;
                    if (trip.startTime && state.sessionTrips.length > 0) {
                        const prevTrip = state.sessionTrips[0]; // están ordenados por id desc
                        if (prevTrip.startTime) {
                            const [prevH, prevM] = prevTrip.startTime.split(':').map(Number);
                            const prevEndTotalMins = prevH * 60 + prevM + prevTrip.duration;
                            
                            const [currH, currM] = trip.startTime.split(':').map(Number);
                            let currStartTotalMins = currH * 60 + currM;
                            
                            // Si cruzó la medianoche
                            if (currStartTotalMins < prevEndTotalMins && (prevEndTotalMins - currStartTotalMins) > 12 * 60) {
                                currStartTotalMins += 24 * 60;
                            }
                            
                            waitMinutes = Math.max(0, currStartTotalMins - prevEndTotalMins);
                        }
                    }

                    const enrichedTrip = { ...trip, avgSpeed, waitMinutes };
                    return { sessionTrips: [enrichedTrip, ...state.sessionTrips] }
                });

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
                        timestamp: trip.timestamp.toString() // Save numeric Unix timestamp as string
                        // Falta persistir startTime, avgSpeed y waitMinutes en base de datos si se requiere
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
                            timestamp: Number(dbTrip.timestamp), // Convert string back to numeric timestamp
                        }));
                        set({ sessionTrips: loadedTrips });
                    }
                }
            },

            resetInputs: () => set({ fare: '', distTrip: '', distPickup: '', duration: '', tip: '', tolls: '', startTime: '' }),
        }),
        {
            name: 'nodo_session_v1', // Replaces useSessionStorage custom hook
            partialize: (state) => ({ sessionTrips: state.sessionTrips, shiftClose: state.shiftClose }), // Persist trips and shiftClose
        }
    )
);
