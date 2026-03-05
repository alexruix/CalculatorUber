/**
 * TripInputForm.tsx — Formulario de Cierre de Turno
 * ─────────────────────────────────────────────────────────────
 * Mobile First: inputs con altura mínima de 48px, botones de ±
 * con touch targets correctos, layout en grid responsive.
 *
 * Textos provienen de /data/ui-strings.ts (SHIFT_FORM namespace).
 */
import React, { useEffect } from 'react';
import { DollarSign, Navigation, Clock, Coins, Map as MapIcon, TimerReset, NotebookPen, Minus, Plus } from '../../../lib/icons';
import { useCalculatorStore } from '../../../store/useCalculatorStore';
import { useProfileStore } from '../../../store/useProfileStore';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { GlassCard } from '../molecules/GlassCard';
import { SHIFT_FORM } from '../../../data/ui-strings';

interface TripInputFormProps {
    onSave: () => void;
    isValid: boolean;
}

export const TripInputForm: React.FC<TripInputFormProps> = ({ onSave, isValid }) => {
    const { vertical } = useProfileStore();
    const {
        fare, setFare,
        distTrip, setDistTrip,
        distPickup, setDistPickup,
        duration, setDuration,
        activeTime, setActiveTime,
        tip, setTip,
        tolls, setTolls
    } = useCalculatorStore();

    useEffect(() => {
        if (distPickup !== '0') setDistPickup('0');
    }, [distPickup, setDistPickup]);

    const adjustValue = (value: string, setter: (v: string) => void, step: number) => {
        const current = parseFloat(value) || 0;
        setter(Math.max(0, current + step).toString());
    };

    const f = SHIFT_FORM.fields;

    return (
        <div className="card-main space-y-5">
            {/* Header de sección */}
            <div className="text-center pb-3 border-b border-white/5">
                <h3 className="font-black text-white uppercase tracking-widest"
                    style={{ fontSize: 'var(--text-label)' }}>
                    {SHIFT_FORM.sectionTitle}
                </h3>
                <p className="text-white/40 mt-0.5" style={{ fontSize: 'var(--text-caption)' }}>
                    {SHIFT_FORM.sectionSubtitle}
                </p>
            </div>

            {/* Recaudación Total — con stepper de ±5000 */}
            <div className="field-wrapper">
                <Label htmlFor="field-fare" required>{f.fare.label}</Label>
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        variant="icon"
                        className="border border-white/10 shrink-0"
                        onClick={() => adjustValue(fare, setFare, -5000)}
                        aria-label={f.fare.adjustMinus}
                    >
                        <Minus className="w-5 h-5" />
                    </Button>
                    <div className="field-input-wrapper flex-1">
                        <DollarSign className="field-icon-left" aria-hidden="true" />
                        <Input
                            id="field-fare"
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            value={fare}
                            onChange={(e) => setFare(e.target.value)}
                            className="pl-12 font-black text-center text-2xl sm:text-3xl"
                        />
                    </div>
                    <Button
                        variant="icon"
                        className="border border-white/10 shrink-0"
                        onClick={() => adjustValue(fare, setFare, 5000)}
                        aria-label={f.fare.adjustPlus}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Kilómetros */}
            <div className="field-wrapper">
                <Label htmlFor="field-dist">{f.distance.label}</Label>
                <div className="field-input-wrapper mt-2">
                    <Navigation className="field-icon-left" aria-hidden="true" />
                    <Input
                        id="field-dist"
                        type="number"
                        placeholder={f.distance.placeholder}
                        value={distTrip}
                        onChange={(e) => setDistTrip(e.target.value)}
                        className="pl-12 text-xl font-black text-center"
                    />
                </div>
            </div>

            {/* Horas: Conectado + En viaje  */}
            <div className="grid grid-cols-2 gap-3">
                <div className="field-wrapper">
                    <Label htmlFor="field-duration">{f.duration.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <TimerReset className="field-icon-left text-white/30" aria-hidden="true" />
                        <Input
                            id="field-duration"
                            type="number"
                            placeholder={f.duration.placeholder}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="pl-12 font-black"
                        />
                    </div>
                </div>
                <div className="field-wrapper">
                    <Label htmlFor="field-active">{f.activeTime.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <Clock className="field-icon-left text-nodo-accent" aria-hidden="true" />
                        <Input
                            id="field-active"
                            type="number"
                            placeholder={f.activeTime.placeholder}
                            value={activeTime}
                            onChange={(e) => setActiveTime(e.target.value)}
                            className="pl-12 font-black border-nodo-accent/30 bg-nodo-accent/5"
                            aria-describedby="active-hint"
                        />
                    </div>
                    <p id="active-hint" className="mt-1 ml-1 text-white/25 leading-tight"
                        style={{ fontSize: 'var(--text-micro)' }}>
                        {f.activeTime.hint}
                    </p>
                </div>
            </div>

            {/* Propinas (Delivery) + Gastos Extras */}
            <div className="grid grid-cols-2 gap-3">
                {vertical === 'delivery' && (
                    <div className="field-wrapper">
                        <Label htmlFor="field-tips">{f.tips.label}</Label>
                        <div className="field-input-wrapper mt-2">
                            <Coins className="field-icon-left" aria-hidden="true" />
                            <Input
                                id="field-tips"
                                type="number"
                                inputMode="decimal"
                                placeholder={f.tips.placeholder}
                                value={tip}
                                onChange={(e) => setTip(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                )}
                <div className={vertical === 'delivery' ? 'field-wrapper' : 'field-wrapper col-span-2'}>
                    <Label htmlFor="field-expenses">{f.expenses.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <MapIcon className="field-icon-left" aria-hidden="true" />
                        <Input
                            id="field-expenses"
                            type="number"
                            inputMode="decimal"
                            placeholder={f.expenses.placeholder}
                            value={tolls}
                            onChange={(e) => setTolls(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <p className="mt-1 ml-1 text-white/25" style={{ fontSize: 'var(--text-micro)' }}>
                        {f.expenses.hint}
                    </p>
                </div>
            </div>

            {/* CTA */}
            <Button disabled={!isValid} onClick={onSave} variant="primary">
                <NotebookPen className="w-5 h-5" aria-hidden="true" />
                {SHIFT_FORM.saveButton}
            </Button>
        </div>
    );
};
