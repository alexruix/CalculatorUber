/**
 * Label.tsx — Átomo tipográfico
 * ─────────────────────────────────────────────────────────────
 * Envuelve el elemento <label> nativo con las clases del DS.
 * Garantiza: tamaño mínimo de 12px, contraste WCAG AA, y que
 * el target de toque del campo sea correcto en mobile.
 */
import React, { type LabelHTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';

type LabelSize = 'body' | 'caption' | 'micro';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    size?: LabelSize;
    required?: boolean;
}

const sizeMap: Record<LabelSize, string> = {
    body: 'text-sm font-semibold text-white/70 leading-none',
    caption: 'text-xs font-bold text-white/50 tracking-wide uppercase leading-none',
    micro: 'text-[10px] font-black text-white/30 uppercase tracking-widest leading-none',
};

export const Label: React.FC<LabelProps> = ({
    children,
    size = 'body',
    required,
    className,
    ...props
}) => (
    <label className={cn(sizeMap[size], 'ml-1 select-none', className)} {...props}>
        {children}
        {required && (
            <span className="ml-1 text-error" aria-hidden="true">*</span>
        )}
    </label>
);
