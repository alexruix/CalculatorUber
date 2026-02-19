import React from 'react';
import { 
  Fuel, Settings, CheckCircle2, Save, 
  Car, Wrench, ShieldCheck, DollarSign, ChevronDown 
} from 'lucide-react';
import type { ExpenseToggle } from '../../types/calculator.types';

interface ProfileSettingsProps {
  vehicleName: string;
  setVehicleName: (value: string) => void;
  kmPerLiter: number;
  setKmPerLiter: (value: number) => void;
  maintPerKm: number;
  setMaintPerKm: (value: number) => void;
  fuelPrice: number; // 👈 Agregado para persistencia
  setFuelPrice: (value: number) => void; // 👈 Agregado
  expenseSettings: ExpenseToggle[];
  setExpenseSettings: (value: ExpenseToggle[]) => void;
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
  onSave: (config: {
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
    fuelPrice: number;
    expenseSettings: ExpenseToggle[];
  }) => void;
}

/**
 * ProfileSettings - Configuración modular del ecosistema NODO
 */
export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  vehicleName, setVehicleName, 
  kmPerLiter, setKmPerLiter,
  maintPerKm, setMaintPerKm,
  fuelPrice, setFuelPrice,
  expenseSettings, setExpenseSettings,
  showSettings, setShowSettings,
  onSave
}) => {
  
  const handleToggleExpense = (id: string) => {
    const updated = expenseSettings.map(exp => 
      exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
    );
    setExpenseSettings(updated);
  };

  const handleSaveSettings = () => {
    onSave({
      vehicleName,
      kmPerLiter,
      maintPerKm,
      fuelPrice,
      expenseSettings
    });
    setShowSettings(false);
  };

  const activeExpensesCount = expenseSettings.filter(e => e.enabled).length;

  return (
    <div className={`glass-card rounded-[2rem] overflow-hidden transition-all duration-500 border border-white/10 ${showSettings ? 'shadow-2xl ring-2 ring-nodo-petrol/20' : ''}`}>
      
      {/* Header - Glanceable View */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors touch-target"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-nodo-petrol/20 rounded-xl flex items-center justify-center border border-nodo-petrol/30">
            <Car className="w-5 h-5 text-nodo-petrol" />
          </div>
          <div>
            <span className="text-sm font-black text-white italic tracking-tight">{vehicleName}</span>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
              {kmPerLiter} KM/L • {activeExpensesCount} GASTOS ACTIVOS
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-300 ${showSettings ? 'rotate-180 text-nodo-petrol' : ''}`} />
      </button>
      
      {/* Panel de Configuración */}
      {showSettings && (
        <div className="px-6 pb-6 border-t border-white/5 space-y-6 pt-6 animate-in slide-in-from-top-4 duration-300">
          
          {/* Sección 1: Especificaciones del Vehículo */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <Settings className="w-3 h-3" /> Ficha Técnica
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-white/30 uppercase ml-1">Modelo del Vehículo</label>
                <input
                  type="text" value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-nodo-petrol transition-all"
                  placeholder="Ej: Chevrolet Spin"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-white/30 uppercase ml-1">Nafta $/L</label>
                  <div className="relative">
                    <input
                      type="number" value={fuelPrice}
                      onChange={(e) => setFuelPrice(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-8 text-sm font-bold text-white outline-none focus:border-sky-500"
                    />
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-white/30 uppercase ml-1">Consumo</label>
                  <div className="relative">
                    <input
                      type="number" value={kmPerLiter}
                      onChange={(e) => setKmPerLiter(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-white outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-white/20">KM/L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Algoritmo de Rentabilidad */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
              <ShieldCheck className="w-3 h-3" /> Algoritmo de Costos
            </h4>
            
            <div className="grid grid-cols-1 gap-2">
              {expenseSettings.map((expense) => (
                <button
                  key={expense.id}
                  onClick={() => handleToggleExpense(expense.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    expense.enabled ? 'border-nodo-petrol/40 bg-nodo-petrol/10' : 'border-white/5 bg-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                      expense.enabled ? 'border-nodo-petrol bg-nodo-petrol' : 'border-white/20'
                    }`}>
                      {expense.enabled && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-tighter">{expense.label}</p>
                      <p className="text-[9px] text-white/40 font-bold">
                        {expense.id === 'fuel' && `Gasto de combustible real`}
                        {expense.id === 'maintenance' && `$${maintPerKm}/KM recorridos`}
                        {expense.id === 'amortization' && `+$${(maintPerKm * 0.5).toFixed(1)}/KM de desgaste`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botón de Sincronización */}
          <button
            onClick={handleSaveSettings}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Save className="w-4 h-4" />
            Sincronizar Perfil
          </button>
        </div>
      )}
    </div>
  );
};