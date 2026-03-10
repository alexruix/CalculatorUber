import React, { useEffect, useState, lazy, Suspense } from "react";

// Stores
import { useProfileStore } from "../../../store/useProfileStore";
import { useCalculatorStore } from "../../../store/useCalculatorStore";

// UI Organisms & Templates (New Atomic Architecture)
import { OnboardingFlow } from "../organisms/OnboardingFlow";
import { AuthScreen } from "../organisms/AuthScreen";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
import { PartyPopper } from "../../../lib/icons";
import { TabSkeleton } from "../molecules/TabSkeleton";

// Lazy Loaded Tabs (Code Splitting)
const TripsTab = lazy(() =>
  import("../organisms/Tabs/TripsTab").then((m) => ({ default: m.TripsTab })),
);
const ShiftCloseTab = lazy(() =>
  import("../organisms/Tabs/ShiftCloseTab").then((m) => ({
    default: m.ShiftCloseTab,
  })),
);
const ShiftSimulatorTab = lazy(() =>
  import("../organisms/Tabs/ShiftSimulatorTab").then((m) => ({
    default: m.ShiftSimulatorTab,
  })),
);
const HistoryTab = lazy(() =>
  import("../organisms/Tabs/HistoryTab").then((m) => ({
    default: m.HistoryTab,
  })),
);
const ProfileScreen = lazy(() =>
  import("../organisms/Tabs/ProfileScreen").then((m) => ({
    default: m.ProfileScreen,
  })),
);

// Refactored Tabs
import { BottomTabNavigation } from "../organisms/BottomNavigation";
import { useUnifiedSession } from "../../../hooks/useUnifiedSession";

const CalculatorApp: React.FC = () => {
  // --- 1. SESSION & PROFILE (Unified Hook Interface) ---
  const {
    isReady,
    isInitialLoading,
    isConfigured,
    user,
    sessionTrips,
    activeTab,
    setActiveTab,
    clearSession,
    deleteTrip,
  } = useUnifiedSession();

  const { initProfile } = useProfileStore();
  const { initTrips } = useCalculatorStore();

  const [showToast, setShowToast] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([activeTab]),
  );

  // Keep track of visited tabs to prevent unmounting and losing state
  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  // Initialize Supabase data on mount e interceptar cambios de sesión
  useEffect(() => {
    const initializeApp = async () => {
      await initProfile();
      await initTrips();
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
    if (isReady && isConfigured && user) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [isReady, isConfigured, user]);

  if (!isReady) {
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
      {/* Header Fijo — Manejate Branding */}
      <header className="app-header border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-md mx-auto px-6 py-5 flex justify-between items-end">
          <h1 className="text-2xl font-extrabold text-starlight tracking-tighter mb-0">
            Manejate
          </h1>
          <p className="label-hint text-[10px] mb-0.5 opacity-60">La posta de tus viajes</p>
        </div>
      </header>

      {/* Contenedor Principal de Pestañas */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24 space-y-4">
        <Suspense fallback={<TabSkeleton />}>
          {visitedTabs.has("home") && (
            <div style={{ display: activeTab === "home" ? "block" : "none" }}>
              <ShiftSimulatorTab />
            </div>
          )}

          {visitedTabs.has("trips") && (
            <div
              className="animate-in fade-in slide-in-from-right-4 duration-500"
              style={{ display: activeTab === "trips" ? "block" : "none" }}
            >
              <TripsTab />
            </div>
          )}

          {visitedTabs.has("close") && (
            <div style={{ display: activeTab === "close" ? "block" : "none" }}>
              <ShiftCloseTab onNavigateTrips={() => setActiveTab("trips")} />
            </div>
          )}

          {visitedTabs.has("history") && (
            <div
              style={{ display: activeTab === "history" ? "block" : "none" }}
            >
              <HistoryTab
                onClearHistory={() => {
                  if (confirm("¿Borrar historial del día?")) clearSession();
                }}
                onDeleteTrip={deleteTrip}
              />
            </div>
          )}

          {visitedTabs.has("profile") && (
            <div
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ display: activeTab === "profile" ? "block" : "none" }}
            >
              <ProfileScreen />
            </div>
          )}
        </Suspense>
      </main>

      {/* Motivational Toast */}
      {showToast && (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in fade-out duration-500 max-w-md mx-auto pointer-events-none">
          <div className="bg-slate/90 border-2 border-primary/30 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_var(--color-primary-glow)]">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <PartyPopper className="w-5 h-5 text-primary text-glow-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-starlight text-sm font-extrabold uppercase tracking-wider">
                ¡A romperla hoy! 🚀
              </h4>
              <p className="text-moon text-xs mt-0.5 mb-0 leading-tight">
                Ayer te ahorraste mucha plata evitando viajes trampa.
              </p>
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
