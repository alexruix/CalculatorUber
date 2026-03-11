/**
 * TripInputForm.tsx - IMPROVED VERSION
 * 
 * UX Improvements:
 * - 24-hour time format (no AM/PM confusion)
 * - Peajes/Extras moved to collapsible section (low frequency)
 * - Dynamic cost calculation text based on active expenses
 * - Consistent color hierarchy (primary = money, secondary = time)
 * - Progressive disclosure for optional fields
 * - Copy from clipboard detection for Fare (future enhancement)
 */

import React, { useMemo } from 'react';
import {
    DollarSign,
    Navigation,
    Clock,
    Coins,
    MapPin,
    Timer,
    NotebookPen,
    Minus,
    Plus,
    ChevronDown,
} from '../../../lib/icons';
import { cn } from '../../../lib/utils';
import { useCalculatorStore } from '../../../store/useCalculatorStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { Input } from '../../../components/ui/atoms/Input';
import { Button } from '../../../components/ui/atoms/Button';
import { Label } from '../../../components/ui/atoms/Label';

interface TripInputFormProps {
    onSave: () => void;
    isValid: boolean;
}

export const TripInputForm: React.FC<TripInputFormProps> = ({
    onSave,
    isValid,
}) => {
    const { vertical, expenseSettings } = useProfileStore();
    const {
        fare,
        setFare,
        distTrip,
        setDistTrip,
        duration,
        setDuration,
        startTime,
        setStartTime,
        tip,
        setTip,
        tolls,
        setTolls,
    } = useCalculatorStore();

    const [showExtras, setShowExtras] = React.useState(false);

    // Adjust value with +/- buttons
    const adjustValue = (
        value: string,
        setter: (v: string) => void,
        step: number
    ) => {
        const current = parseFloat(value) || 0;
        setter(Math.max(0, current + step).toString());
    };

    // Dynamic cost calculation text based on active expenses
    const activeCostsText = useMemo(() => {
        const activeExpenses = expenseSettings
            .filter((e) => e.enabled)
            .map((e) => e.label.toLowerCase());

        if (activeExpenses.length === 0) {
            return 'Calculando margen bruto sin descuentos de costos.';
        }

        if (activeExpenses.length === 1) {
            return `Calculando rentabilidad basada en ${activeExpenses[0]}.`;
        }

        const last = activeExpenses.pop();
        return `Calculando rentabilidad basada en ${activeExpenses.join(', ')} y ${last}.`;
    }, [expenseSettings]);

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-start gap-3 pb-4 border-b border-white/10">
                <div className="w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary-glow)]" />
                <div className="flex-1">
                    <h3 className="font-extrabold text-starlight uppercase tracking-[0.2em] text-sm mb-1">
                        Cargá tu Viaje
                    </h3>
                    <p className="text-moon text-xs font-medium">
                        Datos tal cual figuran en la app
                    </p>
                </div>
            </div>

            {/* CORE FIELDS - Always visible, high frequency */}

            {/* 1. TARIFA COBRADA (Primary - Money) */}
            <div className="space-y-2">
                <Label size="xs" variant="muted" required>
                    Tarifa Cobrada
                </Label>

                <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-stretch">
                    {/* Minus Button */}
                    <button
                        type="button"
                        onClick={() => adjustValue(fare, setFare, -1000)}
                        className={cn(
                            'w-14 h-16 rounded-2xl border-2',
                            'bg-white/5 border-white/10',
                            'hover:bg-white/10 hover:border-white/20',
                            'active:scale-95',
                            'flex items-center justify-center',
                            'transition-all duration-200'
                        )}
                        aria-label="Restar $1000"
                    >
                        <Minus className="w-6 h-6 text-error" />
                    </button>

                    {/* Input */}
                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                            <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                        <Input
                            id="fare"
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={fare}
                            onChange={(e) => setFare(e.target.value)}
                            className={cn(
                                'h-16 pl-14 pr-6',
                                'font-extrabold text-3xl text-center',
                                'transition-all duration-300',
                                !fare && 'border-accent/50 shadow-[0_0_20px_var(--color-accent-dim)]'
                            )}
                            variant={!fare ? 'error' : 'default'}
                        />
                    </div>

                    {/* Plus Button */}
                    <button
                        type="button"
                        onClick={() => adjustValue(fare, setFare, 1000)}
                        className={cn(
                            'w-14 h-16 rounded-2xl border-2',
                            'bg-white/5 border-white/10',
                            'hover:bg-white/10 hover:border-white/20',
                            'active:scale-95',
                            'flex items-center justify-center',
                            'transition-all duration-200'
                        )}
                        aria-label="Sumar $1000"
                    >
                        <Plus className="w-6 h-6 text-primary" />
                    </button>
                </div>

                <p className="text-xs text-moon font-medium ml-1">
                    💡 Copiá el monto de la app (Uber, Didi, etc.)
                </p>
            </div>

            {/* 2. DISTANCIA + DURACIÓN (Grid 2 cols) */}
            <div className="grid grid-cols-2 gap-4">
                {/* Distance */}
                <div className="space-y-2">
                    <Label size="xs" variant="muted">
                        Kilómetros
                    </Label>
                    <Input
                        id="distance"
                        type="number"
                        inputMode="decimal"
                        placeholder="12.5"
                        value={distTrip}
                        onChange={(e) => setDistTrip(e.target.value)}
                        // icon={Navigation}
                        className="h-14 font-bold text-xl text-center"
                    />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                    <Label size="xs" variant="muted" required>
                        Duración (min)
                    </Label>
                    <Input
                        id="duration"
                        type="number"
                        inputMode="decimal"
                        placeholder="45"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        // icon={Timer}
                        className={cn(
                            'h-14 font-bold text-xl text-center',
                            !duration && 'border-accent/50 shadow-[0_0_15px_var(--color-accent-dim)]'
                        )}
                        variant={!duration ? 'error' : 'default'}
                    />
                </div>
            </div>

            {/* 3. HORA DE INICIO (24hs format) */}
            <div className="space-y-2">
                <Label size="xs" variant="muted">
                    Hora de Inicio
                </Label>
                <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    // icon={Clock}
                    className="h-14 font-mono text-lg tracking-wider bg-secondary/5 border-secondary/20"
                />
                <p className="text-xs text-moon font-medium ml-1">
                    Para calcular tiempo de espera entre viajes
                </p>
            </div>

            {/* OPTIONAL FIELDS - Progressive Disclosure */}

            {/* 4. PROPINAS (Solo Delivery) */}
            {vertical === 'delivery' && (
                <div className="space-y-2 animate-fade-in">
                    <Label size="xs" variant="muted">
                        Propinas
                    </Label>
                    <Input
                        id="tip"
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                        // icon={Coins}
                        className="h-14 font-bold text-xl"
                    />
                </div>
            )}

            {/* 5. EXTRAS (Collapsible - Low frequency) */}
            <div
                className={cn(
                    'rounded-2xl border-2 transition-all duration-300',
                    showExtras
                        ? 'bg-white/5 border-white/20'
                        : 'bg-white/3 border-white/10'
                )}
            >
                {/* Toggle Header */}
                <button
                    type="button"
                    onClick={() => setShowExtras(!showExtras)}
                    className={cn(
                        'w-full p-4 flex items-center justify-between',
                        'hover:bg-white/5 transition-colors',
                        'rounded-2xl'
                    )}
                >
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-moon" />
                        <div className="text-left">
                            <p className="text-sm font-bold text-starlight">
                                Gastos Extra
                            </p>
                            <p className="text-xs text-moon">
                                Peajes, estacionamiento, etc.
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        className={cn(
                            'w-5 h-5 text-moon transition-transform duration-300',
                            showExtras && 'rotate-180'
                        )}
                    />
                </button>

                {/* Collapsible Content */}
                {showExtras && (
                    <div className="px-4 pb-4 pt-2 space-y-2 animate-fade-in">
                        <Label size="xs" variant="muted">
                            Peajes y Estacionamiento
                        </Label>
                        <Input
                            id="tolls"
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={tolls}
                            onChange={(e) => setTolls(e.target.value)}
                            // icon={MapPin}
                            className="h-14 font-bold"
                        />
                        <p className="text-xs text-moon font-medium">
                            Se restará de tu ganancia neta
                        </p>
                    </div>
                )}
            </div>

            {/* Dynamic Cost Calculation Info */}
            <div className="bg-secondary/10 border-l-4 border-secondary/50 px-4 py-3 rounded-r-xl">
                <p className="text-xs text-starlight/80 font-medium leading-relaxed">
                    {activeCostsText}
                </p>
            </div>

            {/* CTA - Fixed at bottom on mobile */}
            <div className="pt-4 sticky bottom-4 z-10 sm:static">
                <Button
                    disabled={!isValid}
                    onClick={onSave}
                    variant="neon"
                    fullWidth
                    size="lg"
                    glow
                    className={cn(
                        'h-16 uppercase text-base tracking-widest',
                        'shadow-[0_10px_40px_-5px_var(--color-primary-glow)]',
                        'flex items-center justify-center gap-3'
                    )}
                >
                    <NotebookPen className="w-6 h-6" />
                    Guardar Viaje
                </Button>
            </div>
        </div>
    );
};

TripInputForm.displayName = 'TripInputForm';