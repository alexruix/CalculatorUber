import React from 'react';
import { Zap } from 'lucide-react';

interface SessionControlsProps {
  isHeavyTraffic: boolean;
  setIsHeavyTraffic: (value: boolean) => void;
  fuelPrice: number;
  setFuelPrice: (value: number) => void;
}

/**
 * Componente para controlar parámetros de la jornada de trabajo
 * - Toggle de tráfico pesado (afecta consumo de combustible)
 * - Input de precio de combustible
 */
export const SessionControls: React.FC<SessionControlsProps> = ({ 
  isHeavyTraffic, 
  setIsHeavyTraffic, 
  fuelPrice, 
  setFuelPrice 
}) => {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
      
      {/* Toggle de Tráfico */}
      <div className="flex items-center gap-3">
        <Zap 
          className={`w-5 h-5 transition-colors ${
            isHeavyTraffic ? 'text-red-500' : 'text-sky-500'
          }`} 
        />
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
            Ajuste de Jornada
          </p>
          <button 
            onClick={() => setIsHeavyTraffic(!isHeavyTraffic)} 
            className="text-xs font-black uppercase text-white hover:text-sky-400 transition-colors"
            aria-pressed={isHeavyTraffic}
          >
            {isHeavyTraffic ? 'Tránsito Pesado' : 'Tránsito Normal'}
          </button>
        </div>
      </div>
      
      {/* Input de Precio de Combustible */}
      <div className="w-24">
        <input 
          type="number" 
          value={fuelPrice} 
          onChange={(e) => setFuelPrice(Number(e.target.value))}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-center text-xs font-mono outline-none focus:border-sky-500 text-white transition-colors"
          aria-label="Precio del combustible por litro"
          min="0"
          step="50"
        />
      </div>
    </div>
  );
};