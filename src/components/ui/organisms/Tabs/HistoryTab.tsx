import React, { useState, useMemo, lazy, Suspense } from 'react';
import {
    History as HistoryIcon, Trash2, X, Navigation, Clock, Calendar,
    TrendingUp, AlertTriangle, Check, RotateCcw, Pencil, Lock as LockIcon,
    Bike, Package, Truck, Car as CarIcon, Coins, Map as MapIcon, Zap, Gauge
} from '../../../../lib/icons';
import type { SavedTrip } from '../../../../types/calculator.types';
import { useProfileStore } from '../../../../store/useProfileStore';
import { useCalculatorStore } from '../../../../store/useCalculatorStore';
import { CardMetric } from '../../molecules/CardMetric';
import { calculateTimeRange } from '../../../../lib/utils';
import { EditTripModal } from '../../molecules/EditTripModal';


const SubscriptionModal = lazy(() => import('../SubscriptionModal').then(m => ({ default: m.SubscriptionModal })));

interface HistoryTabProps {
    onClearHistory: () => void;
    onDeleteTrip: (id: number | string) => void;
}

type FilterType = 'Hoy' | 'Ayer' | 'Semana' | 'Mes' | 'all';

export const HistoryTab: React.FC<HistoryTabProps> = ({ onClearHistory, onDeleteTrip }) => {
    const [deletingId, setDeletingId] = useState<number | string | null>(null);
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const updateTrip = useCalculatorStore(state => state.updateTrip);
    const [isConfirmingClear, setIsConfirmingClear] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('Hoy');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const isPro = useProfileStore(state => state.isPro);
    const trips = useCalculatorStore(state => state.sessionTrips);

    // --- CAPA TRANSFORMADORA UNIFICADA (Filtrado -> Ordenamiento -> Métricas -> Agrupación) ---
    const { filteredTrips, metrics, groupedData } = useMemo(() => {
        // 1. Lógica de Filtrado Interna (Independiente del Store)
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
        const startOfSevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const filtered = trips.filter(trip => {
            switch (activeFilter) {
                case 'Hoy': return trip.timestamp >= startOfToday;
                case 'Ayer': return trip.timestamp >= startOfYesterday && trip.timestamp < startOfToday;
                case 'Semana': return trip.timestamp >= startOfSevenDaysAgo;
                case 'Mes': return trip.timestamp >= startOfMonth;
                default: return true;
            }
        });

        // 2. Ordenamiento Descendente determinista (Requerimiento de Historial)
        const sorted = [...filtered].sort((a, b) => b.timestamp - a.timestamp);

        // 3. Métricas Sincronizadas con el Filtro Actual
        const stats = sorted.reduce((acc, t) => ({
            margin: acc.margin + t.margin,
            fare: acc.fare + t.fare,
            count: acc.count + 1
        }), { margin: 0, fare: 0, count: 0 });

        const avg = stats.count > 0 ? Math.round(stats.margin / stats.count) : 0;

        // 4. Agrupación Cronológica preservando el orden
        const groups: { date: string, trips: SavedTrip[], dailyNet: number }[] = [];

        sorted.forEach(trip => {
            const dateLabel = new Date(trip.timestamp).toLocaleDateString('es-AR', {
                weekday: 'long', day: 'numeric', month: 'long',
            });

            let group = groups.find(g => g.date === dateLabel);
            if (!group) {
                group = { date: dateLabel, trips: [], dailyNet: 0 };
                groups.push(group);
            }
            group.trips.push(trip);
            group.dailyNet += trip.margin;
        });

        return {
            filteredTrips: sorted,
            metrics: { ...stats, avg },
            groupedData: groups
        };
    }, [trips, activeFilter]);

    if (trips.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-8 animate-in fade-in">
                <div className="w-20 h-20 bg-white/5 rounded-4xl flex items-center justify-center mb-6">
                    <HistoryIcon className="w-10 h-10 text-white/10" />
                </div>
                <h2 className="text-xl font-black text-white mb-2 uppercase">Sin registros</h2>
                <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed">
                    Tus viajes aparecerán aquí organizados por fecha. [cite: 1]
                </p>
            </div>
        );
    }

    return (
        <div className="pb-32 space-y-6 animate-in slide-in-from-right-4 duration-500">
            {/* HEADER Y MÉTRICAS FILTRADAS */}
            <div className="px-4 pt-4 space-y-4">
                <div className="glass-card rounded-4xl p-6 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5">
                        <HistoryIcon className="w-24 h-24" />
                    </div>

                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h2 className="text-xl font-black text-white uppercase">Tus turnos</h2>
                        <div className="flex items-center">
                            {isConfirmingClear ? (
                                <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                    <button
                                        onClick={() => setIsConfirmingClear(false)}
                                        className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            onClearHistory();
                                            setIsConfirmingClear(false);
                                        }}
                                        className="w-10 h-10 bg-error border border-error/20 rounded-xl flex items-center justify-center text-white active:scale-90 shadow-lg shadow-error/20"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsConfirmingClear(true)}
                                    className="w-10 h-10 bg-error/10 border border-error/20 rounded-xl flex items-center justify-center text-error hover:bg-error/20 active:scale-90 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        <CardMetric
                            flat
                            label="Plata limpia"
                            value={`$${metrics.margin.toLocaleString('es-AR')}`}
                            subValue={`~$${metrics.avg}/viaje`}
                            status="positive"
                        />
                        <CardMetric
                            flat
                            label="Recaudación"
                            value={`$${metrics.fare.toLocaleString('es-AR')}`}
                            subValue={`${metrics.count} ${metrics.count === 1 ? 'viaje' : 'viajes'}`}
                            status="fare"
                        />
                    </div>
                </div>

                {/* SELECTOR DE FILTROS */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {[
                        { id: 'Hoy', label: 'Hoy' },
                        { id: 'Ayer', label: 'Ayer' },
                        { id: 'Semana', label: 'Semana', locked: !isPro },
                        { id: 'Mes', label: 'Mes', locked: !isPro },
                        { id: 'all', label: 'Todo', locked: !isPro }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => f.locked ? setShowUpgradeModal(true) : setActiveFilter(f.id as FilterType)}
                            className={`${activeFilter === f.id ? 'filter-chip-active' : 'filter-chip-inactive'} relative pr-8 transition-all`}
                        >
                            {f.label}
                            {f.locked && <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* TIMELINE DE VIAJES */}
            <div className="px-4 space-y-10">
                {groupedData.map((group) => (
                    <div key={group.date} className="space-y-6">
                        {/* Indicador de Fecha */}

                        <div className="space-y-4 relative">
                            {group.trips.map((trip) => {
                                const timeRange = calculateTimeRange(trip.startTime, trip.duration);
                                const profitPerKm = trip.distance > 0 ? trip.margin / trip.distance : 0;
                                const profitPerHour = trip.duration > 0 ? (trip.margin / trip.duration) * 60 : 0;
                                const showTip = SUPPORT_TIPS.includes(trip.vertical || '') && (trip.tip ?? 0) > 0;

                                return (
                                    <div key={trip.id} className="relative group">
                                        <div className="glass-card rounded-3xl p-5 border border-white/5 space-y-4">
                                            {/* Top Bar: Tiempo y Acciones */}
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Timer className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {timeRange || `${trip.duration} MIN`}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => setEditingId(trip.id)} className="p-2 text-white/20 hover:text-info">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setDeletingId(trip.id)} className="p-2 text-white/20 hover:text-error">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Métricas Core */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <CardMetric
                                                    flat
                                                    label="Ganancia Neta"
                                                    value={`$${trip.margin.toLocaleString()}`}
                                                    status={trip.margin < 0 ? 'negative' : 'positive'}
                                                    subValue={`Recaudado: $${trip.fare}`}
                                                />
                                                <CardMetric
                                                    flat
                                                    label="Eficiencia"
                                                    value={`$${profitPerKm.toFixed(0)}/KM`}
                                                    subValue={`$${Math.round(profitPerHour).toLocaleString()}/H`}
                                                    icon={Zap}
                                                    status="info"
                                                />
                                            </div>

                                            {/* Footer Condicional */}
                                            <div className="flex items-center gap-4 pt-3 border-t border-white/5 opacity-40">
                                                <div className="flex items-center gap-1.5">
                                                    <Navigation className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase">{trip.distance} KM</span>
                                                </div>
                                                {showTip && (
                                                    <div className="flex items-center gap-1.5 text-success ml-auto animate-in fade-in slide-in-from-right-2">
                                                        <Coins className="w-3 h-3" />
                                                        <span className="text-[10px] font-black uppercase">+$${trip.tip} PROPINA</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Conector de espera si corresponde */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* El modal de edición se llamará aquí cuando editingId sea true */}
        </div>
    );
};