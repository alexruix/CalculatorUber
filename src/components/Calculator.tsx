import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Fuel, Navigation, 
  Clock, DollarSign, Car, Settings, RotateCcw,
  Zap, History, Trash2
} from 'lucide-react';

// --- Configuración NODO / Chevrolet Spin 2018 ---
const CONFIG = {
  CONSUMO_BASE: 9, // km/L
  CONSUMO_TRAFICO: 7.2, // km/L con aire y tránsito pesado
  MANTENIMIENTO_KM: 60, // ARS estimado por km (filtros, aceite, amortización)
  UMBRAL_EXCELENTE: 1000,
  UMBRAL_ACEPTABLE: 850
};

interface TripMetrics {
  isValid: boolean;
  fuelCost: number;
  totalCost: number;
  netMargin: number;
  profitPerKm: number;
  status: 'excellent' | 'fair' | 'poor' | 'neutral';
}

interface SavedTrip {
  id: number;
  fare: number;
  margin: number;
  timestamp: number;
}

export const Calculator = () => {
  // --- Estados de Entrada ---
  const [fare, setFare] = useState<string>('');
  const [distTrip, setDistTrip] = useState<string>('');
  const [distPickup, setDistPickup] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  
  // --- Estados de Configuración ---
  const [fuelPrice, setFuelPrice] = useState<number>(1600);
  const [isHeavyTraffic, setIsHeavyTraffic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionTrips, setSessionTrips] = useState<SavedTrip[]>([]);

  // --- Persistencia de Sesión ---
  useEffect(() => {
    const saved = localStorage.getItem('nodo_session_v1');
    if (saved) setSessionTrips(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('nodo_session_v1', JSON.stringify(sessionTrips));
  }, [sessionTrips]);

  // --- Algoritmo NODO Drive Intelligence ---
  const metrics = useMemo((): TripMetrics => {
    const f = parseFloat(fare);
    const dT = parseFloat(distTrip);
    const dP = parseFloat(distPickup) || 0;
    const time = parseFloat(duration);

    if (!f || !dT || !time) return { isValid: false, fuelCost: 0, totalCost: 0, netMargin: 0, profitPerKm: 0, status: 'neutral' };

    const totalDist = dT + dP;
    const consumoActual = isHeavyTraffic ? CONFIG.CONSUMO_TRAFICO : CONFIG.CONSUMO_BASE;
    
    const fuelCost = (totalDist / consumoActual) * fuelPrice;
    const maintenanceCost = totalDist * CONFIG.MANTENIMIENTO_KM;
    const totalCost = fuelCost + maintenanceCost;
    
    const netMargin = f - totalCost;
    const profitPerKm = netMargin / totalDist;

    let status: TripMetrics['status'] = 'poor';
    if (profitPerKm >= CONFIG.UMBRAL_EXCELENTE) status = 'excellent';
    else if (profitPerKm >= CONFIG.UMBRAL_ACEPTABLE) status = 'fair';

    return {
      isValid: true,
      fuelCost,
      totalCost,
      netMargin: Math.round(netMargin),
      profitPerKm: Math.round(profitPerKm),
      status
    };
  }, [fare, distTrip, distPickup, duration, fuelPrice, isHeavyTraffic]);

  // --- Acciones ---
  const saveTrip = () => {
    if (!metrics.isValid) return;
    const newTrip: SavedTrip = {
      id: Date.now(),
      fare: parseFloat(fare),
      margin: metrics.netMargin,
      timestamp: Date.now()
    };
    setSessionTrips([newTrip, ...sessionTrips]);
    resetInputs();
  };

  const resetInputs = () => {
    setFare(''); setDistTrip(''); setDistPickup(''); setDuration('');
  };

  const clearSession = () => {
    if (confirm('¿Borrar historial del día?')) setSessionTrips([]);
  };

  const theme = {
    excellent: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-400', label: 'EXCELENTE' },
    fair: { border: 'border-nodo-sand', bg: 'bg-nodo-sand/10', text: 'text-nodo-sand', label: 'ACEPTABLE' },
    poor: { border: 'border-nodo-wine', bg: 'bg-nodo-wine/10', text: 'text-nodo-wine', label: 'BAJA RENTABILIDAD' },
    neutral: { border: 'border-white/10', bg: 'bg-white/5', text: 'text-white/20', label: 'SIN DATOS' }
  }[metrics.status];

  return (
    <div className="max-w-md mx-auto space-y-4">
      
      {/* 🏎️ Perfil Vehículo + Modo Tráfico */}
      <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-nodo-petrol/20 rounded-xl">
            <Car className="w-5 h-5 text-nodo-petrol" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-tighter text-white/80">Spin 2018 · {isHeavyTraffic ? 'Tráfico' : 'Normal'}</h3>
            <p className="text-[10px] font-mono text-white/40">{isHeavyTraffic ? CONFIG.CONSUMO_TRAFICO : CONFIG.CONSUMO_BASE} KM/L + MANT.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsHeavyTraffic(!isHeavyTraffic)}
            className={`p-2 rounded-xl transition-all ${isHeavyTraffic ? 'bg-nodo-wine text-white' : 'bg-white/5 text-white/30'}`}
          >
            <Zap className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-white/40 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl animate-in slide-in-from-top duration-300">
          <label className="text-[10px] font-bold text-white/40 uppercase mb-2 block">Precio Nafta (ARS/L)</label>
          <input 
            type="number" 
            value={fuelPrice} 
            onChange={(e) => setFuelPrice(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm font-mono outline-none focus:border-nodo-petrol"
          />
        </div>
      )}

      {/* 📊 Score Visual (Glanceable UI) */}
      <div className={`border-2 rounded-[2rem] p-6 text-center transition-all duration-500 ${theme.border} ${theme.bg}`}>
        <span className={`text-[10px] font-black tracking-[0.2em] ${theme.text}`}>{theme.label}</span>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-6xl font-black tracking-tighter">${metrics.isValid ? metrics.profitPerKm : 0}</span>
          <span className={`text-xl font-bold ${theme.text}`}>/KM</span>
        </div>
        {metrics.isValid && (
          <div className="mt-2 text-[11px] text-white/60 space-x-2">
            <span>Neto: <b className="text-white">${metrics.netMargin}</b></span>
            <span className="opacity-30">|</span>
            <span>Gasto: <b className="text-nodo-wine">${Math.round(metrics.totalCost)}</b></span>
          </div>
        )}
      </div>

      {/* ⌨️ Formulario Táctil */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
        {/* Tarifa Principal */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/30 ml-1">TARIFA (ARS)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input 
              type="number" inputMode="decimal" placeholder="0.00" value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-2xl font-black outline-none focus:border-nodo-petrol"
            />
          </div>
        </div>

        {/* Pickup Distance con Presets de Tiempo */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 ml-1 uppercase">Origen (Km hasta el pasajero)</label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[0, 0.5, 1.5, 3].map((val) => (
              <button 
                key={val} 
                onClick={() => setDistPickup(val.toString())}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${distPickup === val.toString() ? 'border-nodo-petrol bg-nodo-petrol/20 text-white' : 'border-white/5 bg-white/5 text-white/40'}`}
              >
                {val === 0 ? 'EN EL LUGAR' : `${val} KM`}
              </button>
            ))}
          </div>
          <input 
            type="number" placeholder="KM de Origen" value={distPickup}
            onChange={(e) => setDistPickup(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl py-3 px-4 text-sm font-bold outline-none"
          />
        </div>

        {/* Viaje y Tiempo */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 ml-1 uppercase">Distancia Viaje</label>
            <input 
              type="number" placeholder="KM" value={distTrip}
              onChange={(e) => setDistTrip(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-4 text-lg font-bold outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-white/30 ml-1 uppercase">Minutos</label>
            <input 
              type="number" placeholder="MIN" value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-4 text-lg font-bold outline-none"
            />
          </div>
        </div>

        <button 
          disabled={!metrics.isValid}
          onClick={saveTrip}
          className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm tracking-widest disabled:opacity-20 transition-all active:scale-95"
        >
          GUARDAR VIAJE
        </button>
      </div>

      {/* 📜 Session History (Resumen del Día) */}
      {sessionTrips.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-nodo-petrol" />
              <h3 className="text-xs font-black uppercase tracking-widest">Resumen Sesión</h3>
            </div>
            <button onClick={clearSession} className="text-white/20 hover:text-nodo-wine">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-white/40 uppercase font-bold">Ganancia Neta</p>
              <p className="text-xl font-black text-green-400">
                ${sessionTrips.reduce((acc, t) => acc + t.margin, 0).toLocaleString('es-AR')}
              </p>
            </div>
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
              <p className="text-[10px] text-white/40 uppercase font-bold">Viajes</p>
              <p className="text-xl font-black text-white">{sessionTrips.length}</p>
            </div>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {sessionTrips.map(trip => (
              <div key={trip.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[10px] font-mono text-white/40">{new Date(trip.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span className="text-[10px] font-bold text-white">${trip.fare}</span>
                <span className={`text-[10px] font-bold ${trip.margin > 0 ? 'text-green-400' : 'text-nodo-wine'}`}>
                  {trip.margin > 0 ? '+' : ''}${trip.margin}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={resetInputs} className="w-full py-4 text-[10px] font-black text-white/20 hover:text-white flex items-center justify-center gap-2 tracking-widest transition-all">
        <RotateCcw className="w-3 h-3" /> REINICIAR CALCULADORA
      </button>

    </div>
  );
};

export default Calculator;