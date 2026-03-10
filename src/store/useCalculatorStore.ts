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

    // Odometer data (Persistidos localmente y sincronizados con Shifts)
    startingOdometer: string;
    currentOdometer: string;
    activeShiftId: string | null;

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
    setStartingOdometer: (val: string) => void;
    setCurrentOdometer: (val: string) => void;
    setShiftClose: (data: ShiftClose | null) => void;
    setActiveTab: (tab: TabId) => void;

    // Trip management
    addTrip: (trip: SavedTrip) => Promise<void>;
    deleteTrip: (id: number | string) => Promise<void>;
    clearSession: () => Promise<void>;
    initTrips: () => Promise<void>;
    resetInputs: () => void;
    updateTrip: (id: number | string, newData: Partial<SavedTrip>) => Promise<void>;
}

export const useCalculatorStore = create<CalculatorState>()(
    persist(
        (set, get) => ({
            fare: '',
            distTrip: '',
            distPickup: '',
            duration: '',
            tip: '',
            tolls: '',
            startTime: '',
            startingOdometer: '',
            currentOdometer: '',
            activeShiftId: null,
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
            
            
            setStartingOdometer: async (val) => {
                set({ startingOdometer: val });
                
                // Si hay internet y no hay turno activo, creamos uno en Supabase
                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured() && navigator.onLine && !get().activeShiftId && val !== '') {
                    const { data } = await supabase.from('shifts').insert({
                        user_id: user.id,
                        odometer_start: Number(val),
                        status: 'active'
                    }).select().single();
                    if (data) set({ activeShiftId: data.id });
                }
            },

            setCurrentOdometer: (val) => set({ currentOdometer: val }),
            setShiftClose: (data) => set({ shiftClose: data }),
            setActiveTab: (val) => set({ activeTab: val }),

            addTrip: async (trip) => {
                const state = get();
                
                // 1. Lógica de cálculo (UI enrichment)
                const km = trip.distance || 0;
                const mins = trip.duration || 0;
                const avgSpeed = (km > 0 && mins > 0) ? km / (mins / 60) : 0;

                let waitMinutes = 0;
                if (trip.startTime && state.sessionTrips.length > 0) {
                    const prevTrip = state.sessionTrips[0];
                    if (prevTrip.startTime) {
                        const [prevH, prevM] = prevTrip.startTime.split(':').map(Number);
                        const prevEndTotalMins = prevH * 60 + prevM + prevTrip.duration;
                        const [currH, currM] = trip.startTime.split(':').map(Number);
                        let currStartTotalMins = currH * 60 + currM;
                        if (currStartTotalMins < prevEndTotalMins && (prevEndTotalMins - currStartTotalMins) > 12 * 60) {
                            currStartTotalMins += 24 * 60;
                        }
                        waitMinutes = Math.max(0, currStartTotalMins - prevEndTotalMins);
                    }
                }

                const enrichedTrip = { 
                    ...trip, 
                    avgSpeed, 
                    waitMinutes, 
                    shift_id: state.activeShiftId || undefined 
                };

                // 2. Persistencia Local Inmediata (Zustand + LocalStorage)
                set((s) => ({ sessionTrips: [enrichedTrip, ...s.sessionTrips] }));

                // 3. Sincronización con Supabase si hay internet
                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured() && navigator.onLine) {
                    await supabase.from('trips').insert({
                        id: trip.id,
                        user_id: user.id,
                        shift_id: state.activeShiftId,
                        fare: trip.fare || 0,
                        margin: trip.margin || 0,
                        distance: trip.distance || 0,
                        duration: trip.duration || 0,
                        vertical: trip.vertical,
                        tip: trip.tip,
                        tolls: trip.tolls,
                        start_time: trip.startTime,
                        active_time: trip.activeTime || trip.duration || 0,
                        avg_speed: avgSpeed,
                        wait_minutes: waitMinutes,
                        timestamp: trip.timestamp // bigint en SQL
                    });
                }
            },

            deleteTrip: async (id) => {
                set((state) => ({
                    sessionTrips: state.sessionTrips.filter(t => t.id !== id)
                }));

                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured() && navigator.onLine) {
                    await supabase.from('trips').delete().eq('id', id).eq('user_id', user.id);
                }
            },

            clearSession: async () => {
                const state = get();
                const user = useProfileStore.getState().user;

                // 1. Cierre de turno en Supabase (si hay internet)
                if (user && isSupabaseConfigured() && navigator.onLine && state.activeShiftId) {
                    const trips = state.sessionTrips;
                    const totalFare = trips.reduce((acc, t) => acc + (t.fare || 0), 0);
                    const totalMargin = trips.reduce((acc, t) => acc + (t.margin || 0), 0);
                    const productiveMinutes = trips.reduce((acc, t) => acc + (t.duration || 0), 0);
                    const idleMinutes = trips.reduce((acc, t) => acc + (t.waitMinutes || 0), 0);
                    const kmDriven = trips.reduce((acc, t) => acc + (t.distance || 0), 0);
                    
                    let totalShiftMinutes = productiveMinutes + idleMinutes;
                    if (totalShiftMinutes === 0 && trips.length > 0 && trips[0].timestamp && trips[trips.length - 1].timestamp) {
                         totalShiftMinutes = Math.round((trips[0].timestamp - trips[trips.length - 1].timestamp) / 60000) + (trips[0].duration || 0);
                    }
                    
                    const eph = totalShiftMinutes > 0 ? (totalMargin / (totalShiftMinutes / 60)) : 0;
                    
                    await supabase.from('shifts')
                        .update({ 
                            status: 'closed', 
                            odometer_end: Number(state.currentOdometer),
                            end_at: new Date().toISOString(),
                            total_fare: totalFare,
                            total_margin: totalMargin,
                            productive_minutes: productiveMinutes,
                            total_shift_minutes: totalShiftMinutes,
                            idle_minutes: idleMinutes,
                            km_driven: kmDriven,
                            eph: eph
                        })
                        .eq('id', state.activeShiftId);
                }

                // 2. Reseteo local (Preservamos el historial en la DB, solo limpiamos la sesión actual)
                set({ 
                    sessionTrips: [], 
                    startingOdometer: '', 
                    currentOdometer: '',
                    activeShiftId: null,
                    shiftClose: null 
                });
            },

            updateTrip: async (id, newData) => {
                set((state) => ({
                    sessionTrips: state.sessionTrips.map(t => 
                        t.id === id ? { ...t, ...newData } : t
                    )
                }));

                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured() && navigator.onLine) {
                    await supabase.from('trips').update(newData).eq('id', id).eq('user_id', user.id);
                }
            },

            initTrips: async () => {
                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured()) {
                    // Si estamos online, reconciliamos con la base de datos
                    if (navigator.onLine) {
                        const { data, error } = await supabase
                            .from('trips')
                            .select('*')
                            .eq('user_id', user.id)
                            .order('timestamp', { ascending: false });

                        if (data && !error) {
                            const loadedTrips: SavedTrip[] = data.map(dbTrip => ({
                                id: Number(dbTrip.id),
                                fare: Number(dbTrip.fare),
                                margin: Number(dbTrip.margin),
                                distance: Number(dbTrip.distance),
                                duration: Number(dbTrip.duration),
                                vertical: dbTrip.vertical,
                                tip: Number(dbTrip.tip || 0),
                                tolls: Number(dbTrip.tolls || 0),
                                timestamp: Number(dbTrip.timestamp),
                                startTime: dbTrip.start_time,
                                avgSpeed: Number(dbTrip.avg_speed || 0),
                                waitMinutes: Number(dbTrip.wait_minutes || 0),
                                shift_id: dbTrip.shift_id
                            }));
                            set({ sessionTrips: loadedTrips });
                        }
                    }
                }
            },

            resetInputs: () => set({ 
                fare: '', distTrip: '', distPickup: '', duration: '', tip: '', tolls: '', startTime: '' 
            }),
        }),
        {
            name: 'nodo_session_v2', 
            partialize: (state) => ({ 
                sessionTrips: state.sessionTrips, 
                shiftClose: state.shiftClose,
                startingOdometer: state.startingOdometer,
                currentOdometer: state.currentOdometer,
                activeShiftId: state.activeShiftId
            }), 
        }
    )
);