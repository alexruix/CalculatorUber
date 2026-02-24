// src/components/Calculator/TripInputForm.tsx
import React from 'react';
import { DollarSign, Navigation, Navigation2, Clock, ChevronDown, Minus, Plus, NotebookPen } from 'lucide-react';

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
    <div className="card-main space-y-6">

      {/* 1. Tarifa con Ajuste Rápido */}
      <div className="field-wrapper">
        <label className="label-base ml-2">Total cobrado (App)</label>
        <div className="flex items-center gap-3">
          {/* btn-icon: 48x48px, tap target, sin borde fijo — añadimos border manualmente */}
          <button
            onClick={() => adjustValue(fare, setFare, -500)}
            className="btn-icon border border-white/10 rounded-xl"
            aria-label="Restar $500"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="field-input-wrapper flex-1">
            <DollarSign className="field-icon-left" aria-hidden="true" />
            <input
              type="number" inputMode="decimal" placeholder="0" value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="input-base input-focus pl-12 text-3xl font-black text-center"
            />
          </div>
          <button
            onClick={() => adjustValue(fare, setFare, 500)}
            className="btn-icon border border-white/10 rounded-xl"
            aria-label="Sumar $500"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Grid: Viaje y Tiempo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="field-wrapper">
          <label className="label-base ml-2">Recorrido</label>
          <div className="field-input-wrapper">
            <Navigation className="field-icon-left" aria-hidden="true" />
            <input
              type="number" placeholder="KM" value={distTrip}
              onChange={(e) => setDistTrip(e.target.value)}
              className="input-base input-focus pl-9 text-lg"
            />
          </div>
        </div>
        <div className="field-wrapper">
          <label className="label-base ml-2">Minutos de reloj</label>
          <div className="field-input-wrapper">
            <Clock className="field-icon-left" aria-hidden="true" />
            <input
              type="number" placeholder="0" value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-base input-focus pl-9 text-lg"
            />
          </div>
        </div>
      </div>

      {/* 3. Campo Opcional: Pickup */}
      <details className="glass-card rounded-2xl overflow-hidden border border-white/[0.08]">
        <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2">
            <Navigation2 className="w-4 h-4 text-white/20" />
            <span className="text-sm font-bold text-white">Distancia hasta el pasajero</span>
          </div>
          {parseFloat(distPickup) > 0 && (
            <span className="badge-accent">{distPickup} KM</span>
          )}
        </summary>
        <div className="px-5 pb-4 pt-2 border-t border-white/10 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {quickDistances.map((val) => (
              <button
                key={val}
                onClick={() => setDistPickup(val.toString())}
                className={distPickup === val.toString() ? 'filter-chip-active' : 'filter-chip-inactive'}
              >
                {val === 0 ? 'EN EL LUGAR' : `${val} KM`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustValue(distPickup, setDistPickup, -0.5)}
              className="btn-icon border border-white/10 rounded-xl w-10 h-10 min-w-0 min-h-0"
              aria-label="Restar 0.5 km"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number" placeholder="Manual" value={distPickup}
              onChange={(e) => setDistPickup(e.target.value)}
              className="input-base input-focus flex-1 text-sm text-center"
            />
            <button
              onClick={() => adjustValue(distPickup, setDistPickup, 0.5)}
              className="btn-icon border border-white/10 rounded-xl w-10 h-10 min-w-0 min-h-0"
              aria-label="Sumar 0.5 km"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </details>

      <button disabled={!isValid} onClick={onSave} className="btn-primary">
        <NotebookPen className="w-5 h-5" /> Anotar viaje
      </button>
    </div>
  );
};