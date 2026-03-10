import React, { useState, useRef, useEffect } from 'react';
import { Car, Fuel, Settings, CheckCircle2, ChevronRight, DollarSign, Info, Package, Bike, Truck, HelpCircle, ChevronLeft, Rocket } from '../../../lib/icons';
import { cn } from '../../../lib/utils';
import { useProfileStore } from '../../../store/useProfileStore';
import { Field } from '../molecules/Field';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Label } from '../atoms/Label';
import { IconWrap } from '../atoms/IconWrap';
import { Toggle } from '../atoms/Toggle';
import type { VerticalType } from '../../../types/calculator.types';

interface VerticalOption {
    id: VerticalType;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    apps: string[];
    color: {
        text: string;
        bg: string;
        border: string;
        glow: string;
    };
}

const VERTICAL_OPTIONS: VerticalOption[] = [
    {
        id: 'transport',
        icon: Car,
        title: 'Transporte',
        subtitle: 'Llevás personas',
        apps: ['Uber', 'Didi', 'Cabify'],
        color: {
            text: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/30',
            glow: 'shadow-[0_0_30px_var(--color-primary-glow)]',
        },
    },
    {
        id: 'delivery',
        icon: Bike,
        title: 'Delivery',
        subtitle: 'Repartís comida o productos',
        apps: ['Rappi', 'PedidosYa', 'Meli'],
        color: {
            text: 'text-accent',
            bg: 'bg-accent/10',
            border: 'border-accent/30',
            glow: 'shadow-[0_0_30px_var(--color-accent-glow)]',
        },
    },
    {
        id: 'logistics',
        icon: Truck,
        title: 'Logística',
        subtitle: 'Transportás mercadería o hacés fletes',
        apps: ['Envíos Extra', 'Flete privado'],
        color: {
            text: 'text-secondary',
            bg: 'bg-secondary/10',
            border: 'border-secondary/30',
            glow: 'shadow-[0_0_30px_var(--color-secondary-glow)]',
        },
    },
];

interface FieldErrors {
    vehicleName?: string;
    kmPerLiter?: string;
    fuelPrice?: string;
    maintPerKm?: string;
    vehicleValue?: string;
    vehicleLifetimeKm?: string;
}

export const OnboardingFlow: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [errors, setErrors] = useState<FieldErrors>({});
    const headingRef = useRef<HTMLHeadingElement>(null);

    const storeProfile = useProfileStore();

    // Local form state with smart defaults
    const [vertical, setVertical] = useState<VerticalType | null>(storeProfile.vertical || null);
    const currentVertical = vertical || 'transport';

    const [deliveryVehicle, setDeliveryVehicle] = useState<'bike' | 'motorcycle'>('bike');
    const [vehicleName, setVehicleName] = useState(storeProfile.vehicleName || '');
    const [kmPerLiter, setKmPerLiter] = useState(storeProfile.kmPerLiter === 10 ? '' : String(storeProfile.kmPerLiter));
    const [maintPerKm, setMaintPerKm] = useState(storeProfile.maintPerKm === 15 ? '' : String(storeProfile.maintPerKm));
    const [vehicleValue, setVehicleValue] = useState(storeProfile.vehicleValue === 3000000 ? '' : String(storeProfile.vehicleValue));
    const [vehicleLifetimeKm, setVehicleLifetimeKm] = useState(storeProfile.vehicleLifetimeKm === 200000 ? '' : String(storeProfile.vehicleLifetimeKm));
    const [fuelPrice, setFuelPrice] = useState(storeProfile.fuelPrice === 1400 ? '' : String(storeProfile.fuelPrice));
    const [expenseSettings, setExpenseSettings] = useState(storeProfile.expenseSettings);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        headingRef.current?.focus();
    }, [step]);

    const validate = (): boolean => {
        const next: FieldErrors = {};
        if (step === 2) {
            const isDeliveryBike = currentVertical === 'delivery' && deliveryVehicle === 'bike';

            if (!vehicleName.trim() && !isDeliveryBike) next.vehicleName = 'Requerido para tu perfil.';

            if (!isDeliveryBike) {
                const kpl = parseFloat(kmPerLiter);
                if (!kmPerLiter || isNaN(kpl) || kpl <= 0 || kpl > 50) next.kmPerLiter = 'Valor inválido (1-50)';
                const fp = parseFloat(fuelPrice);
                if (!fuelPrice || isNaN(fp) || fp <= 0) next.fuelPrice = 'Precio inválido';
            }

            const mnt = parseFloat(maintPerKm);
            if (!maintPerKm || isNaN(mnt) || mnt < 0) next.maintPerKm = 'Costo inválido';

            if (!isDeliveryBike) {
                const vv = parseFloat(vehicleValue);
                if (vehicleValue && (isNaN(vv) || vv < 0)) next.vehicleValue = 'Valor inválido';
                const vkm = parseFloat(vehicleLifetimeKm);
                if (vehicleLifetimeKm && (isNaN(vkm) || vkm < 1000)) next.vehicleLifetimeKm = 'Mínimo 1000 km';
            }
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleStep1Select = (v: VerticalType) => {
        setVertical(v);
    };

    const handleStep1Continue = () => {
        if (vertical) setStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) setStep(3);
    };

    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();
        const isDeliveryBike = currentVertical === 'delivery' && deliveryVehicle === 'bike';
        const vv = parseFloat(vehicleValue) || (isDeliveryBike ? 0 : 3000000);
        const vkm = parseFloat(vehicleLifetimeKm) || (isDeliveryBike ? 1 : 200000);

        let finalExpenseSettings = expenseSettings;
        if (isDeliveryBike) {
            finalExpenseSettings = expenseSettings.map(ex => {
                if (ex.id === 'fuel' || ex.id === 'amortization') return { ...ex, enabled: false };
                if (ex.id === 'maintenance') return { ...ex, enabled: true };
                return ex;
            });
        }

        storeProfile.setProfile({
            vehicleName: isDeliveryBike ? 'Bicicleta' : vehicleName.trim(),
            kmPerLiter: isDeliveryBike ? 0 : parseFloat(kmPerLiter),
            maintPerKm: parseFloat(maintPerKm),
            vehicleValue: vv,
            vehicleLifetimeKm: vkm,
            fuelPrice: isDeliveryBike ? 0 : parseFloat(fuelPrice),
            expenseSettings: finalExpenseSettings,
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

                {/* Header & Progress Indicator */}
                <div className="flex gap-2 mb-12">
                    <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step >= 1 ? "bg-primary" : "bg-white/10")} />
                    <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step >= 2 ? "bg-primary" : "bg-white/10")} />
                    <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step >= 3 ? "bg-primary" : "bg-white/10")} />
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        {/* Title */}
                        <div className="text-center mb-10">
                            <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-starlight mb-2">
                                Elegí tu rubro
                            </h2>
                            <p className="text-base text-moon font-medium">
                                Personalizaremos tu radar según tu actividad
                            </p>
                        </div>

                        {/* Vertical Options */}
                        <div className="space-y-4">
                            {VERTICAL_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isSelected = vertical === option.id;

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleStep1Select(option.id)}
                                        className={cn(
                                            // Base styles
                                            'w-full p-6 rounded-3xl border-2 transition-all duration-300',
                                            'text-left',
                                            'hover:scale-[1.02] active:scale-[0.98]',

                                            // Selected state
                                            isSelected ? (
                                                cn(
                                                    option.color.bg,
                                                    option.color.border,
                                                    option.color.glow,
                                                    'scale-[1.02]'
                                                )
                                            ) : (
                                                'bg-white/5 border-white/10 hover:border-white/20'
                                            )
                                        )}
                                        aria-pressed={isSelected}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    'w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0',
                                                    isSelected ? (
                                                        cn(option.color.bg, option.color.border)
                                                    ) : (
                                                        'bg-white/5 border-white/10'
                                                    )
                                                )}
                                            >
                                                <Icon
                                                    size={32}
                                                    className={isSelected ? option.color.text : 'text-moon'}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                {/* Title */}
                                                <h3
                                                    className={cn(
                                                        'text-xl font-extrabold mb-1',
                                                        isSelected ? 'text-starlight' : 'text-moon'
                                                    )}
                                                >
                                                    {option.title}
                                                </h3>

                                                {/* Subtitle */}
                                                <p
                                                    className={cn(
                                                        'text-sm font-medium mb-3',
                                                        isSelected ? 'text-starlight/70' : 'text-moon/60'
                                                    )}
                                                >
                                                    {option.subtitle}
                                                </p>

                                                {/* App Examples */}
                                                <div className="flex flex-wrap gap-2">
                                                    {option.apps.map((app) => (
                                                        <span
                                                            key={app}
                                                            className={cn(
                                                                'text-xs font-bold px-2 py-1 rounded-lg',
                                                                isSelected ? (
                                                                    cn('bg-white/10', option.color.text)
                                                                ) : (
                                                                    'bg-white/5 text-moon'
                                                                )
                                                            )}
                                                        >
                                                            {app}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Selection Indicator */}
                                            {isSelected && (
                                                <div
                                                    className={cn(
                                                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                                                        option.color.bg,
                                                        option.color.border,
                                                        'border-2'
                                                    )}
                                                >
                                                    <div className={cn('w-3 h-3 rounded-full', option.color.text.replace('text-', 'bg-'))} />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Help Button */}
                        <button
                            type="button"
                            onClick={() => setShowHelp(!showHelp)}
                            className="w-full flex items-center justify-center gap-2 p-4 text-moon hover:text-starlight transition-colors"
                        >
                            <HelpCircle className="w-5 h-5" />
                            <span className="text-sm font-semibold">
                                ¿No sabés cuál elegir?
                            </span>
                        </button>

                        {/* Help Content */}
                        {showHelp && (
                            <div className="p-4 bg-secondary/10 border-2 border-secondary/30 rounded-2xl animate-slide-in-top">
                                <p className="text-sm font-medium text-starlight/80 leading-relaxed">
                                    <strong className="text-secondary">Consejo:</strong> Si trabajás con <strong>más de un rubro</strong>,
                                    elegí el que hacés <strong>más seguido</strong>. Después podés cambiar esto en Configuración.
                                </p>
                            </div>
                        )}

                        {/* Continue Button */}
                        <button
                            type="button"
                            onClick={handleStep1Continue}
                            disabled={!vertical}
                            className={cn(
                                'w-full py-5 px-6 rounded-3xl font-extrabold text-base uppercase tracking-wide',
                                'flex items-center justify-center gap-3',
                                'transition-all duration-300',
                                vertical ? (
                                    'bg-primary text-black shadow-[0_0_30px_var(--color-primary-glow)] hover:scale-105 active:scale-95'
                                ) : (
                                    'bg-white/10 text-moon cursor-not-allowed'
                                )
                            )}
                        >
                            Continuar
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleStep2Submit} className="space-y-6 animate-fade-in">
                        {/* Header */}
                        <div
                            className={cn(
                                'glass rounded-3xl p-6',
                                'border-2 border-primary/30',
                                'relative overflow-hidden'
                            )}
                        >
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-16 h-16 bg-primary/10 border-2 border-primary/30 rounded-2xl flex items-center justify-center">
                                    {currentVertical === 'transport' && <Car className="w-8 h-8 text-primary" />}
                                    {currentVertical === 'delivery' && deliveryVehicle === 'bike' && <Bike className="w-8 h-8 text-primary" />}
                                    {currentVertical === 'delivery' && deliveryVehicle === 'motorcycle' && <Rocket className="w-8 h-8 text-primary" />}
                                    {currentVertical === 'logistics' && <Truck className="w-8 h-8 text-primary" />}
                                </div>
                                <div>
                                    <h2 id="step2-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-starlight uppercase tracking-tight">
                                        {currentVertical === 'delivery' && deliveryVehicle === 'bike' ? 'Tu Bicicleta' : 'Tu Vehículo'}
                                    </h2>
                                    <p className="text-sm text-primary font-semibold mt-0.5">
                                        Paso 2 de 3
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-5">
                            {/* Delivery Sub-Selector */}
                            {currentVertical === 'delivery' && (
                                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryVehicle('bike')}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                                            deliveryVehicle === 'bike' ? "bg-primary text-moon" : "text-white/60 hover:text-white"
                                        )}
                                    >
                                        <Bike className="w-5 h-5" /> Bici
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryVehicle('motorcycle')}
                                        className={cn(
                                            "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                                            deliveryVehicle === 'motorcycle' ? "bg-primary text-moon" : "text-white/60 hover:text-white"
                                        )}
                                    >
                                        <Rocket className="w-5 h-5" /> Moto
                                    </button>
                                </div>
                            )}

                            {/* Vehicle Name (Required) */}
                            {!(currentVertical === 'delivery' && deliveryVehicle === 'bike') && (
                                <Field
                                    id="vehicle-name"
                                    label="Modelo o apodo del vehículo"
                                    hint={currentVertical === 'logistics' ? "Ej: Renault Kangoo" : "Ej: Honda Wave 110, Fiat Cronos"}
                                    error={errors.vehicleName}
                                    required
                                >
                                    <Input
                                        type="text"
                                        value={vehicleName}
                                        onChange={(e) => {
                                            setVehicleName(e.target.value);
                                            if (errors.vehicleName) {
                                                setErrors((prev) => ({ ...prev, vehicleName: undefined }));
                                            }
                                        }}
                                        placeholder={currentVertical === 'delivery' ? "Ej: Honda Wave" : "Ej: Peugeot 208"}
                                        autoComplete="off"
                                        spellCheck={false}
                                        variant={errors.vehicleName ? 'error' : 'default'}
                                    />
                                </Field>
                            )}

                            {/* Fuel Price + Km per Liter */}
                            {!(currentVertical === 'delivery' && deliveryVehicle === 'bike') && (
                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        id="fuel-price"
                                        label="Nafta/GNC ($/L)"
                                        error={errors.fuelPrice}
                                        required
                                        icon={DollarSign}
                                    >
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            value={fuelPrice}
                                            onChange={(e) => {
                                                setFuelPrice(e.target.value);
                                                if (errors.fuelPrice) {
                                                    setErrors((prev) => ({ ...prev, fuelPrice: undefined }));
                                                }
                                            }}
                                            min="1"
                                            step="10"
                                            placeholder="1600"
                                            variant={errors.fuelPrice ? 'error' : 'default'}
                                        />
                                    </Field>

                                    <Field
                                        id="km-per-liter"
                                        label="Consumo (km/L)"
                                        error={errors.kmPerLiter}
                                        required
                                        icon={Fuel}
                                    >
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            value={kmPerLiter}
                                            onChange={(e) => {
                                                setKmPerLiter(e.target.value);
                                                if (errors.kmPerLiter) {
                                                    setErrors((prev) => ({ ...prev, kmPerLiter: undefined }));
                                                }
                                            }}
                                            min="1"
                                            max="50"
                                            step="0.5"
                                            placeholder={currentVertical === 'delivery' ? "35" : "9"}
                                            variant={errors.kmPerLiter ? 'error' : 'default'}
                                        />
                                    </Field>
                                </div>
                            )}

                            {/* Maintenance per km */}
                            <Field
                                id="maint-per-km"
                                label={currentVertical === 'delivery' && deliveryVehicle === 'bike' ? "Reserva de mantenimiento" : "Gasto de mantenimiento"}
                                hint={currentVertical === 'delivery' && deliveryVehicle === 'bike' ? "Cámaras, frenos, cubierta" : "Aceite, frenos, neumáticos, etc."}
                                error={errors.maintPerKm}
                                icon={Settings}
                                suffix={currentVertical === 'delivery' && deliveryVehicle === 'bike' ? "$/SEM" : "$/KM"}
                            >
                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    value={maintPerKm}
                                    onChange={(e) => {
                                        setMaintPerKm(e.target.value);
                                        if (errors.maintPerKm) {
                                            setErrors((prev) => ({ ...prev, maintPerKm: undefined }));
                                        }
                                    }}
                                    placeholder={currentVertical === 'delivery' && deliveryVehicle === 'bike' ? "5000" : "15"}
                                    variant={errors.maintPerKm ? 'error' : 'default'}
                                />
                            </Field>

                            {/* Amortization (Optional) - Only show for Transport and Logistics */}
                            {(currentVertical === 'transport' || currentVertical === 'logistics') && (
                                <div className="rounded-2xl border-2 border-white/10 bg-white/5 p-5 space-y-4">
                                    <div>
                                        <Label size="xs" variant="muted" className="mb-1">
                                            Amortización vehicular{' '}
                                            <span className="text-moon/50">(opcional)</span>
                                            {currentVertical === 'logistics' && <span className="text-info ml-2 font-bold">(Recomendado)</span>}
                                        </Label>
                                        <p className="text-xs text-moon/70 leading-relaxed">
                                            Con estos datos calculamos el costo real de desgaste de tu vehículo
                                            por km, separado del mantenimiento.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field
                                            id="vehicle-value"
                                            label="Valor del vehículo ($)"
                                            error={errors.vehicleValue}
                                            hint="Precio de mercado actual"
                                        >
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                value={vehicleValue}
                                                onChange={(e) => {
                                                    setVehicleValue(e.target.value);
                                                    if (errors.vehicleValue) {
                                                        setErrors((prev) => ({ ...prev, vehicleValue: undefined }));
                                                    }
                                                }}
                                                placeholder="3.000.000"
                                                variant={errors.vehicleValue ? 'error' : 'default'}
                                            />
                                        </Field>

                                        <Field
                                            id="vehicle-lifetime-km"
                                            label="Vida útil (km)"
                                            error={errors.vehicleLifetimeKm}
                                            hint="KM totales estimados"
                                        >
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                value={vehicleLifetimeKm}
                                                onChange={(e) => {
                                                    setVehicleLifetimeKm(e.target.value);
                                                    if (errors.vehicleLifetimeKm) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            vehicleLifetimeKm: undefined,
                                                        }));
                                                    }
                                                }}
                                                placeholder="200000"
                                                variant={errors.vehicleLifetimeKm ? 'error' : 'default'}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                size="lg"
                                onClick={() => setStep(1)}
                                className="flex-1 flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Atrás
                            </Button>

                            <Button
                                type="submit"
                                variant="neon"
                                size="lg"
                                className="flex-2 flex items-center justify-center gap-2"
                            >
                                Siguiente
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleFinish} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                        <div className="card-main space-y-6">
                            <div className="flex items-center gap-4 mb-2">
                                <IconWrap size="lg" theme="accent">
                                    <CheckCircle2 className="w-6 h-6 text-info" />
                                </IconWrap>
                                <div>
                                    <h2 id="step3-heading" ref={headingRef} tabIndex={-1} className="heading-2">Gastos activos</h2>
                                    <p className="caption text-info mt-0.5">Paso 3 de 3</p>
                                </div>
                            </div>

                            <div className="card-section flex items-start gap-3">
                                <Info className="w-5 h-5 text-info shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="feedback-info">El radar manejate usará estos datos para calcular tu ROI en tiempo real.</p>
                            </div>

                            <fieldset className="space-y-3 border-0 p-0 m-0">
                                <legend className="sr-only">Gastos a incluir en el cálculo</legend>
                                {Array.isArray(expenseSettings) && expenseSettings.map((expense) => (
                                    <Toggle
                                        key={expense.id}
                                        enabled={expense.enabled}
                                        onToggle={() => handleToggleExpense(expense.id)}
                                        label={expense.label}
                                        description={
                                            expense.id === 'fuel' ? `Calculado a $${fuelPrice || '1400'}/L` :
                                                expense.id === 'maintenance' ? `Reserva de $${maintPerKm || '15'}/km para gastos corrientes` :
                                                    vehicleValue && vehicleLifetimeKm
                                                        ? `~$${Math.round(parseFloat(vehicleValue) / parseFloat(vehicleLifetimeKm))}/km (÷ vida útil)`
                                                        : 'Depreción del vehículo por km recorrido'
                                        }
                                        icon={
                                            <IconWrap size="md" theme={expense.enabled ? 'accent' : 'neutral'} aria-hidden="true">
                                                <CheckCircle2 className={`w-4 h-4 ${expense.enabled ? 'text-info' : 'text-white/20'}`} />
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
                            <Button type="submit" variant="neon" className="flex-2">
                                Iniciar Radar
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
