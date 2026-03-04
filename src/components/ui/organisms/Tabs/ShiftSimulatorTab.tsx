import React, { useMemo, useState } from 'react';
import { useProfileStore } from '../../../../store/useProfileStore';
import { TrafficCone, Zap, Car, Truck, Bike, Info, ArrowRight } from 'lucide-react';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';

export const ShiftSimulatorTab: React.FC = () => {
    const { kmPerLiter, maintPerKm, fuelPrice, expenseSettings, vertical, vehicleName } = useProfileStore();
    const { setActiveTab } = useCalculatorStore();

    const [simulatedDistance, setSimulatedDistance] = useState<number>(5);

    // Calcula el costo estricto de mover el vehiculo 1 KM
    const costPerKm = useMemo(() => {
        let cost = 0;

        // Combustible
        if (expenseSettings.find(e => e.id === 'fuel')?.enabled && kmPerLiter > 0) {
            cost += (1 / kmPerLiter) * fuelPrice;
        }

        // Mantenimiento
        if (expenseSettings.find(e => e.id === 'maintenance')?.enabled) {
            cost += maintPerKm;
        }

        // Amortización (estimado 50% del mantenimiento)
        if (expenseSettings.find(e => e.id === 'amortization')?.enabled) {
            cost += maintPerKm * 0.5;
        }

        return cost;
    }, [kmPerLiter, maintPerKm, fuelPrice, expenseSettings]);

    if (costPerKm === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-8 animate-in fade-in">
                <TrafficCone className="w-16 h-16 text-white/20 mb-4" />
                <h2 className="text-xl font-black text-white mb-2">Configurá tus Válvulas</h2>
                <p className="text-sm text-white/50 mb-6">Necesitamos saber cuánto gasta tu {vehicleName || 'vehículo'} para darte el número mágico.</p>
                <button onClick={() => setActiveTab('profile')} className="btn-primary">
                    Ir a Configuración
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

            {/* HEADER HERO - EL NÚMERO MÁGICO */}
            <div className="glass-card rounded-4xl p-6 border border-white/10 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-50" />

                <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-nodo-wine" />
                </div>

                <h2 className="text-sm text-white/50 uppercase tracking-widest font-black mb-1">Costo Operativo</h2>
                <div className="flex justify-center items-end gap-1 mb-2">
                    <span className="text-5xl font-black text-white tracking-tighter">${Math.round(costPerKm)}</span>
                    <span className="text-lg text-white/40 font-bold mb-1">/km</span>
                </div>
                <p className="text-xs text-white/40 mx-auto max-w-[250px] leading-relaxed">
                    Esto te cuesta mover tu {vehicleName || 'vehículo'} 1 kilómetro (nafta, arreglos y desgaste).
                </p>
            </div>

            {/* SEMÁFORO DE REFERENCIA */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Semáforo de Viajes</h3>
                    <span className="text-[10px] bg-white/5 text-white/50 px-2 py-1 rounded-full uppercase font-bold text-center">
                        Piso a cobrar
                    </span>
                </div>

                <div className="grid gap-3">
                    {/* GREEN LAYER */}
                    <div className="glass-card p-4 rounded-3xl border border-green-500/20 bg-green-500/[0.03] flex items-center gap-4 relative overflow-hidden">
                        <div className="w-2 h-full absolute left-0 top-0 bg-green-500/50" />
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black uppercase text-sm">Viaje Ideal</h4>
                            <p className="text-xs text-green-100/50 leading-tight mt-0.5">Ganás más del doble</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold block mb-0.5">Pedir más de</span>
                            <span className="text-xl font-black text-green-400">${Math.round(greenMin)} <span className="text-xs opacity-50">/km</span></span>
                        </div>
                    </div>

                    {/* YELLOW LAYER */}
                    <div className="glass-card p-4 rounded-3xl border border-yellow-500/20 bg-yellow-500/[0.03] flex items-center gap-4 relative overflow-hidden">
                        <div className="w-2 h-full absolute left-0 top-0 bg-yellow-500/50" />
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black uppercase text-sm">Viaje Normal</h4>
                            <p className="text-xs text-yellow-100/50 leading-tight mt-0.5">Cubre gastos y deja margen</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold block mb-0.5">Ronda los</span>
                            <span className="text-xl font-black text-yellow-400">${Math.round(yellowMin)} <span className="text-xs opacity-50">/km</span></span>
                        </div>
                    </div>

                    {/* RED LAYER */}
                    <div className="glass-card p-4 rounded-3xl border border-red-500/20 bg-red-500/[0.03] flex items-center gap-4 relative overflow-hidden opacity-80">
                        <div className="w-2 h-full absolute left-0 top-0 bg-red-500/50" />
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                            <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-black uppercase text-sm">Viaje Trampa</h4>
                            <p className="text-xs text-red-100/50 leading-tight mt-0.5">Estás pagando por trabajar</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold block mb-0.5">Menos de</span>
                            <span className="text-xl font-black text-red-400">${Math.round(yellowMin - 1)} <span className="text-xs opacity-50">/km</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TIRE SIMULATION */}
            <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-nodo-accent" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Simular Distancia</h3>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-white/40">Viaje de prueba</span>
                        <span className="text-xl font-black text-white">{simulatedDistance} km</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={simulatedDistance}
                        onChange={(e) => setSimulatedDistance(Number(e.target.value))}
                        className="w-full accent-nodo-accent bg-white/10 rounded-full h-2 appearance-none outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-white/30 uppercase font-black mt-2">
                        <span>Corto (1km)</span>
                        <span>Largo (30km)</span>
                    </div>
                </div>

                <div className="bg-black/50 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <span className="block text-[10px] uppercase text-white/40 font-bold mb-1">En {simulatedDistance}km pedí más de:</span>
                        <span className="text-2xl font-black text-white">${simYellow}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/20" />
                    <div className="text-right">
                        <span className="block text-[10px] uppercase text-green-400/50 font-bold mb-1">Para clavar un viaje ideal:</span>
                        <span className="text-2xl font-black text-green-400">${simGreen}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};
