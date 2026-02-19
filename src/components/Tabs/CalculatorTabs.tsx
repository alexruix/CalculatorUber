// src/components/Tabs/CalculatorTabs.tsx
import React from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { ProfitabilityScore } from '../Calculator/ProfitabilityScore';
import { MiniSummary } from '../Calculator/MiniSummary';
import { TripInputForm } from '../Calculator/TripInputForm'; // 👈 IMPORTANTE
import type { TripMetrics } from '../../types/calculator.types';

export const CalculatorTab: React.FC<CalculatorTabProps> = (props) => {
    return (
        <div className="pb-32 space-y-5 animate-in fade-in duration-500">
            {/* 1. Score de Rentabilidad */}
            <div className="sticky top-0 z-20 backdrop-blur-md -mx-4 px-4 py-4 border-b border-white/5">
                <ProfitabilityScore metrics={props.metrics} />
            </div>

            <div className="space-y-6">
                {/* 2. Resumen Rápido */}
                <MiniSummary totalMargin={props.totalMargin} tripCount={props.tripCount} />

                {/* 3. Botón de Tránsito */}
                <button
                    onClick={() => props.setIsHeavyTraffic(!props.isHeavyTraffic)}
                    className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${props.isHeavyTraffic
                        ? 'border-nodo-wine bg-nodo-wine/10 text-nodo-wine'
                        : 'border-white/5 bg-white/5 text-white/40'
                    }`}
                >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Tránsito</span>
                        <span className="text-sm font-black">{props.isHeavyTraffic ? 'PESADO (+20% Gasto)' : 'NORMAL'}</span>
                    </div>
                    <Zap className={`w-6 h-6 ${props.isHeavyTraffic ? 'fill-current' : ''}`} />
                </button>

                {/* 4. EL FORMULARIO MODULAR (REEMPLAZO DEL CÓDIGO ANTERIOR) */}
                <TripInputForm 
                    fare={props.fare} setFare={props.setFare}
                    distTrip={props.distTrip} setDistTrip={props.setDistTrip}
                    distPickup={props.distPickup} setDistPickup={props.setDistPickup}
                    duration={props.duration} setDuration={props.setDuration}
                    onSave={props.onSaveTrip}
                    isValid={props.metrics.isValid}
                />

                {/* Acción de Limpieza */}
                <button onClick={props.onReset} className="w-full py-4 text-[10px] font-black text-white/20 hover:text-white flex items-center justify-center gap-2 uppercase tracking-widest">
                    <RotateCcw className="w-3 h-3" /> Limpiar Formulario
                </button>
            </div>
        </div>
    );
};