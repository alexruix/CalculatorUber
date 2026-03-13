import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedTrip, ShiftClose } from '../types/calculator.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from './useProfileStore';
import { getJourneyDate, calculateWaitMinutes, getTodayJourneyDate } from '../lib/journey';

export type TabId = 'home' | 'stats' | 'history' | 'profile';


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
                const { getJourneyDate, calculateWaitMinutes } = await import('../lib/journey');
                const state = get();

                // 1. Calcular métricas de telemetría
                const km = trip.distance || 0;
                const mins = trip.duration || 0;
                const avgSpeed = km > 0 && mins > 0 ? km / (mins / 60) : 0;

                // 2. Encontrar el viaje inmediatamente anterior (Soporta Date Override)
                // Ordenamos una copia temporal para buscar cronológicamente hacia atrás
                const sortedTrips = [...state.sessionTrips].sort((a, b) => b.timestamp - a.timestamp);
                const prevTrip = sortedTrips.find(t => t.timestamp < trip.timestamp);

                // 3. Calcular espera — método robusto usando timestamps absolutos
                let waitMinutes = 0;
                if (prevTrip) {
                    waitMinutes = calculateWaitMinutes(
                        { timestamp: prevTrip.timestamp, duration: prevTrip.duration || 0 },
                        trip.timestamp
                    );
                }

                // 4. Enriquecer con campos de Journey System V3
                const journeyDate = getJourneyDate(trip.timestamp);
                const enrichedTrip: SavedTrip = {
                    ...trip,
                    avgSpeed,
                    waitMinutes,
                    date: journeyDate,
                    isProfitable: trip.margin > 0,
                    syncStatus: 'pending' // Por defecto pendiente hasta confirmar subida
                };

                // 5. Persistencia local inmediata
                set((s) => ({ 
                    sessionTrips: [enrichedTrip, ...s.sessionTrips].sort((a, b) => b.timestamp - a.timestamp) 
                }));

                // 6. Sincronización con Supabase (en segundo plano)
                const user = useProfileStore.getState().user;
                if (user && isSupabaseConfigured() && navigator.onLine) {
                    try {
                        const { error } = await supabase.from('trips').upsert({
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
                            timestamp: trip.timestamp,
                            journey_date: journeyDate,
                            is_profitable: trip.margin > 0,
                        });

                        if (!error) {
                            // Marcar como sincronizado localmente
                            set((s) => ({
                                sessionTrips: s.sessionTrips.map(t => 
                                    t.id === trip.id ? { ...t, syncStatus: 'synced' } : t
                                )
                            }));
                        }
                    } catch (err) {
                        console.error("Error syncing trip:", err);
                    }
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
                if (!user || !isSupabaseConfigured()) return;

                // 1. PUSH: Sincronizar viajes pendientes (Outbox) - Sin bloquear el flujo
                const pendingTrips = get().sessionTrips.filter(t => t.syncStatus === 'pending');
                if (pendingTrips.length > 0 && navigator.onLine) {
                    try {
                        const pushData = pendingTrips.map(t => ({
                            id: t.id,
                            user_id: user.id,
                            shift_id: t.shift_id,
                            fare: t.fare,
                            margin: t.margin,
                            distance: t.distance,
                            duration: t.duration,
                            vertical: t.vertical,
                            tip: t.tip,
                            tolls: t.tolls,
                            start_time: t.startTime,
                            timestamp: t.timestamp,
                            journey_date: t.date,
                            is_profitable: t.isProfitable,
                            avg_speed: t.avgSpeed,
                            wait_minutes: t.waitMinutes
                        }));
                        
                        const { error } = await supabase.from('trips').upsert(pushData);
                        if (!error) {
                            set(state => ({
                                sessionTrips: state.sessionTrips.map(t => 
                                    pendingTrips.find(p => p.id === t.id) 
                                    ? { ...t, syncStatus: 'synced' as const } 
                                    : t
                                )
                            }));
                        }
                    } catch (e) {
                        console.error("Silent Push failed:", e);
                    }
                }

                // 2. PULL: Cargar últimos 50 viajes (Background Sync)
                if (navigator.onLine) {
                    try {
                        const { data, error } = await supabase
                            .from('trips')
                            .select('*')
                            .eq('user_id', user.id)
                            .order('timestamp', { ascending: false })
                            .limit(50); // ✅ Velocidad máxima: solo los últimos 50

                        if (data && !error) {
                            const remoteTrips: SavedTrip[] = data.map(dbTrip => ({
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
                                shift_id: dbTrip.shift_id,
                                date: dbTrip.journey_date ?? undefined,
                                isProfitable: dbTrip.is_profitable ?? (Number(dbTrip.margin) > 0),
                                syncStatus: 'synced'
                            }));

                            // 3. SILENT RECONCILIATION: Evitar re-renders si la data es idéntica
                            set(state => {
                                const currentTrips = state.sessionTrips;
                                
                                // Comprobación simplificada: ¿Son los mismos IDs en el mismo orden?
                                const isIdentical = currentTrips.length === remoteTrips.length && 
                                                  currentTrips.every((t, i) => t.id === remoteTrips[i].id && t.syncStatus === 'synced');
                                
                                if (isIdentical) return state;

                                // Mergear manteniendo los locales que sigan 'pending'
                                const stillPending = currentTrips.filter(t => t.syncStatus === 'pending');
                                const combined = [...stillPending];
                                
                                remoteTrips.forEach(remote => {
                                    if (!combined.some(c => c.id === remote.id)) {
                                        combined.push(remote);
                                    }
                                });

                                return { sessionTrips: combined.sort((a, b) => b.timestamp - a.timestamp) };
                            });
                        }
                    } catch (e) {
                        console.error("Silent Pull failed:", e);
                    }
                }
            },

            resetInputs: () => set({ 
                fare: '', distTrip: '', distPickup: '', duration: '', tip: '', tolls: '', startTime: '' 
            }),

            // ─── Journey Selectors ──────────────────────────────────────────────────────
            getTodayTrips: () => {
                const todayDate = getTodayJourneyDate();
                return get().sessionTrips.filter(trip => trip.date === todayDate);
            },

            getJourneyTrips: (date: string) => {
                return get().sessionTrips.filter(trip => trip.date === date);
            },
        }),
        {
            name: 'nodo_session_v3',
            version: 3,
            migrate: (persistedState: unknown, version: number) => {
                const state = persistedState as { sessionTrips?: SavedTrip[] };
                if (version < 3 && Array.isArray(state.sessionTrips)) {
                    state.sessionTrips = state.sessionTrips.map((trip) => {
                        // Usamos la función pura de journey.ts
                        const calcDate = getJourneyDate(trip.timestamp);
                        return {
                            ...trip,
                            date: trip.date ?? calcDate,
                            isProfitable: trip.isProfitable ?? (trip.margin > 0),
                        };
                    });
                }
                return state;
            },
            partialize: (state) => ({ 
                sessionTrips: state.sessionTrips, 
                shiftClose: state.shiftClose,
                startingOdometer: state.startingOdometer,
                currentOdometer: state.currentOdometer,
                activeShiftId: state.activeShiftId,
                fare: state.fare,
                distTrip: state.distTrip,
                distPickup: state.distPickup,
                duration: state.duration,
                tip: state.tip,
                tolls: state.tolls,
                startTime: state.startTime
            }), 
        }
    )
);