import { memo, useState } from "react";
import type { SavedTrip } from "../../../types/calculator.types";
import { cn, formatCurrency } from "../../../lib/utils";
import { Trash2, RotateCcw, Check, Navigation, Timer, Clock } from "lucide-react";
import { EFFICIENCY_THRESHOLDS, TEXT_OPACITY } from "../../../constants/ui-constants";


export const TripItem = memo<{
    trip: SavedTrip;
    onDelete: (id: number | string) => void;
    isBest?: boolean;
    isWorst?: boolean;
}>(({ trip, onDelete, isBest, isWorst }) => {
    const [isConfirming, setIsConfirming] = useState(false);
    
    const efficiency = trip.distance > 0 
        ? Math.round(trip.margin / trip.distance) 
        : 0;
    
    const isLoss = trip.margin < 0;

    const efficiencyColor = 
        efficiency > EFFICIENCY_THRESHOLDS.EXCELLENT ? 'success' :
        efficiency > EFFICIENCY_THRESHOLDS.GOOD ? 'primary' : 'neutral';

    return (
        <div 
            className={cn(
                "group relative glass-card p-4 rounded-2xl border-2 transition-all duration-300",
                "flex items-center justify-between",
                isLoss 
                    ? "border-error/30 bg-error/5" 
                    : "border-white/10 bg-white/3 hover:bg-white/5",
                // A11y: Focus ring
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-black"
            )}
        >
            {/* Badge: Best/Worst Trip */}
            {isBest && (
                <span 
                    className="absolute -top-2 -right-2 text-[9px] bg-secondary/20 text-secondary border-2 border-secondary/40 px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-[0_0_15px_rgba(146,93,238,0.3)] z-10"
                    aria-label="Mejor viaje de la jornada"
                >
                    👑 Mejor
                </span>
            )}
            
            {isWorst && !isBest && (
                <span 
                    className="absolute -top-2 -right-2 text-[9px] bg-warning/20 text-warning border-2 border-warning/40 px-2.5 py-1 rounded-full font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,136,0,0.3)] z-10"
                    aria-label="Viaje menos rentable de la jornada"
                >
                    ⚠️ Mejorar
                </span>
            )}

            <div className="flex-1">
                {/* Fare + Efficiency */}
                <div className="flex items-center gap-2 mb-1.5">
                    <span className={cn("text-base font-black", TEXT_OPACITY.PRIMARY)}>
                        {formatCurrency(trip.fare)}
                    </span>
                    
                    <span 
                        className={cn(
                            "text-[9px] px-2 py-1 rounded-lg font-black border-2 uppercase tracking-wider",
                            efficiencyColor === 'success' && "bg-success/10 text-success border-success/30",
                            efficiencyColor === 'primary' && "bg-primary/10 text-primary border-primary/30",
                            efficiencyColor === 'neutral' && "bg-white/5 text-white/40 border-white/10"
                        )}
                        aria-label={`Eficiencia: ${efficiency} pesos por kilómetro`}
                    >
                        ${efficiency}/KM
                    </span>
                </div>

                {/* Trip Details */}
                <div className={cn(
                    "flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest",
                    TEXT_OPACITY.TERTIARY
                )}>
                    <span className="flex items-center gap-1.5">
                        <Navigation className="w-3 h-3" aria-hidden="true" />
                        <span aria-label={`${trip.distance} kilómetros`}>
                            {trip.distance} KM
                        </span>
                    </span>
                    
                    <span className="flex items-center gap-1.5">
                        <Timer className="w-3 h-3" aria-hidden="true" />
                        <span aria-label={`${trip.duration} minutos`}>
                            {trip.duration} MIN
                        </span>
                    </span>
                    
                    {trip.startTime && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            <span aria-label={`Inicio: ${trip.startTime}`}>
                                {trip.startTime}
                            </span>
                        </span>
                    )}
                </div>
            </div>

            {/* Delete Button */}
            <div className="flex items-center gap-2 ml-3">
                {isConfirming ? (
                    <div 
                        className="flex items-center gap-1.5 animate-in slide-in-from-right-2 duration-200"
                        role="group"
                        aria-label="Confirmación de eliminación"
                    >
                        <button 
                            onClick={() => setIsConfirming(false)}
                            className={cn(
                                "min-w-11 min-h-11 p-2 rounded-xl transition-colors",
                                TEXT_OPACITY.DISABLED,
                                "hover:text-white/60",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            )}
                            aria-label="Cancelar eliminación"
                        >
                            <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        </button>
                        
                        <button 
                            onClick={() => onDelete(trip.id)}
                            className={cn(
                                "min-w-11 min-h-11 p-2 rounded-xl",
                                "bg-error text-white",
                                "hover:bg-error/90 active:scale-95",
                                "transition-all duration-200",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                            )}
                            aria-label={`Confirmar: eliminar viaje de ${formatCurrency(trip.fare)}`}
                        >
                            <Check className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsConfirming(true)}
                        className={cn(
                            "min-w-11 min-h-11 p-2 rounded-xl transition-all",
                            "text-white/10 hover:text-error/80",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
                        )}
                        aria-label={`Eliminar viaje de ${formatCurrency(trip.fare)}`}
                    >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                )}
            </div>
        </div>
    );
});

TripItem.displayName = 'TripItem';