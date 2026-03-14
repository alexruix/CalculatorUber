import { memo, useMemo } from "react";
import type { JourneyData, JourneyMetrics } from "../../../types/calculator.types";
import { formatCurrency, formatDateLatam } from "../../../lib/utils";
import { TripItem } from "./TripItem";
import { cn } from "../../../lib/utils";
import { ChevronDown, Clock, Zap, Flame, Check } from "lucide-react";
import { 
    PRODUCTIVITY_THRESHOLDS, 
    TEXT_OPACITY, 
    MIN_TRIPS_FOR_EXTREMES 
} from "../../../constants/ui-constants";


export const JourneyCard = memo<{
    journey: JourneyData;
    isExpanded: boolean;
    onToggle: () => void;
    onDeleteTrip: (id: number | string) => void;
    dailyGoal: number;
}>(({ journey, isExpanded, onToggle, onDeleteTrip, dailyGoal }) => {
    
    // Calculate all metrics
    const metrics = useMemo<JourneyMetrics>(() => {
        if (journey.trips.length === 0) {
            return {
                eph: 0,
                startTime: '--:--',
                endTime: '--:--',
                totalHours: '0',
                totalHoursRaw: 0,
                activeHours: '0',
                productivity: 0,
                goalProgress: 0,
                goalAchieved: false,
                profitableStreak: 0,
                bestTripId: null,
                worstTripId: null,
            };
        }

        // Sort trips chronologically
        const sorted = [...journey.trips].sort((a, b) => a.timestamp - b.timestamp);
        
        // Journey time bounds
        const firstTrip = sorted[0];
        const lastTrip = sorted[sorted.length - 1];
        
        const start = new Date(firstTrip.timestamp);
        const end = new Date(lastTrip.timestamp);
        end.setMinutes(end.getMinutes() + lastTrip.duration);
        
        const totalHoursRaw = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        // Active time
        const activeMins = journey.trips.reduce((sum, t) => sum + t.duration, 0);
        const activeHoursRaw = activeMins / 60;
        
        // EPH
        const eph = activeHoursRaw > 0 ? Math.round(journey.net / activeHoursRaw) : 0;
        
        // Productivity
        const productivity = totalHoursRaw > 0 
            ? Math.round((activeHoursRaw / totalHoursRaw) * 100) 
            : 0;
        
        // Goal progress
        const goalProgress = dailyGoal > 0 
            ? Math.round((journey.net / dailyGoal) * 100) 
            : 0;
        
        // Profitable streak (from most recent backwards)
        let streak = 0;
        for (let i = journey.trips.length - 1; i >= 0; i--) {
            const trip = journey.trips[i];
            const isProfitable = typeof trip.isProfitable === 'boolean'
                ? trip.isProfitable
                : trip.margin > 0;
            
            if (isProfitable) {
                streak++;
            } else {
                break;
            }
        }
        
        // Best/Worst trips (only if >= 3 trips)
        let bestTripId = null;
        let worstTripId = null;
        
        if (journey.trips.length >= MIN_TRIPS_FOR_EXTREMES) {
            const sortedByMargin = [...journey.trips].sort((a, b) => b.margin - a.margin);
            bestTripId = sortedByMargin[0]?.id ?? null;
            worstTripId = sortedByMargin.length > 0 
                ? sortedByMargin[sortedByMargin.length - 1]?.id ?? null
                : null;
        }
        
        return {
            eph,
            startTime: start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
            endTime: end.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
            totalHours: totalHoursRaw.toFixed(1),
            totalHoursRaw,
            activeHours: activeHoursRaw.toFixed(1),
            productivity,
            goalProgress,
            goalAchieved: goalProgress >= 100,
            profitableStreak: streak,
            bestTripId,
            worstTripId,
        };
    }, [journey.trips, journey.net, dailyGoal]);

    // Productivity color
    const productivityColor = 
        metrics.productivity >= PRODUCTIVITY_THRESHOLDS.HIGH ? 'text-success' :
        metrics.productivity >= PRODUCTIVITY_THRESHOLDS.MEDIUM ? 'text-primary' : 'text-warning';

    return (
        <div className="space-y-2">
            {/* ═══ COLLAPSED CARD (Simplified: 5 data points) ═══ */}
            <button
                onClick={onToggle}
                className={cn(
                    "w-full text-left",
                    "glass-card p-4 rounded-2xl border-2 transition-all duration-300",
                    "relative overflow-hidden",
                    isExpanded 
                        ? "border-primary/40 bg-primary/5 shadow-[0_0_25px_rgba(0,240,104,0.15)]" 
                        : "border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20",
                    // A11y: Focus ring
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                )}
                aria-label={`${isExpanded ? 'Colapsar' : 'Expandir'} jornada del ${formatDateLatam(journey.date, 'long')}`}
                aria-expanded={isExpanded}
            >
                {/* Top Row: Date + Goal Badge */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className={cn(
                        "text-xs font-black uppercase tracking-widest leading-tight",
                        TEXT_OPACITY.SECONDARY
                    )}>
                        {formatDateLatam(journey.date, 'long')}
                    </h3>
                    
                    {metrics.goalAchieved ? (
                        <span 
                            className="flex items-center gap-1.5 text-[9px] text-success bg-success/15 border-2 border-success/30 px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0"
                            aria-label={`Meta cumplida al ${metrics.goalProgress}%`}
                        >
                            <Check className="w-3 h-3" aria-hidden="true" />
                            {metrics.goalProgress}%
                        </span>
                    ) : metrics.goalProgress > 0 ? (
                        <span 
                            className={cn(
                                "text-[9px] font-bold uppercase tracking-wider shrink-0",
                                TEXT_OPACITY.DISABLED
                            )}
                            aria-label={`${metrics.goalProgress}% de la meta diaria`}
                        >
                            {metrics.goalProgress}%
                        </span>
                    ) : null}
                </div>

                {/* Main Row: Money + EPH + Trips + Expand Icon */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2 flex-1 min-w-0">
                        {/* Money (Primary) */}
                        <span 
                            className={cn(
                                "text-2xl font-black text-primary leading-none tracking-tight truncate",
                                "tabular-nums"
                            )}
                            aria-label={`Ganancia: ${formatCurrency(journey.net)}`}
                        >
                            {formatCurrency(journey.net)}
                        </span>
                        
                        {/* EPH (Secondary) */}
                        <span 
                            className={cn(
                                "text-sm font-bold text-secondary leading-none tracking-tight shrink-0",
                                "tabular-nums"
                            )}
                            aria-label={`Ganancia por hora: ${formatCurrency(metrics.eph)}`}
                        >
                            {formatCurrency(metrics.eph)}/hr
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Trip Count + Streak */}
                        <div className="flex items-center gap-1.5">
                            <span 
                                className={cn(
                                    "text-xs font-bold uppercase tracking-wider",
                                    TEXT_OPACITY.TERTIARY
                                )}
                                aria-label={`${journey.trips.length} ${journey.trips.length === 1 ? 'viaje' : 'viajes'}`}
                            >
                                {journey.trips.length} {journey.trips.length === 1 ? 'viaje' : 'viajes'}
                            </span>
                            
                            {metrics.profitableStreak >= 3 && (
                                <span 
                                    className="flex items-center gap-0.5 text-[9px] text-accent font-black"
                                    aria-label={`Racha de ${metrics.profitableStreak} viajes rentables`}
                                >
                                    <Flame className="w-3 h-3" aria-hidden="true" />
                                    {metrics.profitableStreak}
                                </span>
                            )}
                        </div>
                        
                        {/* Expand Icon */}
                        <ChevronDown 
                            className={cn(
                                "w-5 h-5 transition-transform duration-300",
                                TEXT_OPACITY.TERTIARY,
                                isExpanded && "rotate-180"
                            )}
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </button>

            {/* ═══ EXPANDED CONTENT (Progressive Disclosure) ═══ */}
            {isExpanded && (
                <div 
                    className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300"
                    role="region"
                    aria-label="Detalles de la jornada"
                >
                    {/* Journey Details Card */}
                    <div className="glass-card p-4 rounded-2xl border-2 border-white/10 bg-white/3">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Left: Time Range */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className={cn("w-4 h-4", TEXT_OPACITY.DISABLED)} aria-hidden="true" />
                                    <span className={cn("text-xs font-bold uppercase tracking-wider", TEXT_OPACITY.TERTIARY)}>
                                        Horario
                                    </span>
                                </div>
                                <p className={cn("text-sm font-black tabular-nums", TEXT_OPACITY.PRIMARY)}>
                                    {metrics.startTime} — {metrics.endTime}
                                </p>
                                <p className={cn("text-xs uppercase tracking-wider", TEXT_OPACITY.DISABLED)}>
                                    {metrics.totalHours}hs totales
                                </p>
                            </div>

                            {/* Right: Productivity */}
                            <div className="space-y-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className={cn("text-xs font-bold uppercase tracking-wider", TEXT_OPACITY.TERTIARY)}>
                                        Productividad
                                    </span>
                                    <Zap className={cn("w-4 h-4", TEXT_OPACITY.DISABLED)} aria-hidden="true" />
                                </div>
                                <p className={cn("text-sm font-black tabular-nums", productivityColor)}>
                                    {metrics.productivity}% activo
                                </p>
                                <p className={cn("text-xs uppercase tracking-wider", TEXT_OPACITY.DISABLED)}>
                                    {metrics.activeHours}hs manejadas
                                </p>
                            </div>
                        </div>

                        {/* Productivity Bar (Visual continuity - Gestalt fix) */}
                        <div className="mt-4 space-y-1.5">
                            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={cn(
                                        "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                                        metrics.productivity >= PRODUCTIVITY_THRESHOLDS.HIGH 
                                            ? "bg-success" 
                                            : metrics.productivity >= PRODUCTIVITY_THRESHOLDS.MEDIUM
                                            ? "bg-primary"
                                            : "bg-warning"
                                    )}
                                    style={{ width: `${metrics.productivity}%` }}
                                    role="progressbar"
                                    aria-valuenow={metrics.productivity}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label="Porcentaje de productividad"
                                />
                            </div>
                            <p className={cn("text-[9px] uppercase tracking-wider text-center", TEXT_OPACITY.DISABLED)}>
                                {metrics.activeHours}hs de {metrics.totalHours}hs
                            </p>
                        </div>
                    </div>

                    {/* Trip List */}
                    <div className="space-y-2">
                        {journey.trips
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map(trip => (
                                <TripItem
                                    key={trip.id}
                                    trip={trip}
                                    onDelete={onDeleteTrip}
                                    isBest={trip.id === metrics.bestTripId}
                                    isWorst={trip.id === metrics.worstTripId}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
});

JourneyCard.displayName = 'JourneyCard';