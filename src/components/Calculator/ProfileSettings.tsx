import React from 'react';
import { Fuel } from 'lucide-react';

interface ProfileSettingsProps {
  vehicleName: string;
  setVehicleName: (value: string) => void;
  kmPerLiter: number;
  setKmPerLiter: (value: number) => void;
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
}

/**
 * Componente de configuración de perfil de vehículo
 * Permite al usuario personalizar el nombre del vehículo y su consumo
 */
export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  vehicleName, 
  setVehicleName, 
  kmPerLiter, 
  setKmPerLiter, 
  showSettings, 
  setShowSettings 
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      
      {/* Header - Toggle para mostrar/ocultar settings */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        aria-expanded={showSettings}
        aria-controls="profile-settings-panel"
      >
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-white">{vehicleName}</span>
        </div>
        <span className="text-xs text-white/40">{kmPerLiter} km/L</span>
      </button>
      
      {/* Panel de configuración (colapsable) */}
      {showSettings && (
        <div 
          id="profile-settings-panel"
          className="px-4 pb-4 border-t border-white/10 space-y-3 pt-3"
        >
          
          {/* Input de Nombre del Vehículo */}
          <div>
            <label 
              htmlFor="vehicle-name-input" 
              className="text-[10px] text-white/40 uppercase font-bold"
            >
              Nombre del Vehículo
            </label>
            <input
              id="vehicle-name-input"
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-sky-500 transition-colors mt-1"
              placeholder="Ej: Chevrolet Spin 2018"
            />
          </div>
          
          {/* Input de Consumo */}
          <div>
            <label 
              htmlFor="fuel-consumption-input" 
              className="text-[10px] text-white/40 uppercase font-bold"
            >
              Consumo (km/L)
            </label>
            <input
              id="fuel-consumption-input"
              type="number"
              value={kmPerLiter}
              onChange={(e) => setKmPerLiter(Number(e.target.value))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-sky-500 transition-colors mt-1"
              min="1"
              step="0.1"
              placeholder="Ej: 9"
            />
          </div>
        </div>
      )}
    </div>
  );
};