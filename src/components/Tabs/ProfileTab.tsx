import React, { useState } from 'react';
import {
  Car, DollarSign, Settings, Save,
  Fuel, Wrench, ShieldCheck, AlertTriangle,
  Info, ChevronRight, CheckCircle2
} from 'lucide-react';
import type { ExpenseToggle } from '../../types/calculator.types';

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
  totalTrips: number;
  driverLevel: number;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  vehicleName, setVehicleName,
  kmPerLiter, setKmPerLiter,
  maintPerKm, setMaintPerKm,
  fuelPrice, setFuelPrice,
  expenseSettings, setExpenseSettings,
  onSaveConfig, onResetAll,
  totalTrips, driverLevel
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleExpense = (id: string) => {
    const updated = expenseSettings.map(exp =>
      exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
    );
    setExpenseSettings(updated);
  };

  const handleSave = () => {
    onSaveConfig({
      vehicleName,
      kmPerLiter,
      maintPerKm,
      fuelPrice,
      expenseSettings
    });
    setIsEditing(false);
  };

  return (
    <div className="pb-32 space-y-6 animate-in fade-in duration-500">

      {/* 1. HERO SECTION: La Chapa del Chofer */}
      <div className="px-4 pt-4">
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Car className="w-24 h-24" />
          </div>
          <div className="w-20 h-20 bg-nodo-petrol/20 border-2 border-nodo-petrol/40 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,183,189,0.15)]">
            <Car className="w-10 h-10 text-nodo-petrol" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-3">
            {vehicleName || "Tu Máquina"}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="px-4 py-1.5 bg-nodo-sand/20 rounded-full">
              <span className="text-xs font-black text-nodo-sand uppercase tracking-wider">Chofer Nivel {driverLevel}</span>
            </div>
            <div className="px-4 py-1.5 bg-white/10 rounded-full border border-white/10">
              <span className="text-xs font-black text-white/70 uppercase tracking-wider">{totalTrips} Viajes hechos</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONFIGURACIÓN TÉCNICA: Los Números del Auto */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xs font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-4 h-4" /> Configuración
          </h3>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase transition-all ${isEditing ? 'bg-green-500 text-black' : 'bg-nodo-petrol/20 text-nodo-petrol border border-nodo-petrol/30'
              }`}
          >
            {isEditing ? 'Listo, Guardar' : 'Cambiar datos'}
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
          {/* Fila 1: Nombre y Precio Nafta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wide">Tu vehiculo</label>
              <input
                disabled={!isEditing}
                type="text" value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="Ej: Chevrolet Spin"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-nodo-petrol disabled:opacity-50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wide">Nafta/GNC ($/L)</label>
              <div className="relative">
                <input
                  disabled={!isEditing}
                  type="number" value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 pl-10 text-sm font-bold text-white outline-none focus:border-nodo-petrol disabled:opacity-50"
                />
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>
          </div>

          {/* Fila 2: Consumo y Mantenimiento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wide">Combustible (KM/L)</label>
              <div className="relative">
                <input
                  disabled={!isEditing}
                  type="number" value={kmPerLiter}
                  onChange={(e) => setKmPerLiter(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 pr-10 text-sm font-bold text-white outline-none focus:border-nodo-petrol disabled:opacity-50"
                />
                <Fuel className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-wide">Gastos corrientes ($/KM)</label>
              <div className="relative">
                <input
                  disabled={!isEditing}
                  type="number" value={maintPerKm}
                  onChange={(e) => setMaintPerKm(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 pr-10 text-sm font-bold text-white outline-none focus:border-nodo-petrol disabled:opacity-50"
                />
                <Wrench className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ALGORITMO DE GASTOS: Qué estamos descontando */}
      <div className="px-4">
        <h3 className="text-xs font-black text-white/60 uppercase tracking-widest mb-4 px-2">Calculo de gastos</h3>
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3">
          {expenseSettings.map((expense) => (
            <button
              key={expense.id}
              onClick={() => handleToggleExpense(expense.id)}
              className={`w-full p-4 rounded-2xl transition-all text-left border-2 flex items-center justify-between ${expense.enabled ? 'border-nodo-petrol bg-nodo-petrol/5' : 'border-white/5 bg-white/5'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${expense.enabled ? 'bg-nodo-petrol text-black' : 'bg-white/10 text-white/40'}`}>
                  {expense.id === 'fuel' ? <Fuel size={18} /> : expense.id === 'maintenance' ? <Wrench size={18} /> : <ShieldCheck size={18} />}
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tight">
                    {expense.id === 'fuel' ? 'Combustible' : expense.id === 'maintenance' ? 'Mantenimiento' : 'Amortización'}
                  </p>
                  <p className="text-xs text-white/50 font-medium mt-0.5">
                    {expense.id === 'fuel' && `Lo que vas gastando al andar`}
                    {expense.id === 'maintenance' && `Ahorro de $${maintPerKm}/km para lavado y gastos corrientes del auto.`}
                    {expense.id === 'amortization' && `Ahorro para y llevarlo al mecánico`}
                  </p>
                </div>
              </div>
              <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${expense.enabled ? 'border-nodo-petrol bg-nodo-petrol' : 'border-white/20'
                }`}>
                {expense.enabled && <CheckCircle2 size={14} text-black />}
              </div>
            </button>
          ))}

          <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 mt-2">
            <Info className="w-5 h-5 text-nodo-petrol shrink-0" />
            <p className="text-xs text-white/60 leading-relaxed font-medium">
              Estos ajustes modifican los umbrales de rentabilidad en tiempo real en tu calculadora.            </p>
          </div>
        </div>
      </div>

      {/* 4. ZONA CRÍTICA: Reseteo */}
      <div className="px-4 pt-10 pb-10">
        <div className="p-8 border-2 border-red-500/20 rounded-[2.5rem] bg-red-500/[0.03] text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h4 className="text-sm font-black text-red-500 uppercase tracking-widest mb-2">Eliminar cuenta</h4>
          <p className="text-xs text-white/40 mb-8 font-medium">Esta acción eliminará permanentemente tu configuración y todos los viajes guardados.</p>
          <button
            onClick={() => confirm('¿Seguro querés volar todo a la mierda? No hay vuelta atrás, eh.') && onResetAll()}
            className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            Sí, Borrar Todo
          </button>
        </div>
      </div>

    </div>
  );
};