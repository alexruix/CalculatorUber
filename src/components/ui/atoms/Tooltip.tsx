/**
 * Tooltip.tsx — Átomo de accesibilidad
 * ─────────────────────────────────────────────────────────────
 * Tooltip accesible adaptado para Mobile First:
 * - En desktop: aparece al hover.
 * - En mobile (touch): se muestra/oculta con tap (toggle).
 * - Usa aria-describedby para conectar trigger ↔ content.
 * - Touch target mínimo de 44×44px (WCAG 2.5.5).
 */
import React, { useState, useId } from 'react';
import { Info } from '../../../lib/icons';
import { cn } from '../../../lib/utils';

interface TooltipProps {
    content: string;
    /** Clase adicional para el trigger */
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, className }) => {
    const [visible, setVisible] = useState(false);
    const id = useId();

    return (
        <span className={cn('relative inline-flex items-center', className)}>
            <button
                type="button"
                aria-describedby={id}
                aria-expanded={visible}
                onClick={() => setVisible(v => !v)}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                // ≥44×44px touch target via padding invisible
                className="flex items-center justify-center w-5 h-5 -m-2 p-2 text-white/30 hover:text-brand-sea transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sea rounded"
                aria-label="Más información"
            >
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {visible && (
                <span
                    id={id}
                    role="tooltip"
                    className={cn(
                        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
                        'w-48 rounded-xl px-3 py-2',
                        'bg-brand-navy border border-white/10 shadow-lg',
                        'text-[11px] font-medium text-brand-cold leading-relaxed',
                        'animate-in fade-in zoom-in-95 duration-150',
                    )}
                >
                    {content}
                    {/* Careta */}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-navy" aria-hidden="true" />
                </span>
            )}
        </span>
    );
};
