import React, { useState, useRef, useEffect } from 'react';
import { Car, Fuel, Settings, CheckCircle2, ChevronRight, DollarSign, AlertCircle, Info } from 'lucide-react';
import type { ExpenseToggle } from '../../types/calculator.types';

interface OnboardingProps {
    onComplete: (config: {
        vehicleName: string;
        kmPerLiter: number;
        maintPerKm: number;
        fuelPrice: number;
        expenseSettings: ExpenseToggle[];
    }) => void;
}

interface FieldErrors {
    vehicleName?: string;
    kmPerLiter?: string;
    fuelPrice?: string;
    maintPerKm?: string;
}

// ─── Subcomponente: Campo de formulario (Lógica Radar Manguito) ───────────
interface FieldProps {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    icon?: React.ElementType;
    suffix?: string;
    children: React.ReactElement;
}

const Field: React.FC<FieldProps> = ({ id, label, hint, error, required, icon: Icon, suffix, children }) => {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="block text-[11px] font-black text-white/60 uppercase tracking-widest ml-1"
            >
                {label}
                {required && (
                    <span className="text-sky-500 ml-1" aria-hidden="true">*</span>
                )}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none z-10"
                        aria-hidden="true"
                    />
                )}

                {/* 🚀 Inyección de clases al estilo "Radar Manguito" */}
                {React.cloneElement(children, {
                    id,
                    'aria-required': required ? 'true' : undefined,
                    'aria-invalid': error ? 'true' : 'false',
                    'aria-describedby': [error ? errorId : null, hint ? hintId : null]
                        .filter(Boolean)
                        .join(' ') || undefined,
                    className: [
                        children.props.className || 'text-xl', // Tamaño por defecto si no se pasa uno
                        Icon ? 'pl-12' : 'pl-5',
                        suffix ? 'pr-16' : 'pr-5',
                        error
                            ? 'border-red-500/60 focus:border-red-500 text-red-100'
                            : 'border-white/5 focus:border-sky-500 text-white',
                        'w-full bg-black/40 border rounded-2xl py-5 font-black outline-none transition-all',
                        'placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
                    ]
                        .filter(Boolean)
                        .join(' '),
                })}

                {suffix && (
                    <span
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-white/40 uppercase tracking-widest pointer-events-none"
                        aria-hidden="true"
                    >
                        {suffix}
                    </span>
                )}
            </div>

            {hint && !error && (
                <p id={hintId} className="text-[11px] text-white/40 font-medium ml-1 leading-relaxed">
                    {hint}
                </p>
            )}

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="flex items-center gap-1.5 text-xs font-bold text-red-400 ml-1 mt-1"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
};

// ─── Componente Principal ────────────────────────────────────────────────────
export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [errors, setErrors] = useState<FieldErrors>({});
    const headingRef = useRef<HTMLHeadingElement>(null);

    const [vehicleName, setVehicleName] = useState('');
    const [kmPerLiter, setKmPerLiter] = useState('');
    const [maintPerKm, setMaintPerKm] = useState('');
    const [fuelPrice, setFuelPrice] = useState('');

    const [expenseSettings, setExpenseSettings] = useState<ExpenseToggle[]>([
        { id: 'fuel', label: 'Combustible', enabled: true },
        { id: 'maintenance', label: 'Mantenimiento', enabled: true },
        { id: 'amortization', label: 'Amortización Vehicular', enabled: false },
    ]);

    useEffect(() => {
        headingRef.current?.focus();
    }, [step]);

    const validate = (): boolean => {
        const next: FieldErrors = {};
        if (!vehicleName.trim()) next.vehicleName = 'Requerido para tu perfil.';
        const kpl = parseFloat(kmPerLiter);
        if (!kmPerLiter || isNaN(kpl) || kpl <= 0 || kpl > 50) next.kmPerLiter = 'Valor inválido.';
        const fp = parseFloat(fuelPrice);
        if (!fuelPrice || isNaN(fp) || fp <= 0) next.fuelPrice = 'Precio inválido.';
        const mnt = parseFloat(maintPerKm);
        if (!maintPerKm || isNaN(mnt) || mnt < 0) next.maintPerKm = 'Costo inválido.';

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) setStep(2);
    };

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({
            vehicleName: vehicleName.trim(),
            kmPerLiter: parseFloat(kmPerLiter),
            maintPerKm: parseFloat(maintPerKm),
            fuelPrice: parseFloat(fuelPrice),
            expenseSettings,
        });
    };

    const handleToggleExpense = (id: string) => {
        setExpenseSettings(prev =>
            prev.map(exp => exp.id === id ? { ...exp, enabled: !exp.enabled } : exp)
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md pb-10">

                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Radar Manguito</h1>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Setup de Radar</p>
                </div>

                {/* Indicador de progreso */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className={`w-16 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                    <div className={`w-16 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                </div>

                {/* ── PASO 1: Vehículo ─────────────────────────────────────────── */}
                {step === 1 && (
                    <form onSubmit={handleStep1Submit} noValidate className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/5 shadow-2xl relative overflow-hidden">

                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20">
                                    <Car className="w-6 h-6 text-sky-400" />
                                </div>
                                <div>
                                    <h2 id="step1-heading" ref={headingRef} tabIndex={-1} className="text-xl font-black text-white outline-none">
                                        Tu vehiculo
                                    </h2>
                                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-0.5">
                                        Paso 1 de 2
                                    </p>
                                </div>
                            </div>

                            {/* Campos adaptados a la nueva estética de inputs */}
                            <div className="space-y-5 relative z-10">
                                <Field
                                    id="vehicle-name"
                                    label="Modelo o apodo"
                                    hint="Ej: Fiat Cronos, Moto 150cc"
                                    error={errors.vehicleName}
                                    required
                                >
                                    <input
                                        type="text"
                                        value={vehicleName}
                                        onChange={e => {
                                            setVehicleName(e.target.value);
                                            if (errors.vehicleName) setErrors(prev => ({ ...prev, vehicleName: undefined }));
                                        }}
                                        placeholder="Ej: Peugeot 208"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        id="fuel-price"
                                        label="Nafta/GNC ($/L)"
                                        error={errors.fuelPrice}
                                        required
                                        icon={DollarSign}
                                    >
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            value={fuelPrice}
                                            onChange={e => {
                                                setFuelPrice(e.target.value);
                                                if (errors.fuelPrice) setErrors(prev => ({ ...prev, fuelPrice: undefined }));
                                            }}
                                            min="1"
                                            step="10"
                                            placeholder="1600"
                                        />
                                    </Field>
                                    <Field
                                        id="km-per-liter"
                                        label="Consumo (km/l)"
                                        error={errors.kmPerLiter}
                                        required
                                        icon={Fuel}
                                    >
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            value={kmPerLiter}
                                            onChange={e => {
                                                setKmPerLiter(e.target.value);
                                                if (errors.kmPerLiter) setErrors(prev => ({ ...prev, kmPerLiter: undefined }));
                                            }}
                                            min="1"
                                            max="50"
                                            step="0.5"
                                            placeholder="9"
                                        />
                                    </Field>
                                </div>

                                <Field id="maint-per-km" label="Ahorro para gastos corrientes" hint="Dinero destinado al lavado y mantenimiento del vehiculo" error={errors.maintPerKm} icon={Settings} suffix="$/KM">
                                    <input
                                        type="number" inputMode="decimal"
                                        value={maintPerKm}
                                        onChange={e => { setMaintPerKm(e.target.value); if (errors.maintPerKm) setErrors(prev => ({ ...prev, maintPerKm: undefined })); }}
                                        placeholder="25"
                                    />
                                </Field>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-sky-400 hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2">
                            Siguiente <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                )}

                {/* ── PASO 2: Gastos Activos ────────────────────────────────────── */}
                {step === 2 && (
                    <form onSubmit={handleFinish} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/5 shadow-2xl">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20">
                                    <CheckCircle2 className="w-6 h-6 text-sky-400" />
                                </div>
                                <div>
                                    <h2 id="step2-heading" ref={headingRef} tabIndex={-1} className="text-xl font-black text-white outline-none">
                                        Gastos activos
                                    </h2>
                                    <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-0.5">
                                        Paso 2 de 2
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                                <Info className="w-5 h-5 text-white/40 shrink-0" />
                                <p className="text-xs text-white/60 leading-relaxed font-medium">
                                    El radar manguito usará estos datos para calcular tu ROI en tiempo real.
                                </p>
                            </div>

                            <fieldset className="space-y-3 border-0 p-0 m-0">
                                {expenseSettings.map((expense) => (
                                    <button
                                        key={expense.id} type="button" role="switch" aria-checked={expense.enabled}
                                        onClick={() => handleToggleExpense(expense.id)}
                                        className={`w-full p-4 rounded-2xl border transition-all duration-200 text-left flex items-center justify-between ${expense.enabled ? 'border-sky-500 bg-sky-500/10' : 'border-white/10 bg-black/40'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${expense.enabled ? 'bg-sky-500 border-sky-500 text-black' : 'border-white/20 bg-transparent'
                                                }`}>
                                                {expense.enabled && <CheckCircle2 className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase tracking-tight text-white">{expense.label}</p>
                                                <p className="text-xs font-medium text-white/50 mt-0.5">
                                                    {expense.id === 'fuel' && `Calculado a $${fuelPrice}/L`}
                                                    {expense.id === 'maintenance' && `Reserva de $${maintPerKm}/km para gastos corrientes`}
                                                    {expense.id === 'amortization' && `Plus por desgaste del vehículo`}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </fieldset>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 active:scale-95 transition-all">
                                Atrás
                            </button>
                            <button type="submit" className="flex-[2] bg-white text-black py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-sky-400 hover:text-white active:scale-95 transition-all">
                                Iniciar Radar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};