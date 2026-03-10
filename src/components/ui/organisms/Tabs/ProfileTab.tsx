import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Settings,
  Fuel,
  Wrench,
  DollarSign,
  ChevronDown,
  ChevronUp,
  LogOut,
  AlertTriangle,
  Target,
  Sparkles,
  Star,
  Car,
  Bike,
  Truck,
  CheckCircle2,
  Copy,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import type { VerticalType } from "../../../../types/calculator.types";

// Stores
import { useProfileStore } from "../../../../store/useProfileStore";
import { useCalculatorStore } from "../../../../store/useCalculatorStore";

// Molecules
import { VehicleIdentityCard } from "../../molecules/VehicleIdentityCard";
import { ExpenseMasterToggles } from "../../molecules/ExpenseMasterToggles";
import { DailyGoalTracker } from "../../molecules/DailyGoalTracker";
import { ProfileInsightCard } from "../../molecules/ProfileInsightCard";

// ─── Types ───────────────────────────────────────────────────────────────────

type Section = "machine" | "strategy" | "goals" | "account";

interface ToastState {
  msg: string;
  type: "success" | "info" | "warning";
}

// ─── Vertical Selector ───────────────────────────────────────────────────────

const VERTICALS: Array<{
  id: VerticalType;
  label: string;
  sub: string;
  Icon: React.ElementType;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}> = [
    {
      id: "transport",
      label: "Transporte",
      sub: "Uber / Cabify",
      Icon: Car,
      accentBg: "bg-green-500/15",
      accentBorder: "border-green-500/40",
      accentText: "text-green-400",
    },
    {
      id: "delivery",
      label: "Delivery",
      sub: "Rappi / Pedidos",
      Icon: Bike,
      accentBg: "bg-orange-500/15",
      accentBorder: "border-orange-500/40",
      accentText: "text-orange-400",
    },
    {
      id: "logistics",
      label: "Logística",
      sub: "Flete / Envíos",
      Icon: Truck,
      accentBg: "bg-sky-500/15",
      accentBorder: "border-sky-500/40",
      accentText: "text-sky-400",
    },
  ];

// ─── Section Header component ────────────────────────────────────────────────

const SectionHeader: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  open: boolean;
  onToggle: () => void;
}> = ({ id, icon, title, badge, open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    aria-controls={`section-body-${id}`}
    className="w-full flex items-center justify-between px-1 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
  >
    <h3 className="heading-3 flex items-center gap-2">
      {icon}
      {title}
      {badge && <span className="badge-accent ml-1">{badge}</span>}
    </h3>
    <div className="text-white/40" aria-hidden="true">
      {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
  </button>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const ProfileTab: React.FC = () => {
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
    secondaryVehicle,
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
  const [openSection, setOpenSection] = useState<Section | null>("machine");
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [pendingVertical, setPendingVertical] = useState<VerticalType | null>(
    null,
  );

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
    const isMaint = expenses.find(
      (e) => e.id === "maintenance",
    )?.enabled;
    const isAmort = expenses.find(
      (e) => e.id === "amortization",
    )?.enabled;
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
      showToast("Datos guardados ✓");
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
      showToast("Estrategia actualizada", "info");
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
    setPendingVertical(null);
    showToast(`Vertical cambiada a ${pendingVertical} ✓`);
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

  const toggleSection = (s: Section) =>
    setOpenSection((prev) => (prev === s ? null : s));

  // ─── Avatar ────────────────────────────────────────────────────────────────
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Driver";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="pb-36 space-y-5 animate-in fade-in duration-500">
      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-black uppercase tracking-wide shadow-lg animate-in fade-in slide-in-from-top-2 duration-300
            ${toast.type === "success" ? "bg-green-500 text-black" : toast.type === "warning" ? "bg-amber-500 text-black" : "bg-sky-500 text-black"}
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
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm card-main space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <h4 id="vertical-modal-title" className="heading-3 text-center">
              Cambiar vertical
            </h4>
            <p className="label-hint text-center">
              Vas a cambiar a{" "}
              <strong className="text-white">{pendingVertical}</strong>. Los
              valores de La Máquina se mantienen. ¿Confirmás?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingVertical(null)}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button onClick={confirmVerticalChange} className="btn-primary">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          HEADER — Identity
      ════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 pt-2">
        <div className="card-main text-center relative overflow-hidden">
          {/* Decorative glow bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background: isPro
                ? "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
            }}
          />

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Foto de ${displayName}`}
                className={`w-20 h-20 rounded-3xl object-cover border-2 mx-auto ${isPro ? "border-sky-400" : "border-white/20"
                  }`}
                style={
                  isPro ? { boxShadow: "0 0 20px rgba(14,165,233,0.4)" } : {}
                }
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border-2 text-2xl font-black text-white ${isPro
                  ? "bg-sky-500/20 border-sky-400"
                  : "bg-white/10 border-white/20"
                  }`}
                style={
                  isPro ? { boxShadow: "0 0 20px rgba(14,165,233,0.4)" } : {}
                }
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
            {isPro && (
              <span
                className="absolute -bottom-2 -right-2 badge-accent text-[9px] px-2 py-1 border-black border-2"
                aria-label="Usuario PRO"
              >
                PRO ⭐
              </span>
            )}
          </div>

          <h2 className="heading-2 mb-1">{displayName}</h2>
          {user?.email && <p className="label-hint mb-4">{user.email}</p>}

          {/* Vehicle identity */}
          <VehicleIdentityCard vehicleName={vehicleName} vertical={vertical} />

          {/* Quick Swapper (PRO) */}
          {isPro && (
            <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in duration-500">
              <button
                onClick={swapVehicle}
                className="w-full flex items-center justify-center gap-2 bg-info/10 hover:bg-info/20 border border-info/30 text-info py-3 px-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
              >
                <RefreshCw className="w-4 h-4" />
                Cambiar a modo {vertical === "transport" ? "Reparto" : "Transporte"}
              </button>
              <p className="text-[10px] text-white/30 mt-2 font-medium">Alterná entre perfiles con sus propios costos al instante.</p>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          QUICK-STATS GRID (2×2)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="px-4">
        <div
          className="grid grid-cols-2 gap-3"
          role="list"
          aria-label="Métricas rápidas del perfil"
        >
          {/* Card 1: Costo/KM */}
          <div className="card-metric" role="listitem">
            <p className="caption mb-1">Costo / KM</p>
            <p className="text-2xl font-black text-white">${costPerKm}</p>
            <p className="label-hint mt-1">
              {Array.isArray(expenseSettings) ? expenseSettings.filter((e) => e.enabled).length : 0} gastos activos
            </p>
          </div>

          {/* Card 2: Vertical actual */}
          <div className="card-metric" role="listitem">
            <p className="caption mb-1">Vertical</p>
            <div className="flex flex-col items-center gap-1">
              {vertical === "transport" && (
                <Car
                  size={22}
                  className="text-green-400 mb-0.5"
                  aria-hidden="true"
                />
              )}
              {vertical === "delivery" && (
                <Bike
                  size={22}
                  className="text-orange-400 mb-0.5"
                  aria-hidden="true"
                />
              )}
              {vertical === "logistics" && (
                <Truck
                  size={22}
                  className="text-sky-400 mb-0.5"
                  aria-hidden="true"
                />
              )}
              {!vertical && (
                <Settings
                  size={22}
                  className="text-white/30 mb-0.5"
                  aria-hidden="true"
                />
              )}
              <p className="text-sm font-black text-white capitalize">
                {vertical === "transport" ? "Transporte" : vertical === "delivery" ? "Reparto" : vertical === "logistics" ? "Logística" : "Sin config"}
              </p>
            </div>
          </div>

          {/* Card 3: Meta del día % */}
          <div className="card-metric" role="listitem">
            <p className="caption mb-1">Meta del día</p>
            {dailyGoal > 0 ? (
              <>
                <p
                  className={`text-2xl font-black ${dailyProgressPct >= 100 ? "text-green-400" : "text-white"}`}
                >
                  {dailyProgressPct}%
                </p>
                <div className="progress-track mt-2" aria-hidden="true">
                  <div
                    className={
                      dailyProgressPct >= 100
                        ? "progress-fill-success"
                        : "progress-fill-default"
                    }
                    style={{ width: `${dailyProgressPct}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-white/30 font-bold">Sin meta</p>
            )}
          </div>

          {/* Card 4: Eficiencia */}
          <div className="card-metric" role="listitem">
            <p className="caption mb-1">Eficiencia</p>
            <p
              className={`text-2xl font-black ${efficiencyPct > 0
                ? "text-green-400"
                : efficiencyPct < -5
                  ? "text-amber-400"
                  : "text-white"
                }`}
            >
              {efficiencyPct > 0 ? "+" : ""}
              {efficiencyPct}%
            </p>
            <p className="label-hint mt-1">vs promedio</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MODULE A — La Máquina
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4" aria-labelledby="section-machine">
        <SectionHeader
          id="machine"
          icon={<Fuel size={16} aria-hidden="true" />}
          title="La Máquina"
          open={openSection === "machine"}
          onToggle={() => toggleSection("machine")}
        />

        {openSection === "machine" && (
          <div
            id="section-body-machine"
            className="card-main space-y-5 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {/* Row 1: Vehicle name + fuel price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="field-wrapper">
                <label htmlFor="profile-vehicle-name" className="label-base">
                  Tu vehículo
                </label>
                <input
                  id="profile-vehicle-name"
                  type="text"
                  defaultValue={vehicleName}
                  onBlur={(e) =>
                    handleFieldSave({ vehicleName: e.target.value })
                  }
                  placeholder="Ej: Spin 1.8"
                  autoComplete="off"
                  spellCheck={false}
                  className="input-base input-focus text-sm"
                />
              </div>

              <div className="field-wrapper">
                <label htmlFor="profile-fuel-price" className="label-base">
                  Nafta / GNC ($/L)
                </label>
                <div className="field-input-wrapper">
                  <DollarSign className="field-icon-left" aria-hidden="true" />
                  <input
                    id="profile-fuel-price"
                    type="number"
                    inputMode="decimal"
                    defaultValue={fuelPrice}
                    onBlur={(e) =>
                      handleFieldSave({ fuelPrice: Number(e.target.value) })
                    }
                    min="1"
                    step="any"
                    className="input-base input-focus text-sm pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: KM/L + Maint/KM */}
            <div className="grid grid-cols-2 gap-4">
              <div className="field-wrapper">
                <label htmlFor="profile-km-liter" className="label-base">
                  Consumo (km/L)
                </label>
                <div className="field-input-wrapper">
                  <input
                    id="profile-km-liter"
                    type="number"
                    inputMode="decimal"
                    defaultValue={kmPerLiter}
                    onBlur={(e) =>
                      handleFieldSave({ kmPerLiter: Number(e.target.value) })
                    }
                    min="1"
                    max="50"
                    step="0.5"
                    className="input-base input-focus text-sm pr-11"
                  />
                  <Fuel
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="field-wrapper">
                <label htmlFor="profile-maint-km" className="label-base">
                  Gastos ($/km)
                </label>
                <div className="field-input-wrapper">
                  <input
                    id="profile-maint-km"
                    type="number"
                    inputMode="decimal"
                    defaultValue={maintPerKm}
                    onBlur={(e) =>
                      handleFieldSave({ maintPerKm: Number(e.target.value) })
                    }
                    min="0"
                    step="1"
                    className="input-base input-focus text-sm pr-11"
                  />
                  <Wrench
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Amortization (Vehicle Value & Lifetime) */}
            <div className="rounded-2xl border border-white/5 bg-white/2 p-4 space-y-4">
              <p className="text-xs font-black text-white/30 uppercase tracking-widest">Amortización <span className="text-white/15">(opcional)</span></p>
              <div className="grid grid-cols-2 gap-4">
                <div className="field-wrapper">
                  <label htmlFor="profile-vehicle-value" className="label-base">
                    Valor del Vehículo
                  </label>
                  <div className="field-input-wrapper">
                    <DollarSign className="field-icon-left" aria-hidden="true" />
                    <input
                      id="profile-vehicle-value"
                      type="number"
                      inputMode="decimal"
                      defaultValue={vehicleValue}
                      onBlur={(e) =>
                        handleFieldSave({ vehicleValue: Number(e.target.value) })
                      }
                      min="0"
                      className="input-base input-focus text-sm pl-11"
                      placeholder="3000000"
                    />
                  </div>
                </div>

                <div className="field-wrapper">
                  <label htmlFor="profile-vehicle-lifetime" className="label-base">
                    Vida útil (km)
                  </label>
                  <div className="field-input-wrapper">
                    <input
                      id="profile-vehicle-lifetime"
                      type="number"
                      inputMode="decimal"
                      defaultValue={vehicleLifetimeKm}
                      onBlur={(e) =>
                        handleFieldSave({ vehicleLifetimeKm: Number(e.target.value) })
                      }
                      min="1"
                      className="input-base input-focus text-sm pr-11"
                      placeholder="200000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="label-hint text-center">
              Los campos se guardan automáticamente al salir de cada campo.
            </p>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MODULE B — Estrategia
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4" aria-labelledby="section-strategy">
        <SectionHeader
          id="strategy"
          icon={<Sparkles size={16} aria-hidden="true" />}
          title="Estrategia"
          open={openSection === "strategy"}
          onToggle={() => toggleSection("strategy")}
        />

        {openSection === "strategy" && (
          <div
            id="section-body-strategy"
            className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {/* Vertical selector */}
            <div className="card-main space-y-4">
              <p className="label-base">Vertical activa</p>
              <div
                className="grid grid-cols-3 gap-2.5"
                role="radiogroup"
                aria-label="Selección de vertical"
              >
                {VERTICALS.map((v) => {
                  const isActive = vertical === v.id;
                  const { Icon } = v;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => handleVerticalSelect(v.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                        ${isActive
                          ? `${v.accentBg} ${v.accentBorder}`
                          : "bg-white/3 border-white/8 hover:bg-white/10"
                        }`}
                    >
                      <Icon
                        size={22}
                        className={isActive ? v.accentText : "text-white/30"}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "text-white" : "text-white/40"}`}
                      >
                        {v.label}
                      </span>
                      <span
                        className={`text-[9px] font-bold ${isActive ? "text-white/60" : "text-white/20"}`}
                      >
                        {v.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expense Master Toggles */}
            <div className="card-main">
              <ExpenseMasterToggles
                expenseSettings={expenseSettings}
                kmPerLiter={kmPerLiter}
                fuelPrice={fuelPrice}
                maintPerKm={maintPerKm}
                amortizationPerKm={amortizationPerKm}
                onToggle={handleToggleExpense}
              />
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          MODULE C — Objetivos [NEW]
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4" aria-labelledby="section-goals">
        <SectionHeader
          id="goals"
          icon={<Target size={16} aria-hidden="true" />}
          title="Objetivos"
          badge="NUEVO"
          open={openSection === "goals"}
          onToggle={() => toggleSection("goals")}
        />

        {openSection === "goals" && (
          <div
            id="section-body-goals"
            className="card-main animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <DailyGoalTracker
              dailyGoal={dailyGoal}
              dailyHours={dailyHours}
              todayTrips={todayTrips}
              onGoalChange={(v) => handleFieldSave({ dailyGoal: v })}
              onHoursChange={(v) => handleFieldSave({ dailyHours: v })}
            />
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PROFILE INSIGHT (Ego-driven UX)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="px-4">
        <ProfileInsightCard kmPerLiter={kmPerLiter} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MODULE D — Cuenta
      ════════════════════════════════════════════════════════════════════ */}
      <section className="px-4" aria-labelledby="section-account">
        <SectionHeader
          id="account"
          icon={<Settings size={16} aria-hidden="true" />}
          title="Cuenta"
          open={openSection === "account"}
          onToggle={() => toggleSection("account")}
        />

        {openSection === "account" && (
          <div
            id="section-body-account"
            className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {/* Action list */}
            <div className="card-main space-y-3">
              {/* Logout */}
              <button onClick={handleLogout} className="btn-secondary">
                <LogOut size={16} aria-hidden="true" />
                Cerrar Sesión
              </button>
            </div>

            {/* Danger Zone */}
            <div className="p-6 border-2 border-red-500/20 rounded-4xl bg-red-500/3 text-center">
              <AlertTriangle
                className="w-7 h-7 text-red-400 mx-auto mb-3"
                aria-hidden="true"
              />
              <h4
                id="danger-heading"
                className="text-sm font-black text-red-400 uppercase tracking-widest mb-2"
              >
                Zona de peligro
              </h4>
              <p className="label-hint mb-6">
                Esto eliminará permanentemente tu configuración y todos los
                viajes guardados. Sin vuelta atrás.
              </p>

              {!isConfirmingReset ? (
                <button
                  onClick={() => setIsConfirmingReset(true)}
                  className="btn-danger"
                >
                  Borrar todo
                </button>
              ) : (
                <div
                  className="space-y-3"
                  role="alertdialog"
                  aria-labelledby="danger-heading"
                >
                  <p className="text-sm font-black text-red-300">
                    ¿Estás 100% seguro? No hay vuelta atrás.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsConfirmingReset(false)}
                      className="btn-ghost"
                      autoFocus
                    >
                      Cancelar
                    </button>
                    <button onClick={handleReset} className="btn-danger">
                      Sí, borrar todo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
