import React, { useRef, useEffect } from 'react';
import { Car, Bike, Rocket, Truck, DollarSign, Fuel, Settings, Info, Zap, ChevronLeft, ChevronRight } from '../../../../lib/icons';
import { cn } from '../../../../lib/utils';
import { Field } from '../../molecules/Field';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import type { VerticalType } from '../../../../types/calculator.types';
import { AMORTIZATION_DEFAULTS, ONBOARDING_TEXTS } from '../../../../data/onboardingContent';

interface OnboardingStep2Props {
    vertical: VerticalType;
    deliveryVehicle: 'bike' | 'motorcycle';
    setDeliveryVehicle: (v: 'bike' | 'motorcycle') => void;
    vehicleName: string;
    setVehicleName: (v: string) => void;
    fuelPrice: string;
    setFuelPrice: (v: string) => void;
    kmPerLiter: string;
    setKmPerLiter: (v: string) => void;
    maintPerKm: string;
    setMaintPerKm: (v: string) => void;
    useAutoAmortization: boolean;
    setUseAutoAmortization: (v: boolean) => void;
    vehicleValue: string;
    setVehicleValue: (v: string) => void;
    vehicleLifetimeKm: string;
    setVehicleLifetimeKm: (v: string) => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onNext: () => void;
    onBack: () => void;
}

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
    vertical,
    deliveryVehicle,
    setDeliveryVehicle,
    vehicleName,
    setVehicleName,
    fuelPrice,
    setFuelPrice,
    kmPerLiter,
    setKmPerLiter,
    maintPerKm,
    setMaintPerKm,
    useAutoAmortization,
    setUseAutoAmortization,
    vehicleValue,
    setVehicleValue,
    vehicleLifetimeKm,
    setVehicleLifetimeKm,
    errors,
    setErrors,
    onNext,
    onBack
}) => {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const textConfig = ONBOARDING_TEXTS.step2;

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    const isBike = vertical === 'delivery' && deliveryVehicle === 'bike';

    // Get recommended maintenance value
    const getRecValue = () => {
        if (isBike) return '5000';
        if (vertical === 'logistics') return '25';
        return '70';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
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
                        {vertical === 'transport' && <Car className="w-8 h-8 text-primary" />}
                        {isBike && <Bike className="w-8 h-8 text-primary" />}
                        {vertical === 'delivery' && deliveryVehicle === 'motorcycle' && <Rocket className="w-8 h-8 text-primary" />}
                        {vertical === 'logistics' && <Truck className="w-8 h-8 text-primary" />}
                    </div>
                    <div>
                        <h2 id="step2-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-starlight uppercase tracking-tight">
                            {isBike
                                ? textConfig.bikeTitle
                                : vehicleName.trim()
                                    ? `Tu ${vehicleName.trim()}`
                                    : textConfig.vehicleTitleFallback
                            }
                        </h2>
                        <p className="text-sm text-primary font-semibold mt-0.5">
                            {textConfig.titleSubtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                {/* Delivery Sub-Selector */}
                {vertical === 'delivery' && (
                    <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setDeliveryVehicle('bike')}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                                deliveryVehicle === 'bike' ? "bg-primary text-moon" : "text-white/60 hover:text-white"
                            )}
                        >
                            <Bike className="w-5 h-5" /> {textConfig.subselectorBike}
                        </button>
                        <button
                            type="button"
                            onClick={() => setDeliveryVehicle('motorcycle')}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all",
                                deliveryVehicle === 'motorcycle' ? "bg-primary text-moon" : "text-white/60 hover:text-white"
                            )}
                        >
                            <Rocket className="w-5 h-5" /> {textConfig.subselectorMoto}
                        </button>
                    </div>
                )}

                {/* Vehicle Name (Required) */}
                {!isBike && (
                    <Field
                        id="vehicle-name"
                        label={textConfig.fields.vehicleName.label}
                        hint={vertical === 'logistics' ? textConfig.fields.vehicleName.options.logistics : textConfig.fields.vehicleName.options.default}
                        error={errors.vehicleName}
                        required
                    >
                        <Input
                            type="text"
                            value={vehicleName}
                            onChange={(e) => {
                                setVehicleName(e.target.value);
                                if (errors.vehicleName) {
                                    setErrors((prev) => {
                                        const newErrors = { ...prev };
                                        delete newErrors.vehicleName;
                                        return newErrors;
                                    });
                                }
                            }}
                            placeholder={vertical === 'delivery' ? textConfig.fields.vehicleName.placeholderMoto : textConfig.fields.vehicleName.placeholderCar}
                            autoComplete="off"
                            spellCheck={false}
                            variant={errors.vehicleName ? 'error' : 'default'}
                        />
                    </Field>
                )}

                {/* Fuel Price + Km per Liter */}
                {!isBike && (
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            id="fuel-price"
                            label={textConfig.fields.fuelPrice.label}
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
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors.fuelPrice;
                                            return newErrors;
                                        });
                                    }
                                }}
                                min="1"
                                step="any"
                                placeholder={textConfig.fields.fuelPrice.placeholder}
                                variant={errors.fuelPrice ? 'error' : 'default'}
                            />
                        </Field>

                        <Field
                            id="km-per-liter"
                            label={textConfig.fields.kmPerLiter.label}
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
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors.kmPerLiter;
                                            return newErrors;
                                        });
                                    }
                                }}
                                min="1"
                                max="50"
                                step="0.5"
                                placeholder={vertical === 'delivery' ? textConfig.fields.kmPerLiter.placeholderMoto : textConfig.fields.kmPerLiter.placeholderCar}
                                variant={errors.kmPerLiter ? 'error' : 'default'}
                            />
                        </Field>
                    </div>
                )}

                {/* Maintenance per km */}
                <Field
                    id="maint-per-km"
                    label={isBike ? textConfig.fields.maintenance.labelBike : textConfig.fields.maintenance.labelDefault}
                    hint={
                        <div className="flex flex-col gap-1">
                            <span>{isBike ? textConfig.fields.maintenance.hintBike : textConfig.fields.maintenance.hintDefault}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setMaintPerKm(getRecValue());
                                    if (errors.maintPerKm) {
                                        setErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors.maintPerKm;
                                            return newErrors;
                                        });
                                    }
                                }}
                                className="flex items-center gap-1 text-secondary/90 bg-secondary/10 hover:bg-secondary/20 transition-colors w-fit px-2 py-1 rounded-lg mt-0.5 text-left cursor-pointer active:scale-95"
                            >
                                <Info className="w-3 h-3 shrink-0" />
                                Recomendado: <strong>${getRecValue()}</strong> {isBike ? 'por semana' : 'por km'}
                            </button>
                        </div>
                    }
                    error={errors.maintPerKm}
                    icon={Settings}
                    suffix={isBike ? textConfig.fields.maintenance.suffixBike : textConfig.fields.maintenance.suffixDefault}
                >
                    <Input
                        type="number"
                        inputMode="decimal"
                        value={maintPerKm}
                        onChange={(e) => {
                            setMaintPerKm(e.target.value);
                            if (errors.maintPerKm) {
                                setErrors((prev) => {
                                    const newErrors = { ...prev };
                                    delete newErrors.maintPerKm;
                                    return newErrors;
                                });
                            }
                        }}
                        min="0"
                        placeholder="0"
                        variant={errors.maintPerKm ? 'error' : 'default'}
                    />
                </Field>

                {/* Amortization Section (Optional with Smart Defaults) */}
                {(!isBike) && (
                    <div className="rounded-2xl border-2 border-white/10 p-5 bg-white/5 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-extrabold text-starlight uppercase tracking-tight flex items-center gap-2">
                                    {textConfig.fields.amortization.label}
                                    <span className={cn(
                                        "text-[10px] px-2 py-0.5 rounded-full",
                                        useAutoAmortization ? "bg-secondary/20 text-secondary" : "bg-white/10 text-moon"
                                    )}>
                                        {useAutoAmortization ? textConfig.fields.amortization.recommended : textConfig.fields.amortization.optional}
                                    </span>
                                </h3>
                                {useAutoAmortization && (
                                    <p className="text-xs text-moon/80 font-medium mt-1">
                                        {textConfig.fields.amortization.help}
                                    </p>
                                )}
                            </div>

                            {/* Auto Toggle */}
                            <button
                                type="button"
                                role="switch"
                                aria-checked={useAutoAmortization}
                                onClick={() => {
                                    setUseAutoAmortization(!useAutoAmortization);
                                    if (errors.vehicleValue || errors.vehicleLifetimeKm) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.vehicleValue;
                                            delete newErrors.vehicleLifetimeKm;
                                            return newErrors;
                                        });
                                    }
                                }}
                                className={cn(
                                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                    useAutoAmortization ? "bg-primary" : "bg-white/20"
                                )}
                            >
                                <span className="sr-only">Usar amortización automática</span>
                                <span
                                    className={cn(
                                        "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out",
                                        useAutoAmortization ? "translate-x-5" : "translate-x-0"
                                    )}
                                />
                            </button>
                        </div>

                        {useAutoAmortization ? (
                            <div className="p-4 bg-secondary/10 border-2 border-secondary/30 rounded-xl animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="w-4 h-4 text-secondary" />
                                    <p className="text-xs font-bold text-secondary uppercase tracking-widest">
                                        {textConfig.fields.amortization.autoTitle}
                                    </p>
                                </div>
                                <p className="text-sm text-starlight/80">
                                    {textConfig.fields.amortization.autoP1} <strong className="text-secondary">~${AMORTIZATION_DEFAULTS[vertical].perKm}/km</strong> {textConfig.fields.amortization.autoP2} {vertical === 'delivery' ? 'moto' : 'auto'} {textConfig.fields.amortization.autoP3}
                                </p>
                                <p className="text-xs text-moon/60 mt-2">
                                    💡 {textConfig.fields.amortization.autoP4}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <Field
                                    id="vehicle-value"
                                    label={textConfig.fields.amortization.valueLabel}
                                    error={errors.vehicleValue}
                                    hint={textConfig.fields.amortization.valueHint}
                                >
                                    <Input
                                        type="number"
                                        inputMode="decimal"
                                        value={vehicleValue}
                                        onChange={(e) => {
                                            setVehicleValue(e.target.value);
                                            if (errors.vehicleValue) {
                                                setErrors((prev) => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.vehicleValue;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        placeholder={String(AMORTIZATION_DEFAULTS[vertical].vehicleValue)}
                                        variant={errors.vehicleValue ? 'error' : 'default'}
                                    />
                                </Field>

                                <Field
                                    id="vehicle-lifetime-km"
                                    label={textConfig.fields.amortization.lifetimeLabel}
                                    error={errors.vehicleLifetimeKm}
                                    hint={textConfig.fields.amortization.lifetimeHint}
                                >
                                    <Input
                                        type="number"
                                        inputMode="decimal"
                                        value={vehicleLifetimeKm}
                                        onChange={(e) => {
                                            setVehicleLifetimeKm(e.target.value);
                                            if (errors.vehicleLifetimeKm) {
                                                setErrors((prev) => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.vehicleLifetimeKm;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        placeholder={String(AMORTIZATION_DEFAULTS[vertical].vehicleLifetimeKm)}
                                        variant={errors.vehicleLifetimeKm ? 'error' : 'default'}
                                    />
                                </Field>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={onBack}
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
    );
};
