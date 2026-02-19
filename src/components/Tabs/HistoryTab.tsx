import React, { useState, useMemo } from 'react';
import {
    History, Trash2, X, Navigation, Clock, Calendar,
    TrendingUp, AlertTriangle, Check, RotateCcw, Filter
} from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';

interface HistoryTabProps {
    trips: SavedTrip[];
    onClearHistory: () => void;
    onDeleteTrip: (id: number) => void;
}

type FilterType = 'Hoy' | 'Ayer' | 'Semana' | 'Mes' | 'all';

export const HistoryTab: React.FC<HistoryTabProps> = ({ trips, onClearHistory, onDeleteTrip }) => {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    // --- 1. LÓGICA DE FILTRADO ---
    const filteredTrips = useMemo(() => {
        const now = new Date();
        const Hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const Ayer = Hoy - 86400000;
        const sevenDaysAgo = Hoy - (7 * 86400000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        return trips.filter(trip => {
            switch (activeFilter) {
                case 'Hoy': return trip.timestamp >= Hoy;
                case 'Ayer': return trip.timestamp >= Ayer && trip.timestamp < Hoy;
                case 'Semana': return trip.timestamp >= sevenDaysAgo;
                case 'Mes': return trip.timestamp >= startOfMonth;
                default: return true;
            }
        });
    }, [trips, activeFilter]);

    // --- 2. LÓGICA DE AGRUPACIÓN (Sobre los datos filtrados) ---
    const groupedData = filteredTrips.reduce((groups: Record<string, { trips: SavedTrip[], dailyNet: number }>, trip) => {
        const date = new Date(trip.timestamp).toLocaleDateString('es-AR', {
            weekday: 'long', day: 'numeric', month: 'long',
        });
        if (!groups[date]) groups[date] = { trips: [], dailyNet: 0 };
        groups[date].trips.push(trip);
        groups[date].dailyNet += trip.margin;
        return groups;
    }, {});

    // Cálculos 
    const totalMargin = trips.reduce((acc, trip) => acc + trip.margin, 0);
    const totalFare = trips.reduce((acc, trip) => acc + trip.fare, 0);
    const tripCount = trips.length;
    const avgMarginPerTrip = tripCount > 0 ? Math.round(totalMargin / tripCount) : 0;



    if (trips.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-8 animate-in fade-in">
                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6">
                    <History className="w-10 h-10 text-white/10" />
                </div>
                <h2 className="text-xl font-black text-white mb-2 uppercase">Sin registros</h2>
                <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                    Los viajes que guardes aparecerán aquí organizados por fecha.
                </p>
            </div>
        );
    }

    return (
        <div className="pb-32 space-y-6 animate-in slide-in-from-right-4 duration-500">

            {/* HEADER Y MÉTRICAS (Actualizan según el filtro) */}
            <div className="px-4 pt-4 space-y-4">
                <div className="glass-card rounded-4xl p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                    {/* Decoración de fondo */}
                    <div className="absolute -right-4 -top-4 opacity-5">
                        <History className="w-24 h-24" />
                    </div>

                    <div className="flex items-center justify-between mb-6 relative">
                        <div>
                            <h2 className="text-xl font-black text-white uppercase">Tu laburo</h2>
                            <p className="text-sm text-nodo-petrol  mt-1">
                                {/* {activeFilter === 'all' ? 'Todo' : `${activeFilter}`} */}
                            </p>
                        </div>
                        <button
                            onClick={() => confirm('¿Limpiamos todo el historial? Mirá que no hay vuelta atrás...') && onClearHistory()}
                            className="w-10 h-10 bg-nodo-wine/10 border border-nodo-wine/20 rounded-xl flex items-center justify-center text-nodo-wine active:scale-90 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Ganancia Neta */}
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-tighter mb-1">
                                Plata limpia
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
                                Recaudación
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

                {/* --- SELECTOR DE FILTROS (UI Chips) --- */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {[
                        { id: 'all', label: 'Todo' },
                        { id: 'Hoy', label: 'Hoy' },
                        { id: 'Ayer', label: 'Ayer' },
                        { id: 'Semana', label: 'Semana' },
                        { id: 'Mes', label: 'Mes' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id as FilterType)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border
                ${activeFilter === f.id
                                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}
              `}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TIMELINE DE VIAJES FILTRADOS */}
            <div className="px-4 space-y-10">
                {filteredTrips.length === 0 ? (
                    <div className="py-20 text-center glass-card rounded-3xl border-dashed border-white/5">
                        <Filter className="w-8 h-8 text-white/10 mx-auto mb-2" />
                        <p className="text-xs text-white/30 uppercase font-black">Sin datos en este periodo</p>
                    </div>
                ) : (
                    Object.entries(groupedData).map(([date, data]) => (
                        <div key={date} className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-nodo-petrol" />
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{date}</h3>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3 text-green-400" />
                                    <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">
                                        +${data.dailyNet.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 relative">
                                <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/5 -z-10" />
                                {data.trips.map((trip) => {
                                    const isLoss = trip.margin < 0;
                                    const isConfirmingDelete = deletingId === trip.id;
                                    return (
                                        <div key={trip.id} className={`glass-card rounded-2xl p-4 border transition-all duration-300 flex items-center justify-between group ${isLoss ? 'border-red-500/30 bg-red-500/[0.02]' : 'border-white/5'}`}>
                                            <div className="flex gap-4 items-center">
                                                {/* <div className={`w-12 h-10 rounded-xl flex items-center justify-center border font-black text-[10px] ${isLoss ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/[0.03] border-white/5 text-white/40'}`}>
                          {isLoss ? <AlertTriangle className="w-4 h-4" /> : new Date(trip.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </div> */}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-base font-black text-white tracking-tight">${trip.fare.toLocaleString()}</span>
                                                        <span className={`text-[10px] font-bold ${isLoss ? 'text-red-400' : 'text-green-500/60'}`}>${trip.margin.toLocaleString()}</span>
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
                                            <div className="flex items-center">
                                                {isConfirmingDelete ? (
                                                    <div className="flex items-center gap-1 animate-in slide-in-from-right-2">
                                                        <button onClick={() => setDeletingId(null)} className="p-2 text-white/40 hover:text-white"><RotateCcw className="w-4 h-4" /></button>
                                                        <button onClick={() => onDeleteTrip(trip.id)} className="bg-red-500 text-white p-2 rounded-lg active:scale-90"><Check className="w-4 h-4" /></button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setDeletingId(trip.id)} className="p-2 text-white/5 hover:text-nodo-wine transition-colors opacity-0 group-hover:opacity-100 touch-target"><Trash2 className="w-4 h-4" /></button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};