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

interface DateOverrideModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: (date: string) => void;
}

const DEFAULT_COPY = {
    title: 'Viaje retroactivo',
    warning: 'Estás por cargar un viaje de días anteriores. Esto afectará las estadísticas de esa fecha.',
    dateLabel: 'Fecha del viaje',
    cancelBtn: 'Cancelar',
    confirmBtn: 'Confirmar',
};

export const DateOverrideModal: React.FC<DateOverrideModalProps> = ({
    isOpen,
    onCancel,
    onConfirm,
}) => {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const copy = HOME_SCREEN?.dateOverride || DEFAULT_COPY;

    useEffect(() => {
        if (isOpen) setSelectedDate(getTodayString());
    }, [isOpen]);

    const handleConfirm = () => {
        if (isValidOverrideDate(selectedDate)) onConfirm(selectedDate);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="date-override-title"
        >
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className={cn(
                'relative w-full max-w-sm',
                'bg-[#1A1A1A] border border-white/10 rounded-3xl p-6 space-y-6',
                'shadow-[0_10px_40px_rgba(0,0,0,0.8)]',
                'animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300'
            )}>
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-warning" aria-hidden="true" />
                    </div>
                    <h2 id="date-override-title" className="text-base font-black text-white uppercase tracking-tight">
                        {copy.title}
                    </h2>
                </div>

                {/* Warning */}
                <div className="bg-warning/10 border border-warning/20 rounded-2xl px-4 py-3">
                    <p className="text-xs font-medium text-warning leading-relaxed">
                        {copy.warning}
                    </p>
                </div>

                {/* Date Picker - Patrón Custom UI + Native Input */}
                <div className="space-y-2">
                    <label htmlFor="override-date" className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                        {copy.dateLabel}
                    </label>

                    <div className={cn(
                        "relative w-full h-14 rounded-2xl bg-white/5 border-2 border-white/10",
                        "focus-within:border-primary focus-within:bg-primary/5 transition-all overflow-hidden"
                    )}>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                            <Calendar className="w-5 h-5" />
                        </div>

                        {/* Texto visual formateado (Ej: "12 de marzo") */}
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
                                // Magia para WebKit/Blink: estira el botón de abrir calendario a todo el div
                                "[&::-webkit-calendar-picker-indicator]:absolute",
                                "[&::-webkit-calendar-picker-indicator]:w-full",
                                "[&::-webkit-calendar-picker-indicator]:h-full",
                                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                                "[&::-webkit-calendar-picker-indicator]:opacity-0"
                            )} />
                    </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-14 bg-white/5 text-white/80 font-bold uppercase tracking-wider rounded-2xl hover:bg-white/10 transition-colors"
                    >
                        {copy.cancelBtn}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!isValidOverrideDate(selectedDate)}
                        className="h-14 bg-warning text-black font-extrabold uppercase tracking-wider rounded-2xl shadow-[0_0_20px_var(--color-warning-glow)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        {copy.confirmBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

DateOverrideModal.displayName = 'DateOverrideModal';