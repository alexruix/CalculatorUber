import React, { useEffect, useMemo, useState } from 'react';

// Stores
import { useProfileStore } from '../../../store/useProfileStore';
import { useCalculatorStore } from '../../../store/useCalculatorStore';

// UI Organisms & Templates (New Atomic Architecture)
import { OnboardingFlow } from '../organisms/OnboardingFlow';
import { AuthScreen } from '../organisms/AuthScreen';
import { CalculatorTab } from '../organisms/Tabs/CalculatorTab';
import { isSupabaseConfigured } from '../../../lib/supabase';

// Refactored Tabs
import { BottomTabNavigation } from '../organisms/BottomNavigation';
import { HistoryTab } from '../organisms/Tabs/HistoryTab';
import { SessionAnalysis } from '../organisms/Tabs/SessionAnalysis';
import { ProfileTab } from '../organisms/Tabs/ProfileTab';

const CalculatorApp: React.FC = () => {

  // Global State Access (Replacement of massive useState block)
  const { isConfigured, user, initProfile } = useProfileStore();
  const { sessionTrips, activeTab, setActiveTab, clearSession, deleteTrip, initTrips } = useCalculatorStore();

  // Profile Store items mainly used by original ProfileTab component
  const {
    vehicleName, setProfile, resetProfile,
    kmPerLiter, maintPerKm, fuelPrice, expenseSettings
  } = useProfileStore();

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Supabase data on mount
  useEffect(() => {
    const initializeApp = async () => {
      await initProfile();
      await initTrips();
      setIsInitializing(false);
    };
    initializeApp();
  }, [initProfile, initTrips]);

  const driverLevel = useMemo(() => Math.floor(sessionTrips.length / 5) + 1, [sessionTrips]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <span className="text-white/50 text-xs font-black uppercase tracking-widest animate-pulse">Cargando Taller...</span>
      </div>
    );
  }

  // Auth Gate
  if (!user && isSupabaseConfigured()) {
    return <AuthScreen onSuccess={() => {
      initProfile();
      initTrips();
    }} />;
  }

  if (!isConfigured) {
    return <OnboardingFlow />;
  }

  return (
    <div className="page-shell">
      {/* Header Fijo con Branding NODO */}
      <header className="app-header">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black text-white tracking-tighter flex-col items-center gap-2">
            Manejate
          </h1>
          <p className="caption">
            La posta de tus viajes
          </p>
        </div>
      </header>

      {/* Contenedor Principal de Pestañas */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-4">
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CalculatorTab />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryTab
            trips={sessionTrips}
            onClearHistory={() => { if (confirm('¿Borrar historial del día?')) clearSession(); }}
            onDeleteTrip={deleteTrip}
          />
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <SessionAnalysis
              trips={sessionTrips}
              onClear={() => { if (confirm('¿Borrar historial?')) clearSession(); }}
            />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Note: Still using the old ProfileTab component for now, but passing Zustand actions down */}
            <ProfileTab
              vehicleName={vehicleName} setVehicleName={(v) => setProfile({ vehicleName: v })}
              kmPerLiter={kmPerLiter} setKmPerLiter={(v) => setProfile({ kmPerLiter: v })}
              maintPerKm={maintPerKm} setMaintPerKm={(v) => setProfile({ maintPerKm: v })}
              fuelPrice={fuelPrice} setFuelPrice={(v) => setProfile({ fuelPrice: v })}
              expenseSettings={expenseSettings} setExpenseSettings={(v) => setProfile({ expenseSettings: v as any })}
              onSaveConfig={(updates) => setProfile(updates)}
              onResetAll={() => { resetProfile(); localStorage.clear(); window.location.reload(); }}
              totalTrips={sessionTrips.length}
              driverLevel={driverLevel}
            />
          </div>
        )}

      </main>

      {/* Navegación Inferior */}
      <BottomTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab as any}
        badgeCount={sessionTrips.length}
      />
    </div>
  );
};

export default CalculatorApp;