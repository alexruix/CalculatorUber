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

// ─── Subcomponente: Campo de formulario (Lógica Manejate) ───────────
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
    const inputEl = children as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;

    return (
        <div className="field-wrapper">
            {/* label-base: block text-xs font-black text-white/70 uppercase tracking-[0.14em] */}
            <label htmlFor={id} className="label-base ml-1">
                {label}
                {required && (
                    <span className="text-sky-500 ml-1" aria-hidden="true">*</span>
                )}
            </label>

            <div className="field-input-wrapper">
                {Icon && (
                    <Icon className="field-icon-left z-10" aria-hidden="true" />
                )}

                {React.cloneElement(inputEl, {
                    id,
                    'aria-required': required ? 'true' : undefined,
                    'aria-invalid': error ? 'true' : 'false',
                    'aria-describedby': [error ? errorId : null, hint ? hintId : null]
                        .filter(Boolean)
                        .join(' ') || undefined,
                    className: [
                        'input-base input-focus',
                        inputEl.props.className || 'text-xl',
                        Icon ? 'pl-12' : '',
                        suffix ? 'pr-16' : '',
                        error ? 'input-error' : '',
                    ]
                        .filter(Boolean)
                        .join(' '),
                })}

                {suffix && (
                    <span className="field-suffix" aria-hidden="true">
                        {suffix}
                    </span>
                )}
            </div>

            {hint && !error && (
                <p id={hintId} className="label-hint ml-1">
                    {hint}
                </p>
            )}

            {error && (
                <p id={errorId} role="alert" className="feedback-error ml-1 mt-1">
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
        <div className="page-shell flex items-center justify-center p-4">
            <div className="w-full max-w-md pb-10">

                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Manejate</h1>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Configuración</p>
                </div>

                {/* Indicador de progreso */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className={`w-16 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                    <div className={`w-16 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                </div>

                {/* ── PASO 1: Vehículo ─────────────────────────────────────────── */}
                {step === 1 && (
                    <form onSubmit={handleStep1Submit} noValidate className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="card-main space-y-6 relative overflow-hidden">

                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className="icon-wrap-lg icon-wrap-accent">
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

                        <button type="submit" className="btn-primary">
                            Siguiente <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                )}

                {/* ── PASO 2: Gastos Activos ────────────────────────────────────── */}
                {step === 2 && (
                    <form onSubmit={handleFinish} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="card-main space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="icon-wrap-lg icon-wrap-accent">
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

                            <div className="card-section flex items-start gap-3">
                                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="feedback-info">
                                    El radar manejate usará estos datos para calcular tu ROI en tiempo real.
                                </p>
                            </div>

                            <fieldset className="space-y-3 border-0 p-0 m-0">
                                <legend className="sr-only">Gastos a incluir en el cálculo</legend>
                                {expenseSettings.map((expense) => (
                                    <button
                                        key={expense.id} type="button" role="switch" aria-checked={expense.enabled}
                                        onClick={() => handleToggleExpense(expense.id)}
                                        className={expense.enabled ? 'toggle-row-on' : 'toggle-row-off'}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`icon-wrap-md ${expense.enabled ? 'icon-wrap-accent' : 'icon-wrap-neutral'}`} aria-hidden="true">
                                                <CheckCircle2 className={`w-4 h-4 ${expense.enabled ? 'text-sky-300' : 'text-white/20'}`} />
                                            </div>
                                            <div>
                                                <p className={expense.enabled ? 'toggle-label-on' : 'toggle-label-off'}>{expense.label}</p>
                                                <p className={expense.enabled ? 'toggle-desc-on' : 'toggle-desc-off'}>
                                                    {expense.id === 'fuel' && `Calculado a $${fuelPrice}/L`}
                                                    {expense.id === 'maintenance' && `Reserva de $${maintPerKm}/km para gastos corrientes`}
                                                    {expense.id === 'amortization' && `Plus por desgaste del vehículo`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={expense.enabled ? 'toggle-indicator-on' : 'toggle-indicator-off'} aria-hidden="true" />
                                    </button>
                                ))}
                            </fieldset>
                        </div>

                        <div className="flex gap-3">
                            <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1">
                                Atrás
                            </button>
                            <button type="submit" className="btn-primary flex-[2]">
                                Iniciar Radar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};