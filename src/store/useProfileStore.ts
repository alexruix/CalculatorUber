import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExpenseToggle, VerticalType } from '../types/calculator.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileState {
    isConfigured: boolean;
    isFetchingProfile: boolean;
    isInitialLoading: boolean; // 👈 Evita parpadeos de UI
    isPro: boolean;
    driverName: string;
    vehicleName: string;
    kmPerLiter: number;
    /** Costo de mantenimiento por KM (aceite, frenos, neumáticos, etc.) */
    maintPerKm: number;
    /** Valor de mercado actual del vehículo en ARS */
    vehicleValue: number;
    /** Kilómetros de vida útil estimados del vehículo */
    vehicleLifetimeKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
    vertical: VerticalType | null;
    user: User | null;
    // Module C — Objetivos
    dailyGoal: number;
    dailyHours: number;

    // Quick Multi-Vertical Swapper
    secondaryVehicle: {
        vehicleName: string;
        kmPerLiter: number;
        maintPerKm: number;
        vertical: VerticalType | null;
    } | null;

    // Actions
    setProfile: (data: Partial<Omit<ProfileState, 'setProfile' | 'resetProfile' | 'initProfile' | 'setUser' | 'logout' | 'swapVehicle' | 'amortizationPerKm'>>) => void;
    /** Amortización calculada: vehicleValue / vehicleLifetimeKm (read-only derivada) */
    readonly amortizationPerKm: number;
    resetProfile: () => void;
    initProfile: () => Promise<void>;
    setUser: (user: User | null) => void;
    swapVehicle: () => void;
    logout: () => Promise<void>;
}

const initialProfileState = {
    isConfigured: false,
    isFetchingProfile: false,
    isInitialLoading: true, // Inicia en true hasta que termina initProfile
    isPro: false,
    driverName: '',
    vehicleName: '',
    kmPerLiter: 10,
    maintPerKm: 15,
    vehicleValue: 3000000,
    vehicleLifetimeKm: 200000,
    fuelPrice: 1400,
    expenseSettings: [
        { id: 'fuel', label: 'Combustible', enabled: true },
        { id: 'maintenance', label: 'Mantenimiento', enabled: true },
        { id: 'amortization', label: 'Amortización Vehicular', enabled: false },
    ],
    vertical: null,
    dailyGoal: 0,
    dailyHours: 8,
    secondaryVehicle: null,
};

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            ...initialProfileState,
            user: null,
            // Propiedad derivada: nunca persiste, siempre recalculada
            get amortizationPerKm() {
                const s = get();
                return s.vehicleLifetimeKm > 0 ? s.vehicleValue / s.vehicleLifetimeKm : 0;
            },
            setUser: (user) => set({ user }),
            initProfile: async () => {
                set({ isFetchingProfile: true, isInitialLoading: true });
                
                if (!isSupabaseConfigured()) {
                    set({ isFetchingProfile: false, isInitialLoading: false });
                    return;
                }

                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    const currentUser = session?.user || null;

                    if (currentUser) {
                        // Fetch profile from supabase
                        const { data, error } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', currentUser.id)
                            .single();

                        if (data && !error) {
                            set({
                                user: currentUser,
                                isConfigured: data.is_onboarded === true, // <-- Vulnerability fix: Read onboarding state
                                isPro: data.subscription_tier === 'pro',
                                vehicleName: data.vehicle_name,
                                kmPerLiter: Math.max(0.1, Number(data.km_per_liter) || 10), // Safe Default
                                maintPerKm: Number(data.maint_per_km) || 15,
                                fuelPrice: Number(data.fuel_price) || 1400,
                                vehicleValue: data.vehicle_value ? Number(data.vehicle_value) : initialProfileState.vehicleValue,
                                vehicleLifetimeKm: data.vehicle_lifetime_km ? Number(data.vehicle_lifetime_km) : initialProfileState.vehicleLifetimeKm,
                                expenseSettings: data.expense_settings || initialProfileState.expenseSettings,
                                vertical: data.vertical || null,
                                dailyGoal: data.daily_goal !== undefined && data.daily_goal !== null ? Number(data.daily_goal) : initialProfileState.dailyGoal,
                                secondaryVehicle: data.secondary_vehicle || null,
                                isFetchingProfile: false,
                                isInitialLoading: false
                            });
                        } else {
                            // Current user exists but no profile yet (new user) or error
                            set({ user: currentUser, isConfigured: false, isFetchingProfile: false, isInitialLoading: false });
                        }
                    } else {
                        // No user
                        set({ user: null, isFetchingProfile: false, isInitialLoading: false });
                    }
                } catch (e) {
                    set({ isFetchingProfile: false, isInitialLoading: false });
                }
            },
            setProfile: async (data) => {
                // Aplicar Safe Defaults en la entrada
                const sanitizedData = { ...data };
                if (sanitizedData.kmPerLiter !== undefined) sanitizedData.kmPerLiter = Math.max(0.1, sanitizedData.kmPerLiter);

                set((state) => ({ ...state, ...sanitizedData, isConfigured: true }));

                // Sync with supabase if authenticated
                const currentUser = get().user;
                if (currentUser && isSupabaseConfigured()) {
                    const state = get();
                    const profileData = {
                        id: currentUser.id,
                        is_onboarded: true, // <-- Mark as completely onboarded after form
                        vehicle_name: state.vehicleName,
                        km_per_liter: state.kmPerLiter,
                        maint_per_km: state.maintPerKm,
                        fuel_price: state.fuelPrice,
                        expense_settings: state.expenseSettings,
                        vertical: state.vertical,
                        daily_goal: state.dailyGoal,
                        secondary_vehicle: state.secondaryVehicle,
                        subscription_tier: state.isPro ? 'pro' : 'free',
                        vehicle_value: state.vehicleValue,
                        vehicle_lifetime_km: state.vehicleLifetimeKm,
                        amortization_per_km: state.amortizationPerKm
                    };

                    await supabase
                        .from('profiles')
                        .upsert(profileData)
                }
            },
            swapVehicle: () => {
                const current = get();
                // Si no hay secundario, creamos uno por defecto invertido
                const targetVertical = current.vertical === 'transport' ? 'delivery' : 'transport';
                
                const nextVehicle = current.secondaryVehicle || {
                    vehicleName: targetVertical === 'delivery' ? 'Moto' : 'Auto',
                    kmPerLiter: targetVertical === 'delivery' ? 30 : 10,
                    maintPerKm: targetVertical === 'delivery' ? 5 : 20,
                    vertical: targetVertical
                };

                // Guardamos el actual como secundario
                const newSecondary = {
                    vehicleName: current.vehicleName,
                    kmPerLiter: current.kmPerLiter,
                    maintPerKm: current.maintPerKm,
                    vertical: current.vertical
                };

                // Asignamos el nuevo y guardamos auto en setProfile
                current.setProfile({
                    vehicleName: nextVehicle.vehicleName,
                    kmPerLiter: nextVehicle.kmPerLiter,
                    maintPerKm: nextVehicle.maintPerKm,
                    vertical: nextVehicle.vertical,
                    secondaryVehicle: newSecondary
                });
            },
            resetProfile: () => set((state) => ({ ...initialProfileState, user: state.user })), // Keep user on reset
            logout: async () => {
                if (isSupabaseConfigured()) {
                    await supabase.auth.signOut();
                }
                set({ ...initialProfileState, user: null });
                // Limpiar storage local y recargar para limpiar otros stores (como useCalculatorStore)
                localStorage.removeItem('nodo_config_v1');
                localStorage.removeItem('calculator-storage');
                window.location.reload();
            },
        }),
        {
            name: 'nodo_config_v1', // Replaces custom localStorage handling
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => !['user', 'isFetchingProfile', 'isInitialLoading'].includes(key))
            ) as ProfileState,
            merge: (persistedState: any, currentState) => {
                return {
                    ...currentState,
                    ...persistedState,
                    // Seguro absoluto: obliga a que expenseSettings sea un array. 
                    // Si local storage envía basura (un objeto vacío) por un bug viejo, resetea a default.
                    expenseSettings: Array.isArray(persistedState?.expenseSettings)
                        ? persistedState.expenseSettings
                        : currentState.expenseSettings,
                };
            }
        }
    )
);
