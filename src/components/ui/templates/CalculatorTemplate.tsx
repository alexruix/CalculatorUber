import React, { useEffect, useState, lazy, Suspense } from "react";

// Stores
import { useProfileStore } from "../../../store/useProfileStore";
import { useCalculatorStore } from "../../../store/useCalculatorStore";

// UI Organisms & Templates (New Atomic Architecture)
import { OnboardingFlow } from "../organisms/OnboardingFlow";
import { AuthScreen } from "../organisms/AuthScreen";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { PartyPopper } from '../../../lib/icons';
import { TabSkeleton } from "../molecules/TabSkeleton";

// Lazy Loaded Tabs (Code Splitting)
const TripsTab = lazy(() => import("../organisms/Tabs/TripsTab").then(m => ({ default: m.TripsTab })));
const ShiftCloseTab = lazy(() => import("../organisms/Tabs/ShiftCloseTab").then(m => ({ default: m.ShiftCloseTab })));
const ShiftSimulatorTab = lazy(() => import("../organisms/Tabs/ShiftSimulatorTab").then(m => ({ default: m.ShiftSimulatorTab })));
const HistoryTab = lazy(() => import("../organisms/Tabs/HistoryTab").then(m => ({ default: m.HistoryTab })));
const ProfileTab = lazy(() => import("../organisms/Tabs/ProfileTab").then(m => ({ default: m.ProfileTab })));

// Refactored Tabs
import { BottomTabNavigation } from "../organisms/BottomNavigation";

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
  const [showToast, setShowToast] = useState(false);

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

  // Show motivational toast after login/init
  useEffect(() => {
    if (!isInitializing && !isFetchingProfile && isConfigured && user) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [isInitializing, isFetchingProfile, isConfigured, user]);

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
        <Suspense fallback={<TabSkeleton />}>
          {activeTab === "home" && <ShiftSimulatorTab />}

          {activeTab === "trips" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <TripsTab />
            </div>
          )}

          {activeTab === "close" && (
            <ShiftCloseTab onNavigateTrips={() => setActiveTab('trips')} />
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

          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* ProfileTab is now self-contained — reads from Zustand directly */}
              <ProfileTab />
            </div>
          )}
        </Suspense>
      </main>

      {/* Motivational Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in fade-out duration-500 max-w-md mx-auto pointer-events-none">
          <div className="bg-[#111] supports-backdrop-filter:bg-green-500/10 border border-green-500/20 supports-backdrop-filter:backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <PartyPopper className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h4 className="text-white text-sm font-black">¡A romperla hoy! 🚀</h4>
              <p className="text-green-100/70 text-xs mt-0.5">Ayer te ahorraste mucha plata evitando viajes trampa.</p>
            </div>
          </div>
        </div>
      )}

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
