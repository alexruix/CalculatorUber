import React from 'react';
import { Fuel, Settings, CheckCircle2, Save } from 'lucide-react';
import type { ExpenseToggle } from '../../types/calculator.types';

interface ProfileSettingsProps {
  vehicleName: string;
  setVehicleName: (value: string) => void;
  kmPerLiter: number;
  setKmPerLiter: (value: number) => void;
  maintPerKm: number;
  setMaintPerKm: (value: number) => void;
  expenseSettings: ExpenseToggle[];
  setExpenseSettings: (value: ExpenseToggle[]) => void;
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
  onSave: (config: {
    vehicleName: string;
    kmPerLiter: number;
    maintPerKm: number;
    expenseSettings: ExpenseToggle[];
  }) => void;
}

/**
 * Componente mejorado de configuración de perfil
 * Permite editar: vehículo, consumo, mantenimiento, y variables de costos
 */
export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  vehicleName, 
  setVehicleName, 
  kmPerLiter, 
  setKmPerLiter,
  maintPerKm,
  setMaintPerKm,
  expenseSettings,
  setExpenseSettings,
  showSettings, 
  setShowSettings,
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
      expenseSettings
    });
    setShowSettings(false);
  };

  // Calcular cuántos gastos están activos
  const activeExpensesCount = expenseSettings.filter(e => e.enabled).length;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      
      {/* Header - Toggle para mostrar/ocultar settings */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors touch-target"
        aria-expanded={showSettings}
        aria-controls="profile-settings-panel"
      >
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-orange-500" />
          <div>
            <span className="text-sm font-bold text-white">{vehicleName}</span>
            <p className="text-[10px] text-white/40">
              {kmPerLiter} km/L • {activeExpensesCount} {activeExpensesCount === 1 ? 'variable' : 'variables'}
            </p>
          </div>
        </div>
        <Settings className={`w-4 h-4 text-white/40 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
      </button>
      
      {/* Panel de configuración (colapsable) */}
      {showSettings && (
        <div 
          id="profile-settings-panel"
          className="px-4 pb-4 border-t border-white/10 space-y-4 pt-4"
        >
          
          {/* Sección: Datos del Vehículo */}
          <div>
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Fuel className="w-3 h-3" />
              Datos del Vehículo
            </h4>
            
            {/* Input de Nombre del Vehículo */}
            <div className="mb-3">
              <label 
                htmlFor="vehicle-name-input" 
                className="text-[10px] text-white/40 uppercase font-bold block mb-1"
              >
                Nombre del Vehículo
              </label>
              <input
                id="vehicle-name-input"
                type="text"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                placeholder="Ej: Chevrolet Spin 2018"
              />
            </div>
            
            {/* Grid: Consumo y Mantenimiento */}
            <div className="grid grid-cols-2 gap-3">
              {/* Input de Consumo */}
              <div>
                <label 
                  htmlFor="fuel-consumption-input" 
                  className="text-[10px] text-white/40 uppercase font-bold block mb-1"
                >
                  Consumo (km/L)
                </label>
                <input
                  id="fuel-consumption-input"
                  type="number"
                  value={kmPerLiter}
                  onChange={(e) => setKmPerLiter(Number(e.target.value))}
                  className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                  min="1"
                  step="0.1"
                  placeholder="9"
                />
              </div>
              
              {/* Input de Mantenimiento */}
              <div>
                <label 
                  htmlFor="maintenance-cost-input" 
                  className="text-[10px] text-white/40 uppercase font-bold block mb-1"
                >
                  Mant. ($/km)
                </label>
                <input
                  id="maintenance-cost-input"
                  type="number"
                  value={maintPerKm}
                  onChange={(e) => setMaintPerKm(Number(e.target.value))}
                  className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                  min="0"
                  step="1"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Sección: Variables de Costo */}
          <div>
            <h4 className="text-[10px] font-black text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" />
              Variables de Costo
            </h4>
            
            <div className="space-y-2">
              {expenseSettings.map((expense) => (
                <button
                  key={expense.id}
                  onClick={() => handleToggleExpense(expense.id)}
                  className={`w-full p-3 rounded-xl border transition-all text-left touch-target ${
                    expense.enabled
                      ? 'border-nodo-petrol/50 bg-nodo-petrol/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      expense.enabled
                        ? 'border-nodo-petrol bg-nodo-petrol'
                        : 'border-white/20'
                    }`}>
                      {expense.enabled && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{expense.label}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        {expense.id === 'fuel' && 'Combustible del viaje'}
                        {expense.id === 'maintenance' && `$${maintPerKm}/km`}
                        {expense.id === 'amortization' && `$${(maintPerKm * 0.5).toFixed(1)}/km`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Botón Guardar */}
          <button
            onClick={handleSaveSettings}
            className="w-full bg-nodo-petrol text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:bg-nodo-petrol/80 active:scale-95 touch-target flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Configuración
          </button>
        </div>
      )}
    </div>
  );
};