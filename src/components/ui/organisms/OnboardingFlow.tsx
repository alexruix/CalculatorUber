import React, { useState } from 'react';
import { useProfileStore } from '../../../store/useProfileStore';
import type { ExpenseToggle, VerticalType } from '../../../types/calculator.types';
import { cn } from '../../../lib/utils';

// Step Components
import { OnboardingStep1 } from './Onboarding/OnboardingStep1';
import { OnboardingStep2 } from './Onboarding/OnboardingStep2';
import { OnboardingStep3 } from './Onboarding/OnboardingStep3';

export const OnboardingFlow: React.FC = () => {
    // Top-level store properties
    const state = useProfileStore();
    const { setProfile } = state;

    // Flow State
    const [step, setStep] = useState(1);

    // Step 1 State
    const [currentVertical, setCurrentVertical] = useState<VerticalType | null>(
        state.vertical || null
    );

    // Step 2 State
    const [deliveryVehicle, setDeliveryVehicle] = useState<'bike' | 'motorcycle'>('motorcycle');
    const [vehicleName, setVehicleName] = useState('');
    const [fuelPrice, setFuelPrice] = useState('');
    const [kmPerLiter, setKmPerLiter] = useState('');
    const [maintPerKm, setMaintPerKm] = useState('');

    const [useAutoAmortization, setUseAutoAmortization] = useState(true);
    const [vehicleValue, setVehicleValue] = useState('');
    const [vehicleLifetimeKm, setVehicleLifetimeKm] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Step 3 State
    const [expenseSettings, setExpenseSettings] = useState<ExpenseToggle[]>([
        { id: 'fuel', label: 'Combustible', enabled: true },
        { id: 'maintenance', label: 'Mantenimiento', enabled: true },
        { id: 'amortization', label: 'Amortización', enabled: true },
    ]);

    // Validation (Step 2)
    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        const isBike = currentVertical === 'delivery' && deliveryVehicle === 'bike';

        if (!isBike) {
            if (!vehicleName.trim()) newErrors.vehicleName = 'Ingresá el nombre de tu vehículo';
            if (!fuelPrice || parseFloat(fuelPrice) <= 0) newErrors.fuelPrice = 'Ingresá un precio válido';
            if (!kmPerLiter || parseFloat(kmPerLiter) <= 0) newErrors.kmPerLiter = 'Ingresá un consumo válido';
        }

        if (!maintPerKm || parseFloat(maintPerKm) < 0) newErrors.maintPerKm = 'Ingresá un gasto válido (puede ser 0)';

        if (!isBike && !useAutoAmortization) {
            if (!vehicleValue || parseFloat(vehicleValue) <= 0) newErrors.vehicleValue = 'Ingresá el valor del vehículo';
            if (!vehicleLifetimeKm || parseFloat(vehicleLifetimeKm) <= 0) newErrors.vehicleLifetimeKm = 'Ingresá la vida útil estimada en km';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Progression Handlers
    const handleStep1Next = () => setStep(2);

    const handleStep2Next = () => {
        if (validateStep2()) {
            setStep(3);
        }
    };

    // Step 3 Toggle Handler
    const handleToggleExpense = (id: string) => {
        setExpenseSettings(prev =>
            prev.map((item: ExpenseToggle) =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
            )
        );
    };

    // Final Submission
    const handleFinish = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentVertical) return;
        const isBike = currentVertical === 'delivery' && deliveryVehicle === 'bike';

        setProfile({
            vertical: currentVertical,
            driverName: state.driverName || 'Piloto',
            vehicleName: isBike ? 'Bicicleta' : vehicleName,
            fuelPrice: isBike ? 0 : parseFloat(fuelPrice) || 0,
            kmPerLiter: isBike ? 0 : parseFloat(kmPerLiter) || 0,
            maintPerKm: parseFloat(maintPerKm) || 0,
            vehicleValue: isBike ? 0 : parseFloat(vehicleValue) || 4500000,
            vehicleLifetimeKm: isBike ? 1 : parseFloat(vehicleLifetimeKm) || 250000,
            isConfigured: true,
            expenseSettings: isBike
                ? [
                    { id: 'maintenance', label: 'Mantenimiento', enabled: true },
                ]
                : expenseSettings
        });
    };

    return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
            <div className="min-h-screen flex flex-col max-w-md mx-auto relative px-6 py-12 pb-32">
                {/* Visual Indicators */}
                <div className="flex gap-2 mb-8 select-none pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-500",
                                i === step ? "bg-primary shadow-[0_0_10px_var(--color-primary-glow)]" :
                                    i < step ? "bg-primary/50" : "bg-white/10"
                            )}
                        />
                    ))}
                </div>

                {/* Orchestration Switch */}
                {step === 1 && (
                    <OnboardingStep1
                        vertical={currentVertical}
                        onSelect={setCurrentVertical}
                        onNext={handleStep1Next}
                    />
                )}

                {step === 2 && currentVertical && (
                    <OnboardingStep2
                        vertical={currentVertical}
                        deliveryVehicle={deliveryVehicle}
                        setDeliveryVehicle={setDeliveryVehicle}
                        vehicleName={vehicleName}
                        setVehicleName={setVehicleName}
                        fuelPrice={fuelPrice}
                        setFuelPrice={setFuelPrice}
                        kmPerLiter={kmPerLiter}
                        setKmPerLiter={setKmPerLiter}
                        maintPerKm={maintPerKm}
                        setMaintPerKm={setMaintPerKm}
                        useAutoAmortization={useAutoAmortization}
                        setUseAutoAmortization={setUseAutoAmortization}
                        vehicleValue={vehicleValue}
                        setVehicleValue={setVehicleValue}
                        vehicleLifetimeKm={vehicleLifetimeKm}
                        setVehicleLifetimeKm={setVehicleLifetimeKm}
                        errors={errors}
                        setErrors={setErrors}
                        onNext={handleStep2Next}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <OnboardingStep3
                        expenseSettings={expenseSettings}
                        fuelPrice={fuelPrice}
                        maintPerKm={maintPerKm}
                        vehicleValue={vehicleValue}
                        vehicleLifetimeKm={vehicleLifetimeKm}
                        onToggleExpense={handleToggleExpense}
                        onFinish={handleFinish}
                        onBack={() => setStep(2)}
                    />
                )}
            </div>
        </div>
    );
};
