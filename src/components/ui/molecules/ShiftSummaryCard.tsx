import React from 'react';
import { SHIFT_CLOSE } from '../../../data/ui-strings';
import { ProductivityIndex } from './ProductivityIndex';
import { TrendingUp, AlertTriangle, Car, Plus, Navigation } from '../../../lib/icons';

interface ShiftSummaryCardProps {
    metrics: any; // O una interfaz compartida si se prefiere
    onAddTrip: () => void;
}

export const ShiftSummaryCard: React.FC<ShiftSummaryCardProps> = ({ metrics, onAddTrip }) => {
    // Si no hay viajes ni horas de turno, mostrar null
    if (metrics.totalShiftMinutes === 0 && (metrics.totalDuration || 0) === 0) {
        return null;
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Warning de tiempo muerto */}
            {metrics.hasExcessiveIdle && (
                <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
                    <div className="flex-1">
                        <h4 className="text-xs font-black text-warning uppercase tracking-widest mb-1">
                            {SHIFT_CLOSE.excessiveIdleWarning.title(Math.round(metrics.idlePercent))}
                        </h4>
                        <p className="text-xs text-warning/70 font-bold mb-3">
                            {SHIFT_CLOSE.excessiveIdleWarning.body}
                        </p>
                        <button
                            onClick={onAddTrip}
                            className="bg-warning/20 hover:bg-warning/30 text-warning text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {SHIFT_CLOSE.excessiveIdleWarning.addTripBtn}
                        </button>
                    </div>
                </div>
            )}

            {/* Resume Card */}
            <div className="glass-card rounded-4xl p-6 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[50px] rounded-full pointer-events-none" />

                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-4">Balance General</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Recaudación</p>
                        <p className="text-2xl font-black text-white">${Math.round(metrics.totalFare).toLocaleString('es-AR')}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-success/50 uppercase font-black tracking-widest mb-1">Ganancia Neta</p>
                        <p className="text-2xl font-black text-success relative z-10">
                            ${Math.round(metrics.netMargin).toLocaleString('es-AR')}
                        </p>
                    </div>
                    <div className="col-span-2 flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-info" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">EPH</span>
                        </div>
                        <span className="text-xl font-black text-info">
                            ${Math.round(metrics.profitPerHour).toLocaleString('es-AR')} <span className="text-xs opacity-50">/hr</span>
                        </span>
                    </div>
                </div>

                {(metrics.totalKmDriven || 0) > 0 && (
                    <div className="mb-6 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-white/20" />
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Recorrido Real</span>
                        </div>
                        <span className="text-sm font-black text-white">{Math.round(metrics.totalKmDriven)} KM</span>
                    </div>
                )}

                {(metrics.deadKm || 0) > 0 && (
                    <div className="mb-6 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-error/40" />
                            <span className="text-xs font-bold text-error/60 uppercase tracking-widest">KM Muertos (Sin viaje)</span>
                        </div>
                        <span className="text-sm font-black text-error/80">{metrics.deadKm} KM</span>
                    </div>
                )}

                {/* Gráfico de Productividad */}
                {metrics.totalShiftMinutes > 0 ? (
                    <div className="pt-2">
                        <ProductivityIndex
                            activeTime={(metrics.totalDuration || 0) / 60}
                            totalTime={metrics.totalShiftMinutes / 60}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};
