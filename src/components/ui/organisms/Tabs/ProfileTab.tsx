import React, { useState } from 'react';
import {
  Car, DollarSign, Settings, Fuel, Wrench,
  ShieldCheck, AlertTriangle, Info, CheckCircle2
} from 'lucide-react';
import type { ExpenseToggle } from '../../../../types/calculator.types';

interface ProfileTabProps {
  vehicleName: string;
  setVehicleName: (value: string) => void;
  kmPerLiter: number;
  setKmPerLiter: (value: number) => void;
  maintPerKm: number;
  setMaintPerKm: (value: number) => void;
  fuelPrice: number;
  setFuelPrice: (value: number) => void;
  expenseSettings: ExpenseToggle[];
  setExpenseSettings: (value: ExpenseToggle[]) => void;
  onSaveConfig: (config: {
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
  }) => void;
  onResetAll: () => void;
  onLogout: () => void;
  totalTrips: number;
  driverLevel: number;
}

// ─── Metadatos de cada gasto ─────────────────────────────────────────────────
const EXPENSE_META: Record<string, { label: string; Icon: React.ElementType }> = {
  fuel: { label: 'Combustible', Icon: Fuel },
  maintenance: { label: 'Mantenimiento', Icon: Wrench },
  amortization: { label: 'Amortización', Icon: ShieldCheck },
};

// ─── Componente ──────────────────────────────────────────────────────────────
export const ProfileTab: React.FC<ProfileTabProps> = ({
  vehicleName, setVehicleName,
  kmPerLiter, setKmPerLiter,
  maintPerKm, setMaintPerKm,
  fuelPrice, setFuelPrice,
  expenseSettings, setExpenseSettings,
  onSaveConfig, onResetAll, onLogout,
  totalTrips, driverLevel,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleToggleExpense = (id: string) => {
    setExpenseSettings(
      expenseSettings.map(exp => exp.id === id ? { ...exp, enabled: !exp.enabled } : exp)
    );
  };

  const handleSave = () => {
    onSaveConfig({ vehicleName, kmPerLiter, maintPerKm, fuelPrice, expenseSettings });
    setIsEditing(false);
  };

  const handleReset = () => {
    onResetAll();
    setIsConfirmingReset(false);
  };

  // Descripción dinámica de cada gasto (depende de valores actuales)
  const expenseDescription = (id: string): string => {
    if (id === 'fuel') return 'Lo que vas gastando al andar';
    if (id === 'maintenance') return `$${maintPerKm}/km para lavado y gastos corrientes`;
    if (id === 'amortization') return 'Ahorro para llevarlo al mecánico';
    return '';
  };

  return (
    <div className="pb-32 space-y-6 animate-in fade-in duration-500">

      {/* ── 1. HERO: Chapa del Chofer ────────────────────────────────────── */}
      <div className="px-4 pt-4">
        {/*
          card-main provee: bg oscuro, blur, borde blanco/8, rounded-[2rem], p-8, shadow.
          Se agrega text-center como layout específico de esta card.
        */}
        <div className="card-main text-center">
          {/* Ícono decorativo de fondo */}
          <Car
            className="absolute top-4 right-4 w-24 h-24 text-white/[0.04] pointer-events-none"
            aria-hidden="true"
          />

          {/* Avatar del vehículo — más grande que icon-wrap-lg, se define custom */}
          <div
            className="w-20 h-20 bg-nodo-petrol/20 border-2 border-nodo-petrol/40 rounded-3xl
                       flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 0 30px rgba(0,183,189,0.15)' }}
            aria-hidden="true"
          >
            <Car className="w-10 h-10 text-nodo-petrol" />
          </div>

          {/* heading-2 provee: text-2xl font-black text-white tracking-tight leading-tight */}
          <h2 className="heading-2 mb-4">
            {vehicleName || 'Tu Máquina'}
          </h2>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/*
              badge-warning: amber — más cercano visualmente a nodo-sand
              badge-neutral: estado informativo sin semántica de color
            */}
            <span className="badge-warning">
              Chofer Nivel {driverLevel}
            </span>
            <span className="badge-neutral">
              {totalTrips} {totalTrips === 1 ? 'viaje' : 'viajes'} hechos
            </span>
          </div>
        </div>
      </div>


      {/* ── 2. CONFIGURACIÓN TÉCNICA ─────────────────────────────────────── */}
      <section className="px-4" aria-labelledby="config-heading">
        <div className="flex items-center justify-between mb-4 px-1">
          {/*
            heading-3: text-base font-black text-white uppercase tracking-[0.12em]
            Se agrega flex + gap para el ícono acompañante.
          */}
          <h3 id="config-heading" className="heading-3 flex items-center gap-2">
            <Settings className="w-4 h-4" aria-hidden="true" />
            Configuración
          </h3>

          {/*
            Botón inline: btn-primary / btn-secondary tienen w-full por defecto.
            !w-auto sobreescribe ese valor para que sea de ancho contenido.
            py-2.5 reemplaza el py-4 del sistema para un botón más compacto en header.
          */}
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            aria-pressed={isEditing}
            className={
              isEditing
                ? 'btn-primary !w-auto !py-2.5 !min-h-0'
                : 'btn-secondary !w-auto !py-2.5 !min-h-0'
            }
          >
            {isEditing ? 'Guardar' : 'Editar datos'}
          </button>
        </div>

        {/* card-main como contenedor de los inputs */}
        <div className="card-main space-y-5">

          {/* Fila 1: Nombre del vehículo + Precio de nafta */}
          <div className="grid grid-cols-2 gap-4">
            {/* campo-field: label asociado por htmlFor/id */}
            <div className="field-wrapper">
              <label htmlFor="vehicle-name" className="label-base">
                Tu vehículo
              </label>
              <input
                id="vehicle-name"
                type="text"
                value={vehicleName}
                onChange={e => setVehicleName(e.target.value)}
                placeholder="Ej: Chevrolet Spin"
                disabled={!isEditing}
                autoComplete="off"
                spellCheck={false}
                className="input-base input-focus text-sm"
              />
            </div>

            <div className="field-wrapper">
              <label htmlFor="fuel-price" className="label-base">
                Nafta / GNC ($/L)
              </label>
              <div className="field-input-wrapper">
                {/* field-icon-left: posicionado absolute, pointer-events-none */}
                <DollarSign className="field-icon-left" aria-hidden="true" />
                <input
                  id="fuel-price"
                  type="number"
                  inputMode="decimal"
                  value={fuelPrice}
                  onChange={e => setFuelPrice(Number(e.target.value))}
                  min="1"
                  step="10"
                  disabled={!isEditing}
                  className="input-base input-focus text-sm pl-11"
                />
              </div>
            </div>
          </div>

          {/* Fila 2: Consumo + Mantenimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="field-wrapper">
              <label htmlFor="km-per-liter" className="label-base">
                Consumo (km/L)
              </label>
              <div className="field-input-wrapper">
                <input
                  id="km-per-liter"
                  type="number"
                  inputMode="decimal"
                  value={kmPerLiter}
                  onChange={e => setKmPerLiter(Number(e.target.value))}
                  min="1"
                  max="50"
                  step="0.5"
                  disabled={!isEditing}
                  className="input-base input-focus text-sm pr-11"
                />
                {/* Ícono derecho — posicionado manual porque field-icon-left es izquierda */}
                <Fuel
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="field-wrapper">
              <label htmlFor="maint-per-km" className="label-base">
                Gastos ($/km)
              </label>
              <div className="field-input-wrapper">
                <input
                  id="maint-per-km"
                  type="number"
                  inputMode="decimal"
                  value={maintPerKm}
                  onChange={e => setMaintPerKm(Number(e.target.value))}
                  min="0"
                  step="1"
                  disabled={!isEditing}
                  className="input-base input-focus text-sm pr-11"
                />
                <Wrench
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── 3. CÁLCULO DE GASTOS ─────────────────────────────────────────── */}
      <section className="px-4" aria-labelledby="expenses-heading">
        <h3 id="expenses-heading" className="heading-3 px-1 mb-4">
          Cálculo de gastos
        </h3>

        <div className="card-main space-y-3">
          {/*
            fieldset semántico: agrupa los toggles como un grupo de controles relacionados.
            legend visible sólo para screen readers (sr-only).
          */}
          <fieldset className="space-y-3 border-0 p-0 m-0">
            <legend className="sr-only">Selección de gastos a incluir en el cálculo</legend>

            {expenseSettings.map(expense => {
              const meta = EXPENSE_META[expense.id];
              const Icon = meta?.Icon ?? Fuel;
              const isOn = expense.enabled;
              const descId = `expense-desc-${expense.id}`;

              return (
                <button
                  key={expense.id}
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  aria-describedby={descId}
                  onClick={() => handleToggleExpense(expense.id)}
                  className={isOn ? 'toggle-row-on' : 'toggle-row-off'}
                >
                  <div className="flex items-center gap-4">
                    {/*
                      icon-wrap-md: w-10 h-10 rounded-xl border flex items-center justify-center shrink-0
                      icon-wrap-accent (activo) / icon-wrap-neutral (inactivo)
                    */}
                    <div
                      className={`icon-wrap-md ${isOn ? 'icon-wrap-accent' : 'icon-wrap-neutral'}`}
                      aria-hidden="true"
                    >
                      <Icon
                        size={18}
                        className={isOn ? 'text-sky-300' : 'text-white/40'}
                      />
                    </div>

                    <div>
                      {/* toggle-label-on/off: text-[13px] font-black uppercase tracking-tight */}
                      <p className={isOn ? 'toggle-label-on' : 'toggle-label-off'}>
                        {meta?.label ?? expense.id}
                      </p>
                      {/* toggle-desc-on/off: text-xs font-medium */}
                      <p id={descId} className={isOn ? 'toggle-desc-on' : 'toggle-desc-off'}>
                        {expenseDescription(expense.id)}
                      </p>
                    </div>
                  </div>

                  {/*
                    toggle-indicator-on/off: cuadrado visual del estado.
                    El aria-checked del button padre ya comunica el estado al lector.
                    Este div es aria-hidden.
                  */}
                  <div
                    className={isOn ? 'toggle-indicator-on' : 'toggle-indicator-off'}
                    aria-hidden="true"
                  >
                    {isOn && (
                      // BUG CORREGIDO: text-black no es prop de React, debe ser className
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </fieldset>

          {/*
            feedback-info: flex items-start gap-2 text-xs font-semibold leading-relaxed text-sky-400
            Usamos role="note" en lugar de "alert" porque es información estática, no reactiva.
          */}
          <div role="note" className="flex items-start gap-3 p-4 bg-white/[0.03] rounded-2xl border border-white/[0.07]">
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="feedback-info">
              Estos ajustes modifican los umbrales de rentabilidad en tiempo real en tu calculadora.
            </p>
          </div>
        </div>
      </section>


      {/* ── 4. ZONA DE CUENTA ──────────────────────────────────────── */}
      <section
        className="px-4 pt-6 pb-10 space-y-4"
        aria-labelledby="account-heading"
      >
        <h3 id="account-heading" className="heading-3 px-1 mb-4 text-white/50">
          Cuenta
        </h3>

        {/* Botón de Cerrar Sesión (Acción segura) */}
        <button
          onClick={onLogout}
          className="btn-secondary w-full"
        >
          Cerrar Sesión
        </button>

        {/* Zona Peligrosa */}
        <div className="p-8 border-2 border-red-500/20 rounded-[2.5rem] bg-red-500/[0.03] text-center mt-6">
          <AlertTriangle
            className="w-8 h-8 text-red-400 mx-auto mb-4"
            aria-hidden="true"
          />

          <h4
            id="danger-heading"
            className="text-sm font-black text-red-400 uppercase tracking-widest mb-2"
          >
            Eliminar cuenta
          </h4>

          <p className="label-hint mb-8">
            Esta acción eliminará permanentemente tu configuración y todos los viajes guardados.
          </p>

          {!isConfirmingReset ? (
            <button
              onClick={() => setIsConfirmingReset(true)}
              className="btn-danger"
            >
              Borrar todo
            </button>
          ) : (
            <div className="space-y-3" role="alertdialog" aria-labelledby="danger-heading">
              <p className="text-sm font-black text-red-300">
                ¿Estás seguro? No hay vuelta atrás.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmingReset(false)}
                  className="btn-ghost"
                  autoFocus
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="btn-danger"
                >
                  Sí, borrar todo
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};