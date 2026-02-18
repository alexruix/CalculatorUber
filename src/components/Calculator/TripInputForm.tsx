import React from 'react';
import { DollarSign } from 'lucide-react';

interface TripInputFormProps {
  fare: string;
  setFare: (value: string) => void;
  distTrip: string;
  setDistTrip: (value: string) => void;
  distPickup: string;
  setDistPickup: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  onSave: () => void;
  isValid: boolean;
}

/**
 * Componente del formulario principal de entrada de datos de viaje
 * Incluye: Tarifa, Distancia al pasajero, Distancia del viaje, Duración
 */
export const TripInputForm: React.FC<TripInputFormProps> = ({ 
  fare, 
  setFare, 
  distTrip, 
  setDistTrip, 
  distPickup, 
  setDistPickup, 
  duration, 
  setDuration, 
  onSave, 
  isValid 
}) => {
  
  // Distancias rápidas predefinidas para "hasta el pasajero"
  const quickDistances = [0, 0.5, 1.5, 3];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
      
      {/* Input de Tarifa */}
      <div className="space-y-1">
        <label 
          htmlFor="fare-input" 
          className="text-[10px] font-bold text-white/30 ml-1 uppercase"
        >
          Tarifa Total (ARS)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none" />
          <input 
            id="fare-input"
            type="number" 
            inputMode="decimal" 
            placeholder="0.00" 
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-2xl font-black outline-none focus:border-sky-500 text-white transition-colors"
          />
        </div>
      </div>

      {/* Input de Distancia al Pasajero */}
      <div className="space-y-2">
        <label 
          htmlFor="pickup-input" 
          className="text-[10px] font-bold text-white/30 ml-1 uppercase"
        >
          Kilómetros hasta el pasajero
        </label>
        
        {/* Botones de distancia rápida */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickDistances.map((val) => (
            <button 
              key={val} 
              onClick={() => setDistPickup(val.toString())}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border whitespace-nowrap ${
                distPickup === val.toString() 
                  ? 'border-sky-500 bg-sky-500/20 text-white' 
                  : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'
              }`}
              type="button"
            >
              {val === 0 ? 'EN EL LUGAR' : `${val} KM`}
            </button>
          ))}
        </div>
        
        {/* Input manual */}
        <input 
          id="pickup-input"
          type="number" 
          placeholder="KM de Origen" 
          value={distPickup}
          onChange={(e) => setDistPickup(e.target.value)}
          className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-sky-500 text-white transition-colors"
        />
      </div>

      {/* Grid: Distancia y Duración */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Distancia del Viaje */}
        <div className="space-y-1">
          <label 
            htmlFor="trip-distance-input" 
            className="text-[10px] font-bold text-white/30 ml-1 uppercase"
          >
            Distancia Viaje
          </label>
          <input 
            id="trip-distance-input"
            type="number" 
            placeholder="KM" 
            value={distTrip}
            onChange={(e) => setDistTrip(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-4 text-lg font-bold outline-none focus:border-sky-500 text-white transition-colors"
          />
        </div>
        
        {/* Duración */}
        <div className="space-y-1">
          <label 
            htmlFor="duration-input" 
            className="text-[10px] font-bold text-white/30 ml-1 uppercase"
          >
            Minutos
          </label>
          <input 
            id="duration-input"
            type="number" 
            placeholder="MIN" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-4 text-lg font-bold outline-none focus:border-sky-500 text-white transition-colors"
          />
        </div>
      </div>

      {/* Botón Guardar Viaje */}
      <button 
        disabled={!isValid}
        onClick={onSave}
        className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm tracking-widest disabled:opacity-20 transition-all active:scale-95 hover:bg-sky-400 hover:text-black disabled:hover:bg-white"
        type="button"
      >
        GUARDAR VIAJE EN SESIÓN
      </button>
    </div>
  );
};