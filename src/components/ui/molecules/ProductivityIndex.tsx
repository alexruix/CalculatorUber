/**
 * ProductivityIndex.tsx — Índice de Productividad de Jornada
 * ─────────────────────────────────────────────────────────────
 * Visualiza el tiempo productivo vs. tiempo muerto del turno.
 * Textos desde /data/ui-strings.ts (PRODUCTIVITY namespace).
 *
 * Fluent 2 Motion: usa la curva decelerate para la barra de progreso
 * (la animación entra suave, transmite que "ya llegaste").
 */
import React from 'react';
import { Zap } from '../../../lib/icons';
import { PRODUCTIVITY } from '../../../data/ui-strings';

interface ProductivityIndexProps {
    activeTime: number;
    totalTime: number;
    eph?: number;
}

export const ProductivityIndex: React.FC<ProductivityIndexProps> = ({ activeTime, totalTime, eph }) => {
    if (totalTime <= 0) return null;

    const activePercent = Math.min(100, Math.max(0, (activeTime / totalTime) * 100));
    const idlePercent = 100 - activePercent;
    const idleTime = Math.max(0, totalTime - activeTime);

    const fmt = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

    return (
        <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-nodo-accent" aria-hidden="true" />
                    <h3
                        className="font-black text-white uppercase tracking-widest"
                        style={{ fontSize: 'var(--text-micro)' }}
                    >
                        {PRODUCTIVITY.title}
                    </h3>
                </div>
                <span className="text-xl font-black text-white" aria-live="polite">
                    {Math.round(activePercent)}%
                </span>
            </div>

            {/* Barra de progreso — Fluent 2 decelerate curve */}
            <div
                className="h-3.5 bg-white/5 rounded-full overflow-hidden flex"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(activePercent)}
                aria-label={PRODUCTIVITY.title}
            >
                <div
                    style={{
                        width: `${activePercent}%`,
                        transition: `width 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)`, /* Fluent decelerate */
                    }}
                    className="bg-nodo-accent h-full relative"
                >
                    <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite] motion-reduce:animate-none" />
                </div>
                <div
                    style={{ width: `${idlePercent}%`, transition: `width 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)` }}
                    className="bg-[#111] border-y border-r border-red-500/20 h-full"
                />
            </div>

            {/* Leyenda */}
            <div className="flex justify-between" style={{ fontSize: 'var(--text-caption)' }}>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-nodo-accent shrink-0" aria-hidden="true" />
                    <span className="text-white/60 font-bold">{PRODUCTIVITY.producing(fmt(activeTime))}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50 shrink-0" aria-hidden="true" />
                    <span className="text-white/60 font-bold">{PRODUCTIVITY.idle(fmt(idleTime))}</span>
                </div>
            </div>

            {/* EPH */}
            {eph && eph > 0 ? (
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-white/30 font-black uppercase tracking-widest"
                        style={{ fontSize: 'var(--text-micro)' }}>
                        {PRODUCTIVITY.ephLabel}
                    </span>
                    <span className="text-base font-black text-brand-sea">
                        ${eph.toLocaleString('es-AR')}
                        <span className="text-xs opacity-50">/hr</span>
                    </span>
                </div>
            ) : null}
        </div>
    );
};
