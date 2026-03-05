import React, { useEffect, useState } from "react";

// Stores
import { useProfileStore } from "../../../store/useProfileStore";
import { useCalculatorStore } from "../../../store/useCalculatorStore";

// UI Organisms & Templates (New Atomic Architecture)
import { OnboardingFlow } from "../organisms/OnboardingFlow";
import { AuthScreen } from "../organisms/AuthScreen";
import { CalculatorTab } from "../organisms/Tabs/CalculatorTab";
import { ShiftSimulatorTab } from "../organisms/Tabs/ShiftSimulatorTab";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";

// Refactored Tabs
import { BottomTabNavigation } from "../organisms/BottomNavigation";
import { HistoryTab } from "../organisms/Tabs/HistoryTab";
import { SessionAnalysis } from "../organisms/Tabs/SessionAnalysis";
import { ProfileTab } from "../organisms/Tabs/ProfileTab";

const CalculatorApp: React.FC = () => {
  // Global State Access (Replacement of massive useState block)
  const { isConfigured, user, initProfile, isFetchingProfile } =
    useProfileStore();
  const {
    sessionTrips,
    activeTab,
    setActiveTab,
    clearSession,
    deleteTrip,
    initTrips,
  } = useCalculatorStore();

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Supabase data on mount e interceptar cambios de sesión
  useEffect(() => {
    const initializeApp = async () => {
      await initProfile();
      await initTrips();
      setIsInitializing(false);
    };
    initializeApp();

    if (isSupabaseConfigured()) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          useProfileStore.getState().setUser(null);
        } else if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
          await initProfile();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initProfile, initTrips]);

  if (isInitializing || isFetchingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/50 text-xs font-black uppercase tracking-widest animate-pulse">
          Sincronizando...
        </span>
      </div>
    );
  }

  // Auth Gate
  if (!user && isSupabaseConfigured()) {
    return (
      <AuthScreen
        onSuccess={() => {
          initProfile();
          initTrips();
        }}
      />
    );
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
          <p className="caption">La posta de tus viajes</p>
        </div>
      </header>

      {/* Contenedor Principal de Pestañas */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-4">
        {activeTab === "simulator" && <ShiftSimulatorTab />}

        {activeTab === "calculator" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <CalculatorTab />
          </div>
        )}

        {activeTab === "history" && (
          <HistoryTab
            trips={sessionTrips}
            onClearHistory={() => {
              if (confirm("¿Borrar historial del día?")) clearSession();
            }}
            onDeleteTrip={deleteTrip}
          />
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <SessionAnalysis
              trips={sessionTrips}
              onClear={() => {
                if (confirm("¿Borrar historial?")) clearSession();
              }}
            />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ProfileTab is now self-contained — reads from Zustand directly */}
            <ProfileTab />
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
