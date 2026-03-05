/**
 * SectionDivider.tsx — Átomo de layout
 * ─────────────────────────────────────────────────────────────
 * Reemplaza el patrón repetido de:
 *   <div className="pt-x border-t border-white/5" />
 *
 * También puede mostrar un label opcional de sección (Fluent 2
 * Section Header pattern).
 */
import React from 'react';
import { cn } from '../../../lib/utils';

interface SectionDividerProps {
    label?: string;
    className?: string;
    /** Elimina el borde superior (solo espacio) */
    borderless?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
    label,
    className,
    borderless = false,
}) => (
    <div className={cn('w-full', borderless ? 'pt-4' : 'pt-4 border-t border-white/5', className)}>
        {label && (
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">
                {label}
            </p>
        )}
    </div>
);
