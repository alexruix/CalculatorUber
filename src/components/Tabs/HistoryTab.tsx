import React from 'react';
import { History, Trash2, X, Navigation, Clock, DollarSign, Calendar, Target, TrendingUp } from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';

interface HistoryTabProps {
    trips: SavedTrip[];
    onClearHistory: () => void;
    onDeleteTrip: (id: number) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ trips, onClearHistory, onDeleteTrip }) => {

    if (trips.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-8 animate-in fade-in">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
                    <History className="w-10 h-10 text-white/10" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Sin registros</h2>
                <p className="text-md text-white/40 leading-relaxed">
                    Los viajes que guardes aparecerán aquí para tu control diario.
                </p>
            </div>
        );
    }

    // Cálculos 
    const totalMargin = trips.reduce((acc, trip) => acc + trip.margin, 0);
    const totalFare = trips.reduce((acc, trip) => acc + trip.fare, 0);
    const tripCount = trips.length;
    const avgMarginPerTrip = tripCount > 0 ? Math.round(totalMargin / tripCount) : 0;


    // --- Lógica de Agrupación por Fecha ---
    const groupedTrips = trips.reduce((groups: Record<string, SavedTrip[]>, trip) => {
        const date = new Date(trip.timestamp).toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(trip);
        return groups;
    }, {});

    return (
        <div className="pb-32 space-y-6 animate-in slide-in-from-right-4 duration-500">

            {/* 1. Header con Acción de Limpieza Total */}
            <div className="px-4 pt-4">
                <div className="px-5 pt-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-nodo-petrol" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-white">
                                Resumen Sesión
                            </h3>
                        </div>
                        <button
                            onClick={() => confirm('¿Borrar todo el historial?') && onClearHistory()}

                            className="text-white/20 hover:text-nodo-wine transition-colors touch-target"
                            title="Borrar historial del día"
                            aria-label="Borrar historial completo"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>


            </div>

            {/* 2. Resumen Rápido del Historial */}
            <div className="px-4">
                <div className="grid grid-cols-2 gap-3">


                    {/* Ganancia Neta */}
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter mb-1">
                            Ganancia Neta
                        </p>
                        <p className="text-2xl font-black text-green-400">
                            ${totalMargin.toLocaleString('es-AR')}
                        </p>
                        <p className="text-[10px] text-white/30 mt-1">
                            ~${avgMarginPerTrip}/viaje
                        </p>
                    </div>

                    {/* Ingresos Totales */}
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter mb-1">
                            Ingresos
                        </p>
                        <p className="text-2xl font-black text-nodo-petrol">
                            ${totalFare.toLocaleString('es-AR')}
                        </p>
                        <p className="text-[10px] text-white/30 mt-1">
                            {tripCount} {tripCount === 1 ? 'viaje' : 'viajes'}
                        </p>
                    </div>

                </div>
            </div>

            {/* 2. Timeline de Viajes por Día */}
            <div className="px-4 space-y-8">
                {Object.entries(groupedTrips).map(([date, dayTrips]) => (
                    <div key={date} className="space-y-4">
                        {/* Título de Fecha (Sticky opcional) */}
                        <div className="flex items-center gap-3 ml-2">
                            <Calendar className="w-3 h-3 text-nodo-petrol" />
                            <h3 className="text-[10px] font-black text-white uppercase">
                                {date}
                            </h3>
                            <div className="h-[1px] flex-1 bg-white/5" />
                        </div>

                        {/* Lista de Viajes del Día */}
                        <div className="space-y-3">
                            {dayTrips.map((trip) => (
                                <div key={trip.id} className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between group animate-in fade-in duration-300">
                                    <div className="flex gap-4 items-center">

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-black text-white tracking-tight">${trip.fare.toLocaleString()}</span>
                                                <span className={`text-[10px] font-bold ${trip.margin > 0 ? 'text-green-500/60' : 'text-red-500/60'}`}>
                                                    ${trip.margin.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 opacity-30">
                                                <div className="flex items-center gap-1">
                                                    <Navigation className="w-2.5 h-2.5" />
                                                    <span className="text-[9px] font-bold uppercase">{trip.distance} KM</span>
                                                </div>
                                                {trip.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        <span className="text-[9px] font-bold uppercase">{trip.duration} MIN</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDeleteTrip(trip.id)}
                                        className="p-2 text-white/5 hover:text-nodo-wine active:scale-90 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};