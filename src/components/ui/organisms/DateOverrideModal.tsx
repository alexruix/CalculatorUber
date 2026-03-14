/**
 * DateOverrideModal.tsx — Modal para Viaje Retroactivo
 * ─────────────────────────────────────────────────────────────
 * Permite agregar un viaje con fecha de hasta 7 días atrás.
 * Se abre con long press en el FAB.
 *
 * @organism
 */
import React, { useState, useEffect } from 'react';
import { cn, formatDateLatam } from '../../../lib/utils';
import { HOME_SCREEN } from '../../../data/ui-strings';
import { AlertTriangle, Calendar } from '../../../lib/icons';
import { getTodayString, getMinOverrideDate, isValidOverrideDate } from '../../../lib/journey';
import { Button } from '../atoms/Button';
import { Label } from '../atoms/Label';
import { Modal } from '../molecules/Modal';

interface DateOverrideModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: (date: string) => void;
}

export const DateOverrideModal: React.FC<DateOverrideModalProps> = ({
    isOpen,
    onCancel,
    onConfirm,
}) => {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const copy = HOME_SCREEN?.dateOverride;

    useEffect(() => {
        if (isOpen) setSelectedDate(getTodayString());
    }, [isOpen]);

    const handleConfirm = () => {
        if (isValidOverrideDate(selectedDate)) onConfirm(selectedDate);
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel}
            title={copy.title}
            icon={<AlertTriangle className="w-5 h-5 text-warning" />}
            variant="warning"
            maxWidth="sm"
            footer={
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                        variant="secondary-dark"
                        onClick={onCancel}
                        fullWidth
                    >
                        {copy.cancelBtn}
                    </Button>
                    <Button
                        variant="neon"
                        onClick={handleConfirm}
                        disabled={!isValidOverrideDate(selectedDate)}
                        fullWidth
                        className="bg-warning text-black shadow-[0_0_20px_var(--color-warning-glow)] hover:shadow-[0_0_30px_var(--color-warning-glow)]"
                    >
                        {copy.confirmBtn}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Warning Card */}
                <div className="bg-warning/10 border border-warning/20 rounded-2xl px-4 py-3">
                    <p className="text-xs font-medium text-warning leading-relaxed">
                        {copy.warning}
                    </p>
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                    <Label htmlFor="override-date" className="ml-1">
                        {copy.dateLabel}
                    </Label>

                    <div className={cn(
                        "relative w-full h-14 rounded-2xl bg-white/5 border-2 border-white/10",
                        "focus-within:border-warning focus-within:bg-warning/5 transition-all overflow-hidden"
                    )}>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-warning">
                            <Calendar className="w-5 h-5" />
                        </div>

                        {/* Texto visual formateado */}
                        <div className="absolute inset-0 pl-12 pr-4 flex items-center pointer-events-none">
                            <span className="text-white font-bold text-lg">
                                {formatDateLatam(selectedDate, 'long')}
                            </span>
                        </div>

                        {/* Input nativo transparente */}
                        <input
                            id="override-date"
                            type="date"
                            value={selectedDate}
                            min={getMinOverrideDate()}
                            max={getTodayString()}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={cn(
                                "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
                                "[&::-webkit-calendar-picker-indicator]:absolute",
                                "[&::-webkit-calendar-picker-indicator]:w-full",
                                "[&::-webkit-calendar-picker-indicator]:h-full",
                                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                                "[&::-webkit-calendar-picker-indicator]:opacity-0"
                            )} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

DateOverrideModal.displayName = 'DateOverrideModal';