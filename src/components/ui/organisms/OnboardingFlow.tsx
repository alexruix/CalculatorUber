import React, { useState, useRef, useEffect } from 'react';
import { Car, Fuel, Settings, CheckCircle2, ChevronRight, DollarSign, Info, Package, Bike, Truck } from 'lucide-react';
import { useProfileStore } from '../../../store/useProfileStore';
import { Field } from '../molecules/Field';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { IconWrap } from '../atoms/IconWrap';
import { Toggle } from '../atoms/Toggle';

interface FieldErrors {
    vehicleName?: string;
    kmPerLiter?: string;
    fuelPrice?: string;
    maintPerKm?: string;
}

export const OnboardingFlow: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [errors, setErrors] = useState<FieldErrors>({});
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Initial state from store
    const storeProfile = useProfileStore();

    // Local state for the form
    const [vehicleName, setVehicleName] = useState(storeProfile.vehicleName === 'Name' ? '' : storeProfile.vehicleName);
    const [kmPerLiter, setKmPerLiter] = useState(storeProfile.kmPerLiter === 9 ? '' : String(storeProfile.kmPerLiter));
    const [maintPerKm, setMaintPerKm] = useState(storeProfile.maintPerKm === 10 ? '' : String(storeProfile.maintPerKm));
    const [fuelPrice, setFuelPrice] = useState(storeProfile.fuelPrice === 1600 ? '' : String(storeProfile.fuelPrice));
    const [expenseSettings, setExpenseSettings] = useState(storeProfile.expenseSettings);
    const [vertical, setVertical] = useState(storeProfile.vertical);

    useEffect(() => {
        headingRef.current?.focus();
    }, [step]);

    const validate = (): boolean => {
        const next: FieldErrors = {};
        if (step === 2) {
            if (!vehicleName.trim()) next.vehicleName = 'Requerido para tu perfil.';
            const kpl = parseFloat(kmPerLiter);
            if (!kmPerLiter || isNaN(kpl) || kpl <= 0 || kpl > 50) next.kmPerLiter = 'Valor inválido.';
            const fp = parseFloat(fuelPrice);
            if (!fuelPrice || isNaN(fp) || fp <= 0) next.fuelPrice = 'Precio inválido.';
            const mnt = parseFloat(maintPerKm);
            if (!maintPerKm || isNaN(mnt) || mnt < 0) next.maintPerKm = 'Costo inválido.';
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleStep1Select = (v: typeof vertical) => {
        setVertical(v);
        // Validation contextual: if Bike, adjust maintenance default? 
        // For now just proceed
        setStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) setStep(3);
    };

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();
        storeProfile.setProfile({
            vehicleName: vehicleName.trim(),
            kmPerLiter: parseFloat(kmPerLiter),
            maintPerKm: parseFloat(maintPerKm),
            fuelPrice: parseFloat(fuelPrice),
            expenseSettings,
            vertical,
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
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Manejate</h1>
                    <p className="caption">Configuración</p>
                </div>

                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                    <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                    <div className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-white/10'}`} />
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="text-center mb-2">
                            <h2 ref={headingRef} tabIndex={-1} className="heading-2 mb-1">Elegí tu rubro</h2>
                            <p className="caption">Personalizaremos tu radar</p>
                        </div>

                        <div className="grid gap-4">
                            <button
                                onClick={() => handleStep1Select('transport')}
                                className={`card-metric-interactive flex flex-col items-center gap-3 p-6 group transition-all ${vertical === 'transport' ? 'border-sky-500 bg-sky-500/10' : ''}`}
                            >
                                <IconWrap size="lg" theme={vertical === 'transport' ? 'accent' : 'neutral'} className="group-hover:scale-110 transition-transform">
                                    <Car className={`w-6 h-6 ${vertical === 'transport' ? 'text-sky-400' : 'text-white/40'}`} />
                                </IconWrap>
                                <div className="text-center">
                                    <span className="heading-3 block">Transporte</span>
                                    <span className="caption opacity-60">Uber, Didi, Cabify</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleStep1Select('delivery')}
                                className={`card-metric-interactive flex flex-col items-center gap-3 p-6 group transition-all ${vertical === 'delivery' ? 'border-sky-500 bg-sky-500/10' : ''}`}
                            >
                                <IconWrap size="lg" theme={vertical === 'delivery' ? 'accent' : 'neutral'} className="group-hover:scale-110 transition-transform">
                                    <Bike className={`w-6 h-6 ${vertical === 'delivery' ? 'text-sky-400' : 'text-white/40'}`} />
                                </IconWrap>
                                <div className="text-center">
                                    <span className="heading-3 block">Delivery</span>
                                    <span className="caption opacity-60">Rappi, PedidosYa</span>
                                </div>
                            </button>

                            <button
                                onClick={() => handleStep1Select('logistics')}
                                className={`card-metric-interactive flex flex-col items-center gap-3 p-6 group transition-all ${vertical === 'logistics' ? 'border-sky-500 bg-sky-500/10' : ''}`}
                            >
                                <IconWrap size="lg" theme={vertical === 'logistics' ? 'accent' : 'neutral'} className="group-hover:scale-110 transition-transform">
                                    <Truck className={`w-6 h-6 ${vertical === 'logistics' ? 'text-sky-400' : 'text-white/40'}`} />
                                </IconWrap>
                                <div className="text-center">
                                    <span className="heading-3 block">Logística</span>
                                    <span className="caption opacity-60">Envíos Extra, Cargas</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleStep2Submit} noValidate className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="card-main space-y-6 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <IconWrap size="lg" theme="accent">
                                    <Car className="w-6 h-6 text-sky-400" />
                                </IconWrap>
                                <div>
                                    <h2 id="step2-heading" ref={headingRef} tabIndex={-1} className="heading-2">Tu vehiculo</h2>
                                    <p className="caption text-sky-400 mt-0.5">Paso 2 de 3</p>
                                </div>
                            </div>

                            <div className="space-y-5 relative z-10">
                                <Field id="vehicle-name" label="Modelo o apodo" hint="Ej: Fiat Cronos, Moto 150cc" error={errors.vehicleName} required>
                                    <Input
                                        type="text"
                                        value={vehicleName}
                                        onChange={e => {
                                            setVehicleName(e.target.value);
                                            if (errors.vehicleName) setErrors(prev => ({ ...prev, vehicleName: undefined }));
                                        }}
                                        placeholder="Ej: Peugeot 208"
                                        autoComplete="off"
                                        spellCheck={false}
                                        className="text-xl"
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field id="fuel-price" label="Nafta/GNC ($/L)" error={errors.fuelPrice} required icon={DollarSign}>
                                        <Input
                                            type="number" inputMode="decimal"
                                            value={fuelPrice}
                                            onChange={e => {
                                                setFuelPrice(e.target.value);
                                                if (errors.fuelPrice) setErrors(prev => ({ ...prev, fuelPrice: undefined }));
                                            }}
                                            min="1" step="10" placeholder="1600"
                                        />
                                    </Field>
                                    <Field id="km-per-liter" label="Consumo (km/l)" error={errors.kmPerLiter} required icon={Fuel}>
                                        <Input
                                            type="number" inputMode="decimal"
                                            value={kmPerLiter}
                                            onChange={e => {
                                                setKmPerLiter(e.target.value);
                                                if (errors.kmPerLiter) setErrors(prev => ({ ...prev, kmPerLiter: undefined }));
                                            }}
                                            min="1" max="50" step="0.5" placeholder="9"
                                        />
                                    </Field>
                                </div>

                                <Field id="maint-per-km" label="Ahorro para gastos corrientes" hint="Dinero destinado al lavado y mantenimiento del vehiculo" error={errors.maintPerKm} icon={Settings} suffix="$/KM">
                                    <Input
                                        type="number" inputMode="decimal"
                                        value={maintPerKm}
                                        onChange={e => { setMaintPerKm(e.target.value); if (errors.maintPerKm) setErrors(prev => ({ ...prev, maintPerKm: undefined })); }}
                                        placeholder="25"
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" onClick={() => setStep(1)} variant="ghost" className="flex-1">
                                Atrás
                            </Button>
                            <Button type="submit" variant="primary" className="flex-[2]">
                                Siguiente <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleFinish} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="card-main space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <IconWrap size="lg" theme="accent">
                                    <CheckCircle2 className="w-6 h-6 text-sky-400" />
                                </IconWrap>
                                <div>
                                    <h2 id="step3-heading" ref={headingRef} tabIndex={-1} className="heading-2">Gastos activos</h2>
                                    <p className="caption text-sky-400 mt-0.5">Paso 3 de 3</p>
                                </div>
                            </div>

                            <div className="card-section flex items-start gap-3">
                                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="feedback-info">El radar manejate usará estos datos para calcular tu ROI en tiempo real.</p>
                            </div>

                            <fieldset className="space-y-3 border-0 p-0 m-0">
                                <legend className="sr-only">Gastos a incluir en el cálculo</legend>
                                {expenseSettings.map((expense) => (
                                    <Toggle
                                        key={expense.id}
                                        enabled={expense.enabled}
                                        onToggle={() => handleToggleExpense(expense.id)}
                                        label={expense.label}
                                        description={
                                            expense.id === 'fuel' ? `Calculado a $${fuelPrice}/L` :
                                                expense.id === 'maintenance' ? `Reserva de $${maintPerKm}/km para gastos corrientes` :
                                                    `Plus por desgaste del vehículo`
                                        }
                                        icon={
                                            <IconWrap size="md" theme={expense.enabled ? 'accent' : 'neutral'} aria-hidden="true">
                                                <CheckCircle2 className={`w-4 h-4 ${expense.enabled ? 'text-sky-300' : 'text-white/20'}`} />
                                            </IconWrap>
                                        }
                                    />
                                ))}
                            </fieldset>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" onClick={() => setStep(2)} variant="ghost" className="flex-1">
                                Atrás
                            </Button>
                            <Button type="submit" variant="primary" className="flex-2">
                                Iniciar Radar
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
