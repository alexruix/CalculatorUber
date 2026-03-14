import React, { useEffect, useState } from 'react';
import { TimerReset, Map as MapIcon, RotateCcw, NotebookPen, Car } from '../../../lib/icons';
import { useCalculatorStore } from '../../../store/useCalculatorStore';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { SHIFT_CLOSE } from '../../../data/ui-strings';
import type { ShiftClose } from '../../../types/calculator.types';

export const ShiftCloseForm: React.FC = () => {
    const { shiftClose, setShiftClose } = useCalculatorStore();
    const f = SHIFT_CLOSE.fields;

    const [local, setLocal] = useState<Partial<ShiftClose>>(() => shiftClose || {});

    // Sincronizar hacia el store
    useEffect(() => {
        // Solo guardamos si están las horas obligatorias
        if (local.shiftStartTime && local.shiftEndTime) {
            setShiftClose(local as ShiftClose);
        } else {
            // Si falta alguno, no hay cierre válido calculable
            setShiftClose(null);
        }
    }, [local, setShiftClose]);

    // Handle reset / incoming changes from store
    useEffect(() => {
        if (!shiftClose) {
            setLocal({});
        } else if (shiftClose !== local && Object.keys(local).length === 0) {
            // Si el estado local está vacío y llega estado inicial
            setLocal(shiftClose);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shiftClose]);

    const updateField = (field: keyof ShiftClose, value: string) => {
        setLocal(prev => {
            const next = { ...prev };
            if (field === 'shiftStartTime' || field === 'shiftEndTime') {
                next[field] = value;
            } else {
                next[field] = value ? parseFloat(value) : undefined;
            }
            return next;
        });
    };

    const handleClear = () => {
        if (window.confirm('¿Limpiar los datos del cierre?')) {
            setShiftClose(null);
            setLocal({});
        }
    };

    return (
        <div className="card-main space-y-5">
            {/* Header */}
            <div className="text-center pb-3 border-b border-white/5">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    {SHIFT_CLOSE.sectionTitle}
                </h3>
                <p className="text-xs text-white/70 mt-0.5">
                    {SHIFT_CLOSE.sectionSubtitle}
                </p>
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-3">
                <div className="field-wrapper">
                    <Label htmlFor="shiftStartTime" required>{f.shiftStartTime.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <TimerReset className="field-icon-left text-info" aria-hidden="true" />
                        <Input
                            id="shiftStartTime"
                            type="time"
                            placeholder={f.shiftStartTime.placeholder}
                            value={local.shiftStartTime || ''}
                            onChange={(e) => updateField('shiftStartTime', e.target.value)}
                            className="pl-12 font-black border-info/30 bg-info/5 appearance-none"
                        />
                    </div>
                </div>
                <div className="field-wrapper">
                    <Label htmlFor="shiftEndTime" required>{f.shiftEndTime.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <TimerReset className="field-icon-left text-info" aria-hidden="true" />
                        <Input
                            id="shiftEndTime"
                            type="time"
                            placeholder={f.shiftEndTime.placeholder}
                            value={local.shiftEndTime || ''}
                            onChange={(e) => updateField('shiftEndTime', e.target.value)}
                            className="pl-12 font-black border-info/30 bg-info/5 appearance-none"
                        />
                    </div>
                </div>
            </div>

            {/* Odómetros */}
            <div className="grid grid-cols-2 gap-3">
                <div className="field-wrapper">
                    <Label htmlFor="odometerStart">{f.odometerStart.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <Car className="field-icon-left" aria-hidden="true" />
                        <Input
                            id="odometerStart"
                            type="number"
                            placeholder={f.odometerStart.placeholder}
                            value={local.odometerStart || ''}
                            onChange={(e) => updateField('odometerStart', e.target.value)}
                            className="pl-12"
                        />
                    </div>
                </div>
                <div className="field-wrapper">
                    <Label htmlFor="odometerEnd">{f.odometerEnd.label}</Label>
                    <div className="field-input-wrapper mt-2">
                        <Car className="field-icon-left" aria-hidden="true" />
                        <Input
                            id="odometerEnd"
                            type="number"
                            placeholder={f.odometerEnd.placeholder}
                            value={local.odometerEnd || ''}
                            onChange={(e) => updateField('odometerEnd', e.target.value)}
                            className="pl-12"
                        />
                    </div>
                </div>
            </div>

            {/* Gastos Extras */}
            <div className="field-wrapper">
                <Label htmlFor="extraExpenses">{f.extraExpenses.label}</Label>
                <div className="field-input-wrapper mt-2">
                    <MapIcon className="field-icon-left" aria-hidden="true" />
                    <Input
                        id="extraExpenses"
                        type="number"
                        inputMode="decimal"
                        placeholder={f.extraExpenses.placeholder}
                        value={local.extraExpenses || ''}
                        onChange={(e) => updateField('extraExpenses', e.target.value)}
                        className="pl-12"
                    />
                </div>
                <p className="mt-1 ml-1 text-xs text-white/60">
                    {f.extraExpenses.hint}
                </p>
            </div>

            <Button onClick={handleClear} variant="ghost" className="w-full text-white/60 hover:text-white/80">
                <RotateCcw className="w-4 h-4 mr-2" />
                {SHIFT_CLOSE.clearButton}
            </Button>
        </div>
    );
};
