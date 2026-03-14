/**
 * TripInputForm.tsx — Formulario de Carga de Viaje v2
 * ─────────────────────────────────────────────────────────────
 * Mejoras UX:
 * - Hora en formato 24hs (sin AM/PM)
 * - Peajes/Extras en sección colapsable (baja frecuencia)
 * - Texto dinámico basado en gastos activos del perfil
 * - Ley de Proximidad: Bloque de tiempo unificado (Día + Hora)
 * - Errores en frío eliminados (UX amigable)
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
// Importamos formatDateLatam desde utilidades
import { cn, formatDateLatam } from '../../../lib/utils';
import { useCalculatorStore } from '../../../store/useCalculatorStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Label } from '../atoms/Label';
import { TRIP_FORM, HOME_SCREEN } from '../../../data/ui-strings';

interface TripInputFormProps {
    onSave: () => void;
    isValid: boolean;
    onOpenDateOverride: () => void;
    // Nuevas props para la Ley de Proximidad
    overrideDate?: string;
    onClearDateOverride: () => void;
}

export const TripInputForm: React.FC<TripInputFormProps> = ({
    onSave,
    isValid,
    onOpenDateOverride,
    overrideDate,
    onClearDateOverride
}) => {
    const { vertical, expenseSettings } = useProfileStore();
    const {
        fare, setFare,
        distTrip, setDistTrip,
        duration, setDuration,
        startTime, setStartTime,
        tip, setTip,
        tolls, setTolls,
    } = useCalculatorStore();

    const [showExtras, setShowExtras] = React.useState(false);

    // LÓGICA DE SEGMENTACIÓN HORARIA
    const timeBadge = useMemo(() => {
        if (!startTime || !startTime.includes(':')) return null;

        const hour = parseInt(startTime.split(':')[0]);
        const t = HOME_SCREEN.timePeriods;

        // Madrugada (Corte de jornada)
        if (hour >= 0 && hour < 6) return {
            label: t.dawn,
            color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
        // Mañana
        if (hour >= 6 && hour < 12) return {
            label: t.morning,
            color: 'bg-primary/20 text-primary border-primary/30'
        };
        // Tarde
        if (hour >= 12 && hour < 19) return {
            label: t.afternoon,
            color: 'bg-accent/20 text-accent border-accent/30'
        };
        // Noche
        return {
            label: t.night,
            color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        };
    }, [startTime]);

    const adjustValue = (value: string, setter: (v: string) => void, step: number) => {
        const current = parseFloat(value) || 0;
        setter(Math.max(0, current + step).toString());
    };

    const activeCostsText = useMemo(() => {
        const activeExpenses = (expenseSettings ?? [])
            .filter((e) => e.enabled)
            .map((e) => e.label.toLowerCase());

        if (activeExpenses.length === 0) return 'Calculando margen bruto sin descuentos de costos.';
        if (activeExpenses.length === 1) return `Calculando rentabilidad basada en ${activeExpenses[0]}.`;
        const last = [...activeExpenses].pop();
        const rest = activeExpenses.slice(0, -1);
        return `Calculando rentabilidad basada en ${rest.join(', ')} y ${last}.`;
    }, [expenseSettings]);

    const f = TRIP_FORM.fields;

    return (
        <div className="space-y-6 pb-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary-glow)]" />
                <div className="flex-1">
                    <h3 className="font-extrabold text-starlight uppercase tracking-[0.2em] text-sm mb-0.5">
                        {TRIP_FORM.sectionTitle}
                    </h3>
                    <p className="text-moon text-xs font-medium">
                        {TRIP_FORM.sectionSubtitle}
                    </p>
                </div>
            </div>

            {/* 1. TARIFA COBRADA */}
            <div className="space-y-3">
                <Label htmlFor="field-fare" size="xs" variant="muted" required>
                    {f.fare.label}
                </Label>

                <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-stretch h-16">
                    <button
                        type="button"
                        onClick={() => adjustValue(fare, setFare, -1000)}
                        className="w-14 h-16 rounded-2xl border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0"
                    >
                        <Minus className="w-6 h-6 text-error" />
                    </button>

                    <div className="relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10 ">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <Input
                            id="field-fare"
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={fare}
                            onChange={(e) => setFare(e.target.value)}
                            className="h-16 pl-14 pr-4 font-extrabold text-3xl text-center transition-all duration-300"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => adjustValue(fare, setFare, 1000)}
                        className="w-14 h-16 rounded-2xl border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-200 flex items-center justify-center shrink-0"
                    >
                        <Plus className="w-6 h-6 text-primary" />
                    </button>
                </div>
                <p className="text-[11px] text-moon font-medium ml-1">
                    💡 Copiá el monto directo de la app
                </p>
            </div>

            {/* 2. BLOQUE TEMPORAL (Unificado: Fecha + Hora + Contexto) */}
            <div className={cn(
                "p-4 rounded-3xl border-2 transition-all duration-500",
                overrideDate
                    ? "bg-warning/5 border-warning/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]"
                    : "bg-white/5 border-white/5"
            )}>
                {/* Header del bloque: Label + Trigger de Fecha */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <Label htmlFor="field-starttime" size="xs" variant="muted" className="mb-0">
                        {overrideDate ? 'Datos del viaje anterior' : f.startTime.label}
                    </Label>
                </div>

                <div className="space-y-3">
                    {/* Banner Retroactivo (Solo si existe overrideDate) */}
                    {overrideDate && (
                        <div className="flex items-center justify-between bg-warning/20 border border-warning/30 rounded-xl px-4 py-2.5 animate-in zoom-in-95 duration-300">
                            <div className="flex items-center gap-2">
                                <span className="text-base">📅</span>
                                <p className="text-[11px] font-extrabold text-warning uppercase tracking-wider">
                                    Agregar viaje del {formatDateLatam(overrideDate, 'short')}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClearDateOverride}
                                className="text-xs font-bold text-white/40 hover:text-white transition-colors p-1"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}

                    {/* Input de Hora con Badge Dinámico */}
                    <div className="relative group">
                        <Input
                            id="field-starttime"
                            type="time"
                            step="60" // Evita que aparezcan los segundos en algunos navegadores
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            icon={<Clock className="w-5 h-5 text-secondary" />}
                            // Aplicamos scheme-dark para que el picker nativo sea oscuro
                            className="h-14 font-mono text-lg tracking-wider bg-secondary/5 border-secondary/20 scheme-dark"
                        />
                    </div>

                    <div className="flex items-end justify-between mt-1">                        

                        {!overrideDate && (
                            <button
                                type="button"
                                onClick={onOpenDateOverride}
                                className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                            >
                                {f.startTime.dateTrigger}
                            </button>
                        )}
                    </div>
                    {/* Hint inferior (Feedback sutil) */}
                    {/* <div className="px-1 flex justify-between items-center">
                        <p className="text-[10px] text-moon font-medium italic">
                            {f.startTime.hint}
                        </p>
                        {overrideDate && (
                            <span className="text-[9px] font-bold text-warning/50 animate-pulse">
                                MODO RETROACTIVO
                            </span>
                        )}
                    </div> */}
                </div>
            </div>

            {/* 3. DISTANCIA + DURACIÓN */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="field-dist" size="xs" variant="muted">
                        {f.distance.label}
                    </Label>
                    <Input
                        id="field-dist"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.distance.placeholder}
                        value={distTrip}
                        onChange={(e) => setDistTrip(e.target.value)}
                        icon={<Navigation className="w-5 h-5" />}
                        className="h-14 font-bold text-xl text-center"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="field-duration" size="xs" variant="muted" required>
                        {f.duration.label}
                    </Label>
                    <Input
                        id="field-duration"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.duration.placeholder}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        icon={<Timer className="w-5 h-5" />}
                        className="h-14 font-bold text-xl text-center"
                    />
                </div>
            </div>



            {/* 4. PROPINAS — Solo Delivery */}
            {vertical === 'delivery' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="field-tips" size="xs" variant="muted">
                        {f.tips.label}
                    </Label>
                    <Input
                        id="field-tips"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.tips.placeholder}
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                        icon={<Coins className="w-5 h-5 text-primary" />}
                        className="h-14 font-bold text-xl"
                    />
                </div>
            )}

            {/* 5. GASTOS EXTRAS */}
            <div className={cn(
                'rounded-2xl border-2 transition-all duration-300',
                showExtras ? 'bg-white/5 border-white/20' : 'bg-white/2 border-white/10'
            )}>
                <button
                    type="button"
                    onClick={() => setShowExtras(!showExtras)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors rounded-2xl"
                    aria-expanded={showExtras}
                >
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-moon" />
                        <div className="text-left">
                            <p className="text-sm font-bold text-starlight">{f.expenses.label}</p>
                            <p className="text-xs text-moon">Toca para agregar peajes</p>
                        </div>
                    </div>
                    <ChevronDown
                        className={cn(
                            'w-5 h-5 text-moon transition-transform duration-300',
                            showExtras && 'rotate-180'
                        )}
                    />
                </button>

                {showExtras && (
                    <div className="px-4 pb-4 pt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Input
                            id="field-expenses"
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={tolls}
                            onChange={(e) => setTolls(e.target.value)}
                            icon={<MapPin className="w-5 h-5" />}
                            className="h-14 font-bold"
                        />
                        <p className="text-xs text-moon font-medium ml-1">
                            Se restará de tu ganancia neta
                        </p>
                    </div>
                )}
            </div>

            {/* Costos activos */}
            <div className="bg-secondary/10 border-l-4 border-secondary/40 px-4 py-3 rounded-r-2xl">
                <p className="text-[11px] text-starlight/70 font-medium leading-relaxed mb-0">
                    {activeCostsText}
                </p>
            </div>

            {/* CTA */}
            <div className="pt-6">
                <Button
                    disabled={!isValid}
                    onClick={onSave}
                    variant="neon"
                    fullWidth
                    size="lg"
                    glow={isValid}
                    className="h-16 uppercase text-base tracking-widest shadow-[0_10px_40px_-5px_var(--color-primary-glow)]"
                >
                    <NotebookPen className="w-6 h-6" />
                    {TRIP_FORM.saveButton}
                </Button>
            </div>
        </div>
    );
};

TripInputForm.displayName = 'TripInputForm';