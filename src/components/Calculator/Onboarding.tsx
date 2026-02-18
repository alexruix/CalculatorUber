import React, { useState } from 'react';
import { Car, Fuel, Settings, CheckCircle2, ChevronRight } from 'lucide-react';
import type { ExpenseToggle } from '../../types/calculator.types';

interface OnboardingProps {
    onComplete: (config: {
        vehicleName: string;
        kmPerLiter: number;
        maintPerKm: number;
        expenseSettings: ExpenseToggle[];
    }) => void;
}

/**
 * Componente de Onboarding para configuración inicial
 * Multi-step: 1) Datos del vehículo, 2) Configuración de gastos
 */
export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1: Datos del vehículo
    const [vehicleName, setVehicleName] = useState('');
    const [kmPerLiter, setKmPerLiter] = useState('9');
    const [maintPerKm, setMaintPerKm] = useState('10');

    // Step 2: Configuración de gastos
    const [expenseSettings, setExpenseSettings] = useState<ExpenseToggle[]>([
        { id: 'fuel', label: 'Combustible', enabled: true },
        { id: 'maintenance', label: 'Mantenimiento', enabled: true },
        { id: 'amortization', label: 'Amortización del vehículo', enabled: false },
    ]);

    const handleToggleExpense = (id: string) => {
        setExpenseSettings(prev =>
            prev.map(exp =>
                exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
            )
        );
    };

    const handleStep1Submit = () => {
        if (!vehicleName.trim() || !kmPerLiter || parseFloat(kmPerLiter) <= 0) {
            alert('Por favor completa todos los campos del vehículo');
            return;
        }
        setStep(2);
    };

    const handleFinish = () => {
        onComplete({
            vehicleName: vehicleName.trim(),
            kmPerLiter: parseFloat(kmPerLiter),
            maintPerKm: parseFloat(maintPerKm),
            expenseSettings
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">Bienvenido a NODO</h1>
                    <p className="text-sm text-white/60">Configura tu perfil para comenzar</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className={`w-12 h-1 rounded-full transition-all ${step >= 1 ? 'bg-nodo-petrol' : 'bg-white/10'}`} />
                    <div className={`w-12 h-1 rounded-full transition-all ${step >= 2 ? 'bg-nodo-petrol' : 'bg-white/10'}`} />
                </div>

                {/* Step 1: Datos del Vehículo */}
                {step === 1 && (
                    <div className="glass-card rounded-3xl p-6 space-y-6 animate-in fade-in">

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-nodo-petrol/20 rounded-2xl flex items-center justify-center">
                                <Car className="w-6 h-6 text-nodo-petrol" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Tu Vehículo</h2>
                                <p className="text-xs text-white/40">Paso 1 de 2</p>
                            </div>
                        </div>

                        {/* Nombre del vehículo */}
                        <div>
                            <label htmlFor="vehicle-name" className="text-[10px] font-bold text-white/40 uppercase mb-2 block">
                                Nombre / Modelo del Vehículo
                            </label>
                            <input
                                id="vehicle-name"
                                type="text"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                placeholder="Ej: Chevrolet Spin 2018"
                                className="glass-input w-full rounded-xl px-4 py-4 text-lg font-bold text-white outline-none"
                            />
                            <p className="text-xs text-white/30 mt-1 ml-1">Esto te ayudará a identificar tu vehículo</p>
                        </div>

                        {/* Consumo */}
                        <div>
                            <label htmlFor="fuel-consumption" className="text-[10px] font-bold text-white/40 uppercase mb-2 block">
                                Consumo (km por litro)
                            </label>
                            <div className="flex items-center gap-3">
                                <Fuel className="w-5 h-5 text-orange-500" />
                                <input
                                    id="fuel-consumption"
                                    type="number"
                                    inputMode="decimal"
                                    value={kmPerLiter}
                                    onChange={(e) => setKmPerLiter(e.target.value)}
                                    placeholder="9"
                                    step="0.1"
                                    min="1"
                                    className="glass-input flex-1 rounded-xl px-4 py-4 text-xl font-black text-white outline-none"
                                />
                                <span className="text-white/40 font-bold">km/L</span>
                            </div>
                            <p className="text-xs text-white/30 mt-1 ml-1">
                                Promedio de tu vehículo en ciudad
                            </p>
                        </div>

                        {/* Costo de mantenimiento */}
                        <div>
                            <label htmlFor="maintenance-cost" className="text-[10px] font-bold text-white/40 uppercase mb-2 block">
                                Costo de Mantenimiento por KM
                            </label>
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-nodo-sand" />
                                <span className="text-white/40 font-bold">$</span>
                                <input
                                    id="maintenance-cost"
                                    type="number"
                                    inputMode="decimal"
                                    value={maintPerKm}
                                    onChange={(e) => setMaintPerKm(e.target.value)}
                                    placeholder="10"
                                    step="1"
                                    min="0"
                                    className="glass-input flex-1 rounded-xl px-4 py-4 text-xl font-black text-white outline-none"
                                />
                                <span className="text-white/40 font-bold">/km</span>
                            </div>
                            <p className="text-xs text-white/30 mt-1 ml-1">
                                Estimación promedio (service, neumáticos, etc)
                            </p>
                        </div>

                        {/* Botón continuar */}
                        <button
                            onClick={handleStep1Submit}
                            className="w-full bg-nodo-petrol text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:bg-nodo-petrol/80 active:scale-95 touch-target flex items-center justify-center gap-2"
                        >
                            Continuar
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Step 2: Configuración de Gastos */}
                {step === 2 && (
                    <div className="glass-card rounded-3xl p-6 space-y-6 animate-in fade-in">

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-nodo-sand/20 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-nodo-sand" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Variables de Costo</h2>
                                <p className="text-xs text-white/40">Paso 2 de 2</p>
                            </div>
                        </div>

                        <p className="text-sm text-white/60">
                            Selecciona qué gastos quieres incluir en el cálculo de rentabilidad:
                        </p>

                        {/* Toggles de gastos */}
                        <div className="space-y-3">
                            {expenseSettings.map((expense) => (
                                <button
                                    key={expense.id}
                                    onClick={() => handleToggleExpense(expense.id)}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left touch-target ${expense.enabled
                                            ? 'border-nodo-petrol bg-nodo-petrol/10'
                                            : 'border-white/10 bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${expense.enabled
                                                    ? 'border-nodo-petrol bg-nodo-petrol'
                                                    : 'border-white/20'
                                                }`}>
                                                {expense.enabled && (
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{expense.label}</p>
                                                <p className="text-xs text-white/40 mt-0.5">
                                                    {expense.id === 'fuel' && 'Combustible gastado en el viaje'}
                                                    {expense.id === 'maintenance' && `$${maintPerKm} por kilómetro (service, neumáticos)`}
                                                    {expense.id === 'amortization' && 'Desgaste y depreciación del vehículo'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Info sobre amortización */}
                        {expenseSettings.find(e => e.id === 'amortization')?.enabled && (
                            <div className="bg-nodo-sand/10 border border-nodo-sand/30 rounded-xl p-4">
                                <p className="text-xs text-nodo-sand font-bold mb-1">ℹ️ Sobre la Amortización</p>
                                <p className="text-xs text-white/60">
                                    Estimamos 50% del costo de mantenimiento como desgaste del vehículo (${(parseFloat(maintPerKm) * 0.5).toFixed(1)}/km)
                                </p>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:bg-white/10 active:scale-95 touch-target"
                            >
                                Atrás
                            </button>
                            <button
                                onClick={handleFinish}
                                className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:bg-nodo-petrol hover:text-white active:scale-95 touch-target flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                Finalizar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};