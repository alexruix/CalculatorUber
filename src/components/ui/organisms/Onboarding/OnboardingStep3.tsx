import React from 'react';
import { CheckCircle2, ChevronLeft, Info } from '../../../../lib/icons';
import { cn } from '../../../../lib/utils';
import { Button } from '../../atoms/Button';
import type { ExpenseToggle } from '../../../../types/calculator.types';
import { EXPENSE_META, ONBOARDING_TEXTS } from '../../../../data/onboardingContent';

interface OnboardingStep3Props {
    expenseSettings: ExpenseToggle[];
    fuelPrice: string;
    maintPerKm: string;
    vehicleValue: string;
    vehicleLifetimeKm: string;
    onToggleExpense: (id: string) => void;
    onFinish: (e: React.FormEvent) => void;
    onBack: () => void;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
    expenseSettings,
    fuelPrice,
    maintPerKm,
    vehicleValue,
    vehicleLifetimeKm,
    onToggleExpense,
    onFinish,
    onBack
}) => {
    const textConfig = ONBOARDING_TEXTS.step3;

    return (
        <form onSubmit={onFinish} className="space-y-6 animate-fade-in">
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
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-starlight uppercase tracking-tight">
                            {textConfig.title}
                        </h2>
                        <p className="text-sm text-primary font-semibold mt-0.5">
                            {textConfig.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div
                className={cn(
                    'flex items-start gap-3 p-4',
                    'bg-primary/10 border-2 border-primary/30 rounded-2xl'
                )}
            >
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-medium text-starlight/80 leading-relaxed">
                    {textConfig.infoCard.split('ROI en tiempo real')[0]}
                    <strong className="text-primary">ROI en tiempo real</strong>.
                </p>
            </div>

            {/* Expense Toggles */}
            <fieldset className="space-y-3 border-0 p-0 m-0">
                <legend className="sr-only">Gastos a incluir en el cálculo</legend>

                {expenseSettings.map((expense) => {
                    const meta = EXPENSE_META[expense.id];
                    if (!meta) return null;

                    const { Icon, label, description } = meta;
                    const isOn = expense.enabled;

                    // Dynamic description based on expense type
                    let dynamicDesc = description;
                    if (expense.id === 'fuel') {
                        dynamicDesc = `Calculado a $${fuelPrice || '1600'}/L`;
                    } else if (expense.id === 'maintenance') {
                        dynamicDesc = `Reserva de $${maintPerKm || '15'}/km para gastos corrientes`;
                    } else if (expense.id === 'amortization') {
                        const amortizationPerKm = vehicleValue && vehicleLifetimeKm
                            ? Math.round(parseFloat(vehicleValue) / parseFloat(vehicleLifetimeKm))
                            : null;
                        dynamicDesc = amortizationPerKm
                            ? `~$${amortizationPerKm}/km (÷ vida útil)`
                            : 'Depreción del vehículo por km recorrido';
                    }

                    return (
                        <button
                            key={expense.id}
                            type="button"
                            role="switch"
                            aria-checked={isOn}
                            onClick={() => onToggleExpense(expense.id)}
                            className={cn(
                                'w-full p-4 rounded-2xl border-2 transition-all duration-300',
                                'flex items-center gap-4',
                                'text-left',
                                'hover:scale-[1.01] active:scale-[0.99]',
                                isOn ? (
                                    'bg-primary/10 border-primary/30 shadow-[0_0_20px_var(--color-primary-glow)]'
                                ) : (
                                    'bg-white/5 border-white/10 hover:border-white/20'
                                )
                            )}
                        >
                            {/* Icon */}
                            <div
                                className={cn(
                                    'w-14 h-14 rounded-xl border-2 flex items-center justify-center shrink-0',
                                    isOn ? (
                                        'bg-primary/10 border-primary/30'
                                    ) : (
                                        'bg-white/5 border-white/10'
                                    )
                                )}
                            >
                                <Icon
                                    size={24}
                                    className={isOn ? 'text-primary' : 'text-moon'}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={cn(
                                        'text-base font-extrabold mb-0.5',
                                        isOn ? 'text-starlight' : 'text-moon'
                                    )}
                                >
                                    {label}
                                </p>
                                <p
                                    className={cn(
                                        'text-xs font-medium',
                                        isOn ? 'text-starlight/60' : 'text-moon/50'
                                    )}
                                >
                                    {dynamicDesc}
                                </p>
                            </div>

                            {/* Toggle Indicator */}
                            <div
                                className={cn(
                                    'w-12 h-6 rounded-full relative shrink-0 transition-all duration-300',
                                    isOn ? 'bg-primary' : 'bg-white/20'
                                )}
                            >
                                <div
                                    className={cn(
                                        'absolute top-1 w-4 h-4 rounded-full transition-all duration-300',
                                        'bg-black',
                                        isOn ? 'left-7' : 'left-1'
                                    )}
                                />
                            </div>
                        </button>
                    );
                })}
            </fieldset>

            {/* Education Note */}
            <div
                className={cn(
                    'flex items-start gap-3 p-4',
                    'bg-white/5 border-2 border-white/10 rounded-2xl'
                )}
                role="note"
            >
                <span className="text-lg leading-none shrink-0" aria-hidden="true">
                    💡
                </span>
                <p className="text-xs text-moon font-medium leading-relaxed">
                    {textConfig.educationNote}
                </p>
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
                    {textConfig.backButton}
                </Button>

                <Button
                    type="submit"
                    variant="neon"
                    size="lg"
                    className="flex-2 flex items-center justify-center gap-2"
                >
                    <CheckCircle2 className="w-5 h-5" />
                    {textConfig.finishButton}
                </Button>
            </div>
        </form>
    );
};
