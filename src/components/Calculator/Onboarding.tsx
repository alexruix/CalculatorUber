import React, { useState } from 'react';
import { Car, Fuel, Settings, CheckCircle2, ChevronRight, DollarSign } from 'lucide-react';
import type { ExpenseToggle } from '../../types/calculator.types';

interface OnboardingProps {
    onComplete: (config: {
        vehicleName: string;
        kmPerLiter: number;
        maintPerKm: number;
        fuelPrice: number; // Nuevo campo
        expenseSettings: ExpenseToggle[];
    }) => void;
}

/**
 * Componente de Onboarding para configuración inicial
 */
export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1: Datos del vehículo y costos base
    const [vehicleName, setVehicleName] = useState('');
    const [kmPerLiter, setKmPerLiter] = useState('9');
    const [maintPerKm, setMaintPerKm] = useState('10');
    const [fuelPrice, setFuelPrice] = useState('1600'); // Valor inicial sugerido

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
        if (!vehicleName.trim() || !kmPerLiter || parseFloat(kmPerLiter) <= 0 || !fuelPrice) {
            alert('Por favor completa todos los campos de configuración');
            return;
        }
        setStep(2);
    };

    const handleFinish = () => {
        onComplete({
            vehicleName: vehicleName.trim(),
            kmPerLiter: parseFloat(kmPerLiter),
            maintPerKm: parseFloat(maintPerKm),
            fuelPrice: parseFloat(fuelPrice), // Enviamos el precio
            expenseSettings
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Radar Manguito</h1>
                    <p className="text-sm text-white/60">Configura tu perfil operativo para comenzar</p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className={`w-12 h-1 rounded-full transition-all ${step >= 1 ? 'bg-nodo-petrol' : 'bg-white/10'}`} />
                    <div className={`w-12 h-1 rounded-full transition-all ${step >= 2 ? 'bg-nodo-petrol' : 'bg-white/10'}`} />
                </div>

                {/* Step 1: Configuración Técnica */}
                {step === 1 && (
                    <div className="glass-card rounded-[2.5rem] p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-nodo-petrol/20 rounded-2xl flex items-center justify-center border border-nodo-petrol/30">
                                <Car className="w-6 h-6 text-nodo-petrol" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Tu Vehículo</h2>
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Paso 1 de 2</p>
                            </div>
                        </div>

                        {/* Nombre del vehículo */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Modelo / Apodo</label>
                            <input
                                type="text"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                placeholder="Ej: Chevrolet Spin"
                                className="glass-input w-full rounded-2xl px-5 py-4 text-lg font-bold text-white outline-none focus:border-nodo-petrol transition-all"
                            />
                        </div>

                        {/* Precio Combustible y Consumo (Grid) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Nafta $/L</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        value={fuelPrice}
                                        onChange={(e) => setFuelPrice(e.target.value)}
                                        className="glass-input w-full rounded-2xl py-4 pl-4 pr-10 text-lg font-black text-white outline-none focus:border-sky-500 transition-all"
                                    />
                                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">KM por Litro</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        value={kmPerLiter}
                                        onChange={(e) => setKmPerLiter(e.target.value)}
                                        className="glass-input w-full rounded-2xl py-4 pl-4 pr-10 text-lg font-black text-white outline-none focus:border-orange-500 transition-all"
                                    />
                                    <Fuel className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                </div>
                            </div>
                        </div>

                        {/* Costo de mantenimiento */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Mantenimiento $/KM</label>
                            <div className="relative">
                                <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10" />
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={maintPerKm}
                                    onChange={(e) => setMaintPerKm(e.target.value)}
                                    className="glass-input w-full rounded-2xl py-4 pl-12 pr-4 text-lg font-black text-white outline-none focus:border-nodo-sand transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/20">ARS/KM</span>
                            </div>
                        </div>

                        <button
                            onClick={handleStep1Submit}
                            className="w-full bg-nodo-petrol text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Siguiente Paso
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Step 2: Configuración de Gastos (Igual al anterior con estilos pulidos) */}
                {step === 2 && (
                    <div className="glass-card rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-nodo-sand/20 rounded-2xl flex items-center justify-center border border-nodo-sand/30">
                                <CheckCircle2 className="w-6 h-6 text-nodo-sand" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white ">Gastos Activos</h2>
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Paso 2 de 2</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {expenseSettings.map((expense) => (
                                <button
                                    key={expense.id}
                                    onClick={() => handleToggleExpense(expense.id)}
                                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                                        expense.enabled ? 'border-nodo-petrol/50 bg-nodo-petrol/10' : 'border-white/5 bg-white/5 opacity-40'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                            expense.enabled ? 'border-nodo-petrol bg-nodo-petrol' : 'border-white/20'
                                        }`}>
                                            {expense.enabled && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-tighter">{expense.label}</p>
                                            <p className="text-[9px] text-white/40 font-bold uppercase tracking-tight">
                                                {expense.id === 'fuel' && `Calculado a $${fuelPrice}/L`}
                                                {expense.id === 'maintenance' && `$${maintPerKm}/KM recorridos`}
                                                {expense.id === 'amortization' && 'Desgaste / Depreciación'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setStep(1)} className="flex-1 bg-white/5 text-white/40 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                                Volver
                            </button>
                            <button onClick={handleFinish} className="flex-[2] bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                                Finalizar Config
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};