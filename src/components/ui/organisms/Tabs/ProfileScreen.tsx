import React, { useState, useMemo, useCallback } from "react";
import { Search, ArrowLeft } from "lucide-react";
import type { VerticalType } from "../../../../types/calculator.types";

// Stores
import { useProfileStore } from "../../../../store/useProfileStore";
import { useCalculatorStore } from "../../../../store/useCalculatorStore";

// Atoms & Data
import { PROFILE_STRINGS } from "../../../../data/profile.data";

// Profile Sections (Molecules/Organisms)
import { ProfileIdentityHeader } from "../Profile/ProfileIdentityHeader";
import { ProfileMachineSection } from "../Profile/ProfileMachineSection";
import { ProfilePerformanceSection } from "../Profile/ProfilePerformanceSection";
import { ProfileSettingsSection } from "../Profile/ProfileSettingsSection";
import { ProfileDiscoverSection } from "../Profile/ProfileDiscoverSection";
import { ProfileSecuritySection } from "../Profile/ProfileSecuritySection";

// Modals
import { EditVehicleModal } from "../../molecules/EditVehicleModal";
import { EditExpensesModal } from "../../molecules/EditExpensesModal";

interface ToastState {
  msg: string;
  type: "success" | "info" | "warning";
}

export const ProfileScreen: React.FC = () => {
  // — Store reads —
  const {
    user,
    isPro,
    vehicleName,
    kmPerLiter,
    maintPerKm,
    fuelPrice,
    expenseSettings,
    vertical,
    dailyGoal,
    dailyHours,
    vehicleValue,
    vehicleLifetimeKm,
    amortizationPerKm,
    setProfile,
    resetProfile,
    logout,
    swapVehicle,
  } = useProfileStore();

  const { sessionTrips } = useCalculatorStore();

  // — Local state —
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingVertical, setPendingVertical] = useState<VerticalType | null>(
    null,
  );
  const [activeModal, setActiveModal] = useState<"vehicle" | "expenses" | null>(null);

  // — Today's trips —
  const todayTrips = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return sessionTrips.filter((t) => t.timestamp >= startOfDay.getTime());
  }, [sessionTrips]);

  const todayNet = useMemo(
    () => todayTrips.reduce((acc, t) => acc + t.margin, 0),
    [todayTrips],
  );

  // — Quick stats —
  const costPerKm = useMemo(() => {
    let cost = 0;
    const expenses = Array.isArray(expenseSettings) ? expenseSettings : [];
    const isFuel = expenses.find((e) => e.id === "fuel")?.enabled;
    const isMaint = expenses.find((e) => e.id === "maintenance")?.enabled;
    const isAmort = expenses.find((e) => e.id === "amortization")?.enabled;
    if (isFuel && kmPerLiter > 0) cost += fuelPrice / kmPerLiter;
    if (isMaint) cost += maintPerKm;
    if (isAmort) cost += amortizationPerKm;
    return Math.round(cost);
  }, [expenseSettings, kmPerLiter, fuelPrice, maintPerKm, amortizationPerKm]);

  const dailyProgressPct =
    dailyGoal > 0 ? Math.min(100, Math.round((todayNet / dailyGoal) * 100)) : 0;

  const efficiencyPct = useMemo(() => {
    if (kmPerLiter <= 0) return 0;
    return Math.round(((kmPerLiter - 9) / 9) * 100);
  }, [kmPerLiter]);

  const activeExpensesCount = Array.isArray(expenseSettings)
    ? expenseSettings.filter((e) => e.enabled).length
    : 0;

  // — Toast helper —
  const showToast = useCallback(
    (msg: string, type: ToastState["type"] = "success") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 2500);
    },
    [],
  );

  // — Handlers —
  const handleFieldSave = useCallback(
    (data: Parameters<typeof setProfile>[0]) => {
      setProfile(data);
      showToast(PROFILE_STRINGS.toasts.saved);
    },
    [setProfile, showToast],
  );

  const handleToggleExpense = useCallback(
    (id: string) => {
      const expenses = Array.isArray(expenseSettings) ? expenseSettings : [];
      const updated = expenses.map((e) =>
        e.id === id ? { ...e, enabled: !e.enabled } : e,
      );
      setProfile({ expenseSettings: updated });
      showToast(PROFILE_STRINGS.toasts.strategyUpdated, "info");
    },
    [expenseSettings, setProfile, showToast],
  );

  const handleVerticalSelect = useCallback(
    (v: VerticalType) => {
      if (v === vertical) return;
      setPendingVertical(v);
    },
    [vertical],
  );

  const confirmVerticalChange = useCallback(() => {
    if (!pendingVertical) return;
    setProfile({ vertical: pendingVertical });
    const msg = PROFILE_STRINGS.toasts.verticalChanged.replace(
      "{vertical}",
      pendingVertical,
    );
    setPendingVertical(null);
    showToast(msg);
  }, [pendingVertical, setProfile, showToast]);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleReset = useCallback(() => {
    resetProfile();
    localStorage.removeItem("nodo_config_v1");
    localStorage.removeItem("calculator-storage");
    window.location.reload();
  }, [resetProfile]);

  const onBack = useCallback(() => {
    // Logic for back navigation (e.g. to dashboard)
    console.log("Back pressed");
  }, []);

  const onSearch = useCallback(() => {
    console.log("Search pressed");
  }, []);

  // — Avatar and Display Name Logic —
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    PROFILE_STRINGS.header.defaultName;
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-black animate-in fade-in duration-500 overflow-x-hidden">
      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        {/* <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-starlight" />
        </button> */}

        <h1 className="text-xl font-extrabold text-starlight tracking-tight">
          Perfil
        </h1>

        <button
          onClick={onSearch}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          aria-label="Buscar"
        >
          <Search size={20} className="text-starlight" />
        </button>
      </header>

      <div className="pb-36 space-y-8">
        {/* ── TOAST ──────────────────────────────────────────────────────────── */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-wide shadow-lg animate-in fade-in slide-in-from-top-2 duration-300
              ${toast.type === "success"
                ? "bg-primary text-black box-glow-primary"
                : toast.type === "warning"
                  ? "bg-accent text-black box-glow-accent"
                  : "bg-secondary text-black box-glow-secondary"
              }
            `}
          >
            {toast.msg}
          </div>
        )}

        {/* ── VERTICAL CHANGE MODAL ──────────────────────────────────────────── */}
        {pendingVertical && (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="vertical-modal-title"
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <div className="w-full max-w-sm card-main space-y-4 animate-in slide-in-from-bottom-4 duration-300 border-2 border-primary/30 shadow-[0_0_40px_var(--color-primary-glow)]">
              <h4 id="vertical-modal-title" className="heading-3 text-center">
                {PROFILE_STRINGS.modals.verticalChange.title}
              </h4>
              <p className="label-hint text-center">
                {PROFILE_STRINGS.modals.verticalChange.hintPre}
                <strong className="text-white text-glow-primary">
                  {pendingVertical}
                </strong>
                {PROFILE_STRINGS.modals.verticalChange.hintPost}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPendingVertical(null)}
                  className="btn-ghost flex-1 py-4"
                >
                  {PROFILE_STRINGS.modals.verticalChange.cancel}
                </button>
                <button
                  onClick={confirmVerticalChange}
                  className="btn-primary flex-1 py-4"
                >
                  {PROFILE_STRINGS.modals.verticalChange.confirm}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
        <ProfileIdentityHeader
          isPro={isPro}
          avatarUrl={avatarUrl}
          displayName={displayName}
          initials={initials}
          email={user?.email}
          vehicleName={vehicleName}
          vertical={vertical}
          swapVehicle={swapVehicle}
        />

        <div className="px-4 space-y-12">
          {/* SECCIÓN: MI PERFIL */}
          <section aria-labelledby="section-machine">
            <ProfileMachineSection
              vehicleName={vehicleName}
              vertical={vertical}
              onEditVehicle={() => setActiveModal("vehicle")}
              onEditVertical={() => {
                // For now, reuse handleVerticalSelect which opens the confirmation modal
                // or we could open a full vertical selector in the future
                handleVerticalSelect(vertical === 'transport' ? 'delivery' : 'transport');
              }}
              onEditExpenses={() => setActiveModal("expenses")}
            />
          </section>

          {/* SECCIÓN: MI RENDIMIENTO */}
          <section aria-labelledby="section-performance">
            <ProfilePerformanceSection
              costPerKm={costPerKm}
              vertical={vertical}
              dailyGoal={dailyGoal}
              dailyHours={dailyHours}
              dailyProgressPct={dailyProgressPct}
              efficiencyPct={efficiencyPct}
              activeExpensesCount={activeExpensesCount}
              kmPerLiter={kmPerLiter}
              todayTrips={todayTrips}
              handleFieldSave={handleFieldSave}
            />
          </section>

          {/* SECCIÓN: DESCUBRÍ */}
          <section aria-labelledby="section-discover">
            <ProfileDiscoverSection />
          </section>

          {/* SECCIÓN: CONFIGURACIÓN */}
          <section aria-labelledby="section-settings">
            <ProfileSettingsSection />
          </section>

          {/* SECCIÓN: CUENTA (DANGER ZONE) */}
          <section aria-labelledby="section-account">
            <ProfileSecuritySection
              handleLogout={handleLogout}
              handleReset={handleReset}
            />
          </section>
        </div>

        {/* ── EDIT MODALS ───────────────────────────────────────────────────── */}
        <EditVehicleModal
          isOpen={activeModal === "vehicle"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => {
            handleFieldSave(data);
            setActiveModal(null);
          }}
          initialData={{ vehicleName, fuelPrice, kmPerLiter }}
        />

        <EditExpensesModal
          isOpen={activeModal === "expenses"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => {
            handleFieldSave(data);
            setActiveModal(null);
          }}
          initialData={{ expenseSettings, maintPerKm }}
        />

        {/* Bottom spacing for navigation */}
        <div className="h-20" />
      </div>
    </div>
  );
};
