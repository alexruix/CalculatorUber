import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExpenseToggle, VerticalType } from '../types/calculator.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileState {
    isConfigured: boolean;
    isFetchingProfile: boolean;
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
                if (!isSupabaseConfigured()) return;

                set({ isFetchingProfile: true });

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
                                isConfigured: true,
                                isPro: data.subscription_tier === 'pro',
                                vehicleName: data.vehicle_name,
                                kmPerLiter: Number(data.km_per_liter),
                                maintPerKm: Number(data.maint_per_km),
                                fuelPrice: Number(data.fuel_price),
                                expenseSettings: data.expense_settings || initialProfileState.expenseSettings,
                                vertical: data.vertical || null,
                                isFetchingProfile: false
                            });
                        } else {
                            // Current user exists but no profile yet (new user) or error
                            set({ user: currentUser, isConfigured: false, isFetchingProfile: false });
                        }
                    } else {
                        // No user
                        set({ user: null, isFetchingProfile: false });
                    }
                } catch (e) {
                    set({ isFetchingProfile: false });
                }
            },
            setProfile: async (data) => {
                set((state) => ({ ...state, ...data, isConfigured: true }));

                // Sync with supabase if authenticated
                const currentUser = get().user;
                if (currentUser && isSupabaseConfigured()) {
                    const state = get();
                    const profileData = {
                        id: currentUser.id,
                        vehicle_name: state.vehicleName,
                        km_per_liter: state.kmPerLiter,
                        maint_per_km: state.maintPerKm,
                        fuel_price: state.fuelPrice,
                        expense_settings: state.expenseSettings,
                        vertical: state.vertical,
                        subscription_tier: state.isPro ? 'pro' : 'free'
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
                Object.entries(state).filter(([key]) => !['user', 'isFetchingProfile'].includes(key))
            ) as ProfileState,
        }
    )
);
