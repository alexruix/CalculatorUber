import React from 'react';
import {
    Plus, Minus, Save, RotateCcw, Zap, Fuel,
    DollarSign, Navigation, Clock
} from 'lucide-react';
import { ProfitabilityScore } from '../Calculator/ProfitabilityScore';
import type { TripMetrics } from '../../types/calculator.types';
import { MiniSummary } from '../Calculator/MiniSummary';

interface CalculatorTabProps {
    metrics: TripMetrics;
    fare: string;
    setFare: (value: string) => void;
    distTrip: string;
    setDistTrip: (value: string) => void;
    distPickup: string;
    setDistPickup: (value: string) => void;
    duration: string;
    setDuration: (value: string) => void;
    totalMargin: number;
    tripCount: number;
    fuelPrice: number;
    setFuelPrice: (value: number) => void;
    isHeavyTraffic: boolean;
    setIsHeavyTraffic: (value: boolean) => void;
    onSaveTrip: () => void;
    onReset: () => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
    metrics, fare, setFare,
    distTrip, setDistTrip,
    distPickup, setDistPickup,
    duration, setDuration,
    fuelPrice, setFuelPrice,
    isHeavyTraffic, setIsHeavyTraffic,
    onSaveTrip, onReset,
    totalMargin,
    tripCount
}) => {

    const quickDistances = [0, 0.5, 1.5, 3];

    const adjustValue = (value: string, setter: (v: string) => void, step: number) => {
        const current = parseFloat(value) || 0;
        const newValue = Math.max(0, current + step);
        setter(newValue.toString());
    };

    return (
        <div className="pb-32 space-y-5 animate-in fade-in duration-500">

            {/* 1. Hero Score: La métrica reina (Recuperada de Calculator.tsx) */}
            <div className="sticky top-0 z-20 backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5">
                <ProfitabilityScore metrics={metrics} />
            </div>

            <div className="space-y-6">

                {/* 2. Mini Resumen Diario */}
                <MiniSummary totalMargin={totalMargin} tripCount={tripCount} />

                {/* 3. Control de Tránsito (Ahora ocupa el ancho completo) */}
                <button
                    onClick={() => setIsHeavyTraffic(!isHeavyTraffic)}
                    className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all touch-target ${isHeavyTraffic
                        ? 'border-nodo-wine bg-nodo-wine/10 text-nodo-wine'
                        : 'border-white/5 bg-white/5 text-white/40'
                        }`}
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Estado del Tránsito</span>
                        <span className="text-sm font-black">{isHeavyTraffic ? 'TRÁFICO PESADO (+20% Consumo)' : 'TRÁFICO NORMAL'}</span>
                    </div>
                    <Zap className={`w-6 h-6 ${isHeavyTraffic ? 'fill-current' : ''}`} />
                </button>

                {/* 4. Formulario Integrado (Visual Original de TripInputForm) */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">

                    {/* Tarifa */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">
                            Tarifa Bruta (ARS)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 pointer-events-none" />
                            <input
                                type="number" inputMode="decimal" placeholder="0" value={fare}
                                onChange={(e) => setFare(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-12 pr-4 text-3xl font-black outline-none focus:border-sky-500 text-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Pickup con Botones Rápidos */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">
                            Distancia al pasajero
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {quickDistances.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setDistPickup(val.toString())}
                                    className={`px-5 py-3 rounded-xl text-[10px] font-black transition-all border whitespace-nowrap ${distPickup === val.toString()
                                        ? 'border-sky-500 bg-sky-500/20 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                                        : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'
                                        }`}
                                >
                                    {val === 0 ? 'EN EL LUGAR' : `${val} KM`}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number" placeholder="KM manual" value={distPickup}
                            onChange={(e) => setDistPickup(e.target.value)}
                            className="w-full bg-black/20 border border-white/5 rounded-xl py-4 px-4 text-sm font-bold outline-none focus:border-sky-500 text-white"
                        />
                    </div>

                    {/* Grid: Viaje y Tiempo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">Dist. Viaje</label>
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
                            <label className="text-[10px] font-black text-white/30 ml-2 uppercase tracking-widest">Tiempo (MIN)</label>
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

                    {/* Botón de Guardado (Visual Original Sky) */}
                    <button
                        disabled={!metrics.isValid}
                        onClick={onSaveTrip}
                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] disabled:opacity-20 transition-all active:scale-95 hover:bg-sky-400 shadow-xl flex items-center justify-center gap-2"
                    >
                        {/* <Save className="w-5 h-5" /> */}
                        Guardar Viaje
                    </button>
                </div>

                {/* Acción de Limpieza */}
                <button
                    onClick={onReset}
                    className="w-full py-4 text-[10px] font-black text-white/20 hover:text-white flex items-center justify-center gap-2 tracking-[0.3em] transition-colors uppercase"
                >
                    <RotateCcw className="w-3 h-3" /> Limpiar Campos
                </button>
            </div>
        </div>
    );
};