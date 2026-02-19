import React, { useState } from 'react';
import { 
  Car, DollarSign, Settings, LogOut, ChevronRight, 
  Edit3, Save, Fuel, Wrench, ShieldCheck, AlertTriangle, 
  RotateCcw, Info
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
  isHeavyTraffic: boolean;
  setIsHeavyTraffic: (value: boolean) => void;
  onSaveConfig: (config: {
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
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
  isHeavyTraffic, setIsHeavyTraffic,
  onSaveConfig, onResetAll,
  totalTrips, driverLevel
}) => {
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleToggleExpense = (id: string) => {
    const updated = expenseSettings.map(exp => 
      exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
    );
    setExpenseSettings(updated);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    onSaveConfig({
      vehicleName,
      kmPerLiter,
      maintPerKm,
      expenseSettings
    });
    setIsEditingVehicle(false);
    setHasUnsavedChanges(false);
  };

  const getExpenseIcon = (id: string) => {
    switch (id) {
      case 'fuel': return <Fuel className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'amortization': return <ShieldCheck className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="pb-32 space-y-6 animate-in fade-in duration-500">
      
      {/* Header de Perfil: Identidad Visual NODO */}
      <div className="px-4 pt-4">
        <div className="glass-card rounded-[2.5rem] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Car className="w-24 h-24" />
          </div>
          <div className="w-24 h-24 bg-nodo-petrol/20 border-2 border-nodo-petrol/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,183,189,0.2)]">
            <Car className="w-12 h-12 text-nodo-petrol" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2 italic">
            {vehicleName}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="px-3 py-1 bg-nodo-sand/20 rounded-full border border-nodo-sand/30">
              <span className="text-[10px] font-black text-nodo-sand uppercase">Nivel {driverLevel}</span>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="text-[10px] font-black text-white/40 uppercase">{totalTrips} Viajes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 1: Información Técnica del Vehículo */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Especificaciones</h3>
          <button
            onClick={() => isEditingVehicle ? handleSaveChanges() : setIsEditingVehicle(true)}
            className={`text-[10px] font-black uppercase flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
              isEditingVehicle ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-nodo-petrol'
            }`}
          >
            {isEditingVehicle ? <><Save className="w-3 h-3" /> Guardar</> : <><Edit3 className="w-3 h-3" /> Editar</>}
          </button>
        </div>
        
        <div className="glass-card rounded-3xl p-5 space-y-5">
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Modelo</p>
            {isEditingVehicle ? (
              <input
                type="text" value={vehicleName}
                onChange={(e) => { setVehicleName(e.target.value); setHasUnsavedChanges(true); }}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-nodo-petrol transition-all"
              />
            ) : (
              <div className="flex items-center gap-3 px-1">
                <Car className="w-4 h-4 text-white/20" />
                <p className="text-base font-bold text-white">{vehicleName}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Consumo (km/L)</p>
              {isEditingVehicle ? (
                <input
                  type="number" value={kmPerLiter}
                  onChange={(e) => { setKmPerLiter(Number(e.target.value)); setHasUnsavedChanges(true); }}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-nodo-petrol"
                />
              ) : (
                <div className="flex items-center gap-3 px-1">
                  <Fuel className="w-4 h-4 text-orange-500/50" />
                  <p className="text-base font-bold text-white">{kmPerLiter} <span className="text-[10px] text-white/20">KM/L</span></p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest ml-1">Mantenimiento</p>
              {isEditingVehicle ? (
                <input
                  type="number" value={maintPerKm}
                  onChange={(e) => { setMaintPerKm(Number(e.target.value)); setHasUnsavedChanges(true); }}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-nodo-petrol"
                />
              ) : (
                <div className="flex items-center gap-3 px-1">
                  <Settings className="w-4 h-4 text-nodo-sand/50" />
                  <p className="text-base font-bold text-white">${maintPerKm} <span className="text-[10px] text-white/20">/KM</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección 2: Variables de Costo (Inspirado en Onboarding) */}
      <div className="px-4">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 px-1">Algoritmo de Gastos</h3>
        <div className="glass-card rounded-3xl p-4 space-y-2">
          {expenseSettings.map((expense) => (
            <button
              key={expense.id}
              onClick={() => handleToggleExpense(expense.id)}
              className={`w-full p-4 rounded-2xl transition-all text-left border-2 flex items-center justify-between ${
                expense.enabled ? 'border-nodo-petrol/50 bg-nodo-petrol/10' : 'border-white/5 bg-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${expense.enabled ? 'bg-nodo-petrol/20 text-nodo-petrol' : 'bg-white/10 text-white/20'}`}>
                  {getExpenseIcon(expense.id)}
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tighter">{expense.label}</p>
                  <p className="text-[10px] text-white/40 font-medium">
                    {expense.id === 'fuel' && `Basado en $${fuelPrice}/L`}
                    {expense.id === 'maintenance' && `$${maintPerKm}/km de service`}
                    {expense.id === 'amortization' && `+$${(maintPerKm * 0.5).toFixed(1)}/km depreciación`}
                  </p>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${expense.enabled ? 'bg-nodo-petrol' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${expense.enabled ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
          ))}
          <div className="flex items-start gap-2 p-3 bg-white/5 rounded-xl mt-2">
            <Info className="w-4 h-4 text-nodo-petrol shrink-0 mt-0.5" />
            <p className="text-[9px] text-white/30 leading-relaxed italic">
              Configura estas variables para que el cálculo de rentabilidad sea exacto según tu realidad económica.
            </p>
          </div>
        </div>
      </div>

      {/* Botón de Guardado Flotante / Condicional */}
      {hasUnsavedChanges && (
        <div className="px-4 animate-in slide-in-from-bottom-4">
          <button
            onClick={handleSaveChanges}
            className="w-full bg-nodo-petrol text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(0,183,189,0.3)] active:scale-95 transition-all"
          >
            Sincronizar Cambios
          </button>
        </div>
      )}

      {/* Zona de Reseteo */}
      <div className="px-4 pt-6">
        <div className="p-6 border-2 border-red-500/10 rounded-[2.5rem] bg-red-500/[0.02]">
          <div className="flex items-center gap-3 mb-4 opacity-40">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Procedimiento Crítico</span>
          </div>
          <button
            onClick={() => { if(confirm('¿Seguro? Se borrará todo tu historial de NODO.')) onResetAll(); }}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all active:scale-95"
          >
            Borrar Datos de Usuario
          </button>
        </div>
      </div>

    </div>
  );
};