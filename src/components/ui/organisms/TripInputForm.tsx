/**
 * TripInputForm.tsx — Formulario de Cierre de Turno
 * ─────────────────────────────────────────────────────────────
 * Mobile First: inputs con altura mínima de 48px, botones de ±
 * con touch targets correctos, layout en grid responsive.
 *
 * Textos provienen de /data/ui-strings.ts (TRIP_FORM namespace).
 */
import React, { useEffect } from 'react';
import { DollarSign, Navigation, Clock, Coins, Map as MapIcon, TimerReset, NotebookPen, Minus, Plus } from '../../../lib/icons';
import { useCalculatorStore } from '../../../store/useCalculatorStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { cn } from '../../../lib/utils';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Label } from '../atoms/Label';
import { GlassCard } from '../molecules/GlassCard';
import { TRIP_FORM } from '../../../data/ui-strings';

interface TripInputFormProps {
    onSave: () => void;
    isValid: boolean;
}

export const TripInputForm: React.FC<TripInputFormProps> = ({ onSave, isValid }) => {
    const { vertical } = useProfileStore();
    const {
        fare, setFare,
        distTrip, setDistTrip,
        duration, setDuration,
        startTime, setStartTime,
        tip, setTip,
        tolls, setTolls
    } = useCalculatorStore();

    const adjustValue = (value: string, setter: (v: string) => void, step: number) => {
        const current = parseFloat(value) || 0;
        setter(Math.max(0, current + step).toString());
    };

    const f = TRIP_FORM.fields;

    return (
        <div className="space-y-6 pb-10">
            {/* Header de sección - Telemetry HUD Style */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_var(--color-primary-glow)]" />
                <div className="flex-1">
                    <h3 className="font-extrabold text-starlight uppercase tracking-[0.2em] text-xs mb-0.5">
                        {TRIP_FORM.sectionTitle}
                    </h3>
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest leading-none">
                        {TRIP_FORM.sectionSubtitle}
                    </p>
                </div>
            </div>

            {/* Recaudación Total — StepperInput de alto impacto */}
            <div className="space-y-3">
                <label 
                    htmlFor="field-fare" 
                    className="font-extrabold uppercase text-[10px] tracking-widest text-moon block ml-1"
                >
                    {f.fare.label} <span className="text-accent ml-1">*</span>
                </label>
                
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-stretch h-20">
                    <Button
                        variant="secondary-dark"
                        className="h-full w-16 px-0"
                        onClick={() => adjustValue(fare, setFare, -5000)}
                        aria-label={f.fare.adjustMinus}
                    >
                        <Minus className="w-6 h-6 text-error" />
                    </Button>
                    
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary pointer-events-none transition-transform group-focus-within:scale-110">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <Input
                            id="field-fare"
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={fare}
                            onChange={(e) => setFare(e.target.value)}
                            className={cn(
                                "h-full pl-14 pr-6 font-extrabold text-center text-3xl transition-all duration-300",
                                !fare && "border-accent/40 shadow-[inset_0_0_15px_var(--color-accent-dim)]"
                            )}
                        />
                    </div>

                    <Button
                        variant="secondary-dark"
                        className="h-full w-16 px-0"
                        onClick={() => adjustValue(fare, setFare, 5000)}
                        aria-label={f.fare.adjustPlus}
                    >
                        <Plus className="w-6 h-6 text-primary" />
                    </Button>
                </div>
            </div>

            {/* Kilómetros y Duración - Grid 2 Columnas */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="font-extrabold uppercase text-[10px] tracking-widest text-moon block ml-1">
                        {f.distance.label}
                    </label>
                    <Input
                        id="field-dist"
                        type="number"
                        placeholder={f.distance.placeholder}
                        value={distTrip}
                        onChange={(e) => setDistTrip(e.target.value)}
                        icon={<Navigation className="w-5 h-5" />}
                        className="font-extrabold text-xl text-center"
                    />
                </div>

                <div className="space-y-3">
                    <label className="font-extrabold uppercase text-[10px] tracking-widest text-moon block ml-1">
                        {f.duration.label} <span className="text-accent ml-1">*</span>
                    </label>
                    <Input
                        id="field-duration"
                        type="number"
                        placeholder={f.duration.placeholder}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        icon={<TimerReset className="w-5 h-5" />}
                        className={cn(
                            "font-extrabold text-xl text-center",
                            !duration && "border-accent/40 shadow-[inset_0_0_15px_var(--color-accent-dim)]"
                        )}
                    />
                </div>
            </div>

            {/* Hora Inicio + Gastos Extras */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="font-extrabold uppercase text-[10px] tracking-widest text-moon block ml-1">
                        {f.startTime.label}
                    </label>
                    <div className="relative group">
                        <Input
                            id="field-starttime"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            icon={<Clock className="w-5 h-5 text-secondary" />}
                            className="font-extrabold tracking-wider bg-secondary/5 border-secondary/20 h-14"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="font-extrabold uppercase text-[10px] tracking-widest text-moon block ml-1">
                        {f.expenses.label}
                    </label>
                    <Input
                        id="field-expenses"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.expenses.placeholder}
                        value={tolls}
                        onChange={(e) => setTolls(e.target.value)}
                        icon={<MapIcon className="w-5 h-5" />}
                        className="font-extrabold h-14"
                    />
                </div>
            </div>

            {/* Propinas (Solo Delivery) */}
            {vertical === 'delivery' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="font-extrabold uppercase text-[10px] tracking-widest text-moon block ml-1">
                        {f.tips.label}
                    </label>
                    <Input
                        id="field-tips"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.tips.placeholder}
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                        icon={<Coins className="w-5 h-5 text-primary" />}
                        className="font-extrabold h-14"
                    />
                </div>
            )}

            {/* Footer Desc - Sunlight Visibility Optimization */}
            <div className="bg-white/5 border-l-2 border-white/20 px-4 py-3 rounded-r-xl">
                <p className="text-white/50 text-[10px] font-bold leading-normal uppercase tracking-wider mb-0">
                    Calculando rentabilidad basada en tus costos de combustible, mantenimiento y amortización.
                </p>
            </div>

            {/* CTA - Thumb Zone Navigation */}
            <div className="pt-4 sticky bottom-4 z-10 sm:static">
                <Button 
                    disabled={!isValid} 
                    onClick={onSave} 
                    variant="neon" 
                    fullWidth 
                    size="lg"
                    className="h-20 sm:h-auto uppercase text-xl sm:text-lg tracking-widest shadow-[0_10px_40px_-5px_var(--color-primary-glow)]"
                >
                    <NotebookPen className="w-6 h-6 mr-1" />
                    {TRIP_FORM.saveButton}
                </Button>
            </div>
        </div>
    );
};
