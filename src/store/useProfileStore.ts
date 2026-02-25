import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExpenseToggle } from '../types/calculator.types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileState {
    isConfigured: boolean;
    isPro: boolean;
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
    user: User | null;

    // Actions
    setProfile: (data: Partial<Omit<ProfileState, 'setProfile' | 'resetProfile' | 'initProfile' | 'setUser'>>) => void;
    resetProfile: () => void;
    initProfile: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const initialProfileState = {
    isConfigured: false,
    isPro: false,
    vehicleName: 'Name',
    kmPerLiter: 9,
    maintPerKm: 10,
    fuelPrice: 1600,
    expenseSettings: [
        { id: 'fuel', label: 'Combustible', enabled: true },
        { id: 'maintenance', label: 'Mantenimiento', enabled: true },
        { id: 'amortization', label: 'Amortización Vehicular', enabled: false },
    ],
};

export const useProfileStore = create<ProfileState>()(
    persist(
        (set, get) => ({
            ...initialProfileState,
            user: null,
            setUser: (user) => set({ user }),
            initProfile: async () => {
                if (!isSupabaseConfigured()) return;

                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user || null;
                set({ user: currentUser });

                if (currentUser) {
                    // Fetch profile from supabase
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', currentUser.id)
                        .single();

                    if (data && !error) {
                        set({
                            isConfigured: true,
                            isPro: data.subscription_tier === 'pro',
                            vehicleName: data.vehicle_name,
                            kmPerLiter: Number(data.km_per_liter),
                            maintPerKm: Number(data.maint_per_km),
                            fuelPrice: Number(data.fuel_price),
                            expenseSettings: data.expense_settings || initialProfileState.expenseSettings,
                        });
                    }
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
                        subscription_tier: state.isPro ? 'pro' : 'free'
                    };

                    await supabase
                        .from('profiles')
                        .upsert(profileData)
                        .eq('id', currentUser.id);
                }
            },
            resetProfile: () => set((state) => ({ ...initialProfileState, user: state.user })), // Keep user on reset
        }),
        {
            name: 'nodo_config_v1', // Replaces custom localStorage handling
            partialize: (state) => Object.fromEntries(
                Object.entries(state).filter(([key]) => !['user'].includes(key))
            ) as ProfileState,
        }
    )
);
