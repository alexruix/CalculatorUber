// src/components/Calculator/TripInputForm.tsx
import React from 'react';
import { DollarSign, Navigation, Navigation2, Clock, ChevronDown, Minus, Plus, Save } from 'lucide-react';

interface TripInputFormProps {
  fare: string;
  setFare: (v: string) => void;
  distTrip: string;
  setDistTrip: (v: string) => void;
  distPickup: string;
  setDistPickup: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  onSave: () => void;
  isValid: boolean;
}

export const TripInputForm: React.FC<TripInputFormProps> = ({
  fare, setFare, distTrip, setDistTrip, distPickup, setDistPickup, duration, setDuration, onSave, isValid
}) => {

  const quickDistances = [0, 0.5, 1.5, 3];

  // Función de ajuste para cambios rápidos sin teclado
  const adjustValue = (value: string, setter: (v: string) => void, step: number) => {
    const current = parseFloat(value) || 0;
    setter(Math.max(0, current + step).toString());
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">

      {/* 1. Tarifa con Ajuste Rápido */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">Total cobrado (App)</label>
        <div className="flex items-center gap-3">
          <button onClick={() => adjustValue(fare, setFare, -500)} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center active:scale-90 border border-white/5"><Minus className="w-5 h-5" /></button>
          <div className="relative flex-1">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              type="number" inputMode="decimal" placeholder="0" value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-12 pr-4 text-3xl font-black text-center text-white outline-none focus:border-sky-500 transition-all"
            />
          </div>
          <button onClick={() => adjustValue(fare, setFare, 500)} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center active:scale-90 border border-white/5"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      {/* 2. Grid: Viaje y Tiempo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">Recorrido del viaje</label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
            <input
              type="number" placeholder="KM" value={distTrip}
              onChange={(e) => setDistTrip(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-4 pl-9 pr-4 text-lg font-black outline-none focus:border-sky-500 text-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">Minutos de reloj</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
            <input
              type="number" placeholder="0" value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-4 pl-9 pr-4 text-lg font-black outline-none focus:border-sky-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Campo Opcional: Pickup */}
      <details className="glass-card rounded-2xl overflow-hidden group border border-white/5">
        <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <Navigation2 className="w-4 h-4 text-white/20" />
            <span className="text-sm font-bold text-white">Distancia hasta el pasajero</span>
          </div>
          {parseFloat(distPickup) > 0 && <span className="text-[10px] font-black text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-lg">{distPickup} KM</span>}
        </summary>
        <div className="px-5 pb-4 pt-2 border-t border-white/10 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickDistances.map((val) => (
              <button key={val} onClick={() => setDistPickup(val.toString())} className={`px-4 py-2 rounded-xl text-[10px] font-black border ${distPickup === val.toString() ? 'border-sky-500 bg-sky-500/20 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}>
                {val === 0 ? 'EN EL LUGAR' : `${val} KM`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => adjustValue(distPickup, setDistPickup, -0.5)} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5"><Minus className="w-4 h-4" /></button>
            <input type="number" placeholder="Manual" value={distPickup} onChange={(e) => setDistPickup(e.target.value)} className="flex-1 bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm font-bold text-center text-white outline-none focus:border-sky-500" />
            <button onClick={() => adjustValue(distPickup, setDistPickup, 0.5)} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5"><Plus className="w-4 h-4" /></button>
          </div>
        </div>
      </details>

      <button
        disabled={!isValid} onClick={onSave}
        className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] disabled:opacity-20 active:scale-95 hover:bg-sky-400 shadow-xl flex items-center justify-center gap-2 transition-all"
      >
        <Save className="w-5 h-5" /> Anotar viaje
      </button>
    </div>
  );
};