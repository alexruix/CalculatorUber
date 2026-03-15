import React, { useMemo, useState } from 'react';
import { useProfileStore } from '../../../../store/useProfileStore';
import { TrafficCone, Zap, Car, Truck, Bike, Info, ArrowRight, RefreshCw } from '../../../../lib/icons';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { SIMULATOR } from '../../../../data/ui-strings';

export const ShiftSimulatorTab: React.FC = () => {
    const { kmPerLiter, maintPerKm, fuelPrice, expenseSettings, vertical, vehicleName, swapVehicle } = useProfileStore();
    const { setActiveTab } = useCalculatorStore();

    const [simulatedDistance, setSimulatedDistance] = useState<number>(5);

    // Calcula el costo estricto de mover el vehiculo 1 KM
    const costPerKm = useMemo(() => {
        let cost = 0;

        // Seguro contra corrupciones de Local Storage o Supabase JSONB
        const expenses = Array.isArray(expenseSettings) ? expenseSettings : [];

        // Combustible
        if (expenses.find(e => e.id === 'fuel')?.enabled && kmPerLiter > 0) {
            cost += (1 / kmPerLiter) * fuelPrice;
        }

        // Mantenimiento
        if (expenses.find(e => e.id === 'maintenance')?.enabled) {
            cost += maintPerKm;
        }

        // Amortización (estimado 50% del mantenimiento)
        if (expenses.find(e => e.id === 'amortization')?.enabled) {
            cost += maintPerKm * 0.5;
        }

        return cost;
    }, [kmPerLiter, maintPerKm, fuelPrice, expenseSettings]);

    if (costPerKm === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-8 animate-in fade-in">
                <TrafficCone className="w-16 h-16 text-white/40 mb-4" />
                <h2 className="text-xl font-black text-white mb-2">{SIMULATOR.emptyState.title}</h2>
                <p className="text-sm text-white/50 mb-6">{SIMULATOR.emptyState.body(vehicleName || 'vehículo')}</p>
                <button onClick={() => setActiveTab('profile')} className="btn-primary">
                    {SIMULATOR.emptyState.action}
                </button>
            </div>
        );
    }

    // Escalas de semáforo por KM
    const redMin = costPerKm; // Si cobras esto, salís hecho (trabajás gratis)
    const yellowMin = costPerKm * 1.8; // Ganancia decente
    const greenMin = costPerKm * 2.8; // Excelente ganancia

    // Valores simulados según KM seleccionado
    const simRed = Math.round(redMin * simulatedDistance);
    const simYellow = Math.round(yellowMin * simulatedDistance);
    const simGreen = Math.round(greenMin * simulatedDistance);

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">

            {/* QUICK PROFILE SWAPPER */}
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-white">{SIMULATOR.greeting}</h2>
                <button
                    onClick={swapVehicle}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all active:scale-95"
                >
                    {vertical === 'transport' ? <Car className="w-3.5 h-3.5 text-info" /> : <Bike className="w-3.5 h-3.5 text-warning" />}
                    {vehicleName || 'Vehículo'}
                    <RefreshCw className="w-3 h-3 text-white/40 ml-1" />
                </button>
            </div>

            {/* HEADER HERO - EL NÚMERO MÁGICO */}
            <div className="glass-card rounded-4xl p-6 border border-white/10 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-error via-warning to-success opacity-50" />

                <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-error" />
                </div>

                <h2 className="text-sm text-white/50 uppercase tracking-widest font-black mb-1">{SIMULATOR.costHeader}</h2>
                <div className="flex justify-center items-end gap-1 mb-2">
                    <span className="text-5xl font-black text-white tracking-tighter">${Math.round(costPerKm)}</span>
                    <span className="text-lg text-white/70 font-bold mb-1">/km</span>
                </div>
                <p className="text-xs text-white/70 mx-auto max-w-[250px] leading-relaxed">
                    {SIMULATOR.costBody(vehicleName || 'vehículo')}
                </p>
            </div>

            {/* SEMÁFORO DE REFERENCIA */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">{SIMULATOR.trafficLight.title}</h3>
                    <span className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded-full uppercase font-bold text-center">
                        {SIMULATOR.trafficLight.subtitle}
                    </span>
                </div>

                <div className="grid gap-3">
                    {/* GREEN LAYER */}
                    <div className="glass-card p-4 rounded-3xl border border-success/20 bg-success/3 flex items-center gap-4 relative overflow-hidden">
                        <div className="w-2 h-full absolute left-0 top-0 bg-success/50" />
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full bg-success shadow-[0_0_10px_var(--color-success-glow)]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black uppercase text-sm">{SIMULATOR.trafficLight.ideal.title}</h4>
                            <p className="text-xs text-success/50 leading-tight mt-0.5">{SIMULATOR.trafficLight.ideal.body}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-white/60 uppercase tracking-widest font-black block mb-0.5">{SIMULATOR.trafficLight.ideal.action}</span>
                            <span className="text-xl font-black text-success">${Math.round(greenMin)} <span className="text-xs opacity-50">/km</span></span>
                        </div>
                    </div>

                    {/* YELLOW LAYER */}
                    <div className="glass-card p-4 rounded-3xl border border-warning/20 bg-warning/3 flex items-center gap-4 relative overflow-hidden">
                        <div className="w-2 h-full absolute left-0 top-0 bg-warning/50" />
                        <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full bg-warning shadow-[0_0_10px_var(--color-warning-glow)]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black uppercase text-sm">{SIMULATOR.trafficLight.normal.title}</h4>
                            <p className="text-xs text-warning/50 leading-tight mt-0.5">{SIMULATOR.trafficLight.normal.body}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-white/60 uppercase tracking-widest font-black block mb-0.5">{SIMULATOR.trafficLight.normal.action}</span>
                            <span className="text-xl font-black text-warning">${Math.round(yellowMin)} <span className="text-xs opacity-50">/km</span></span>
                        </div>
                    </div>

                    {/* RED LAYER */}
                    <div className="glass-card p-4 rounded-3xl border border-error/20 bg-error/3 flex items-center gap-4 relative overflow-hidden opacity-80">
                        <div className="w-2 h-full absolute left-0 top-0 bg-error/50" />
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full bg-error shadow-[0_0_10px_var(--color-error-glow)]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black uppercase text-sm">{SIMULATOR.trafficLight.trap.title}</h4>
                            <p className="text-xs text-error/50 leading-tight mt-0.5">{SIMULATOR.trafficLight.trap.body}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-white/60 uppercase tracking-widest font-black block mb-0.5">{SIMULATOR.trafficLight.trap.action}</span>
                            <span className="text-xl font-black text-error">${Math.round(yellowMin - 1)} <span className="text-xs opacity-50">/km</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TIRE SIMULATION */}
            <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-success" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">{SIMULATOR.simulation.title}</h3>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-white/40">{SIMULATOR.simulation.subtitle}</span>
                        <span className="text-xl font-black text-white">{simulatedDistance} km</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={simulatedDistance}
                        onChange={(e) => setSimulatedDistance(Number(e.target.value))}
                        className="w-full accent-success bg-white/10 rounded-full h-2 appearance-none outline-none"
                    />
                    <div className="flex justify-between text-xs text-white/60 uppercase font-black mt-2">
                        <span>{SIMULATOR.simulation.rangeStart}</span>
                        <span>{SIMULATOR.simulation.rangeEnd}</span>
                    </div>
                </div>

                <div className="bg-black/50 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <span className="block text-xs uppercase text-white/70 font-black tracking-widest mb-1">{SIMULATOR.simulation.askMore(simulatedDistance)}</span>
                        <span className="text-2xl font-black text-white">${simYellow}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20" />
                    <div className="text-right">
                        <span className="block text-xs uppercase text-success/50 font-black tracking-widest mb-1">{SIMULATOR.simulation.dealIdeal}</span>
                        <span className="text-2xl font-black text-success">${simGreen}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};
