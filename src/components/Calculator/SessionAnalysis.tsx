import React, { useState } from 'react';
import {
    TrendingUp, TrendingDown, Minus, Trophy, Zap, Clock,
    Target, Lightbulb, Award, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import type { SavedTrip } from '../../types/calculator.types';
import { useSessionInsights } from '../../hooks/useSessionInsights';

interface SessionAnalysisProps {
    trips: SavedTrip[];
}

/**
 * Componente de análisis de sesión con insights y gamificación
 * Muestra: mejor/peor viaje, tendencias, tips, badges, nivel
 */
export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ trips }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const insights = useSessionInsights(trips);

    // No mostrar si no hay viajes
    if (trips.length === 0) return null;

    // Mostrar solo si hay 3+ viajes (para análisis significativo)
    if (trips.length < 3 && !isExpanded) {
        return (
            <div className="glass-card rounded-3xl p-5 text-center">
                <Lightbulb className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-white/60">
                    Completa al menos 3 viajes para ver tu análisis de sesión
                </p>
                <p className="text-xs text-white/40 mt-1">
                    {trips.length}/3 viajes
                </p>
            </div>
        );
    }

    // Formato de hora
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    };

    // Colores por badge
    const badgeColors: Record<string, string> = {
        sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        red: 'bg-red-500/20 text-red-400 border-red-500/30',
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    return (
        <div className="glass-card rounded-3xl overflow-hidden">

            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">
                            Análisis de Sesión
                        </h3>
                    </div>

                    {/* Nivel del conductor */}
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-black text-amber-400">
                            Nivel {insights.driverLevel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Resumen Rápido */}
            <div className="px-5 pb-3">
                <div className="grid grid-cols-3 gap-3">

                    {/* Viajes Rentables */}
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <Target className="w-4 h-4 text-green-400 mb-1" />
                        <p className="text-2xl font-black text-green-400">
                            {insights.profitableTripsPercent}%
                        </p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tight">
                            Rentables
                        </p>
                    </div>

                    {/* Tendencia */}
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        {insights.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400 mb-1" />}
                        {insights.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400 mb-1" />}
                        {insights.trend === 'stable' && <Minus className="w-4 h-4 text-amber-400 mb-1" />}
                        <p className="text-xs font-black text-white">
                            {insights.trend === 'improving' && 'Mejorando'}
                            {insights.trend === 'declining' && 'Bajando'}
                            {insights.trend === 'stable' && 'Estable'}
                        </p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tight">
                            Tendencia
                        </p>
                    </div>

                    {/* Racha */}
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <Zap className="w-4 h-4 text-orange-400 mb-1" />
                        <p className="text-2xl font-black text-orange-400">
                            {insights.profitableStreak}
                        </p>
                        <p className="text-[10px] text-white/40 uppercase tracking-tight">
                            Racha
                        </p>
                    </div>
                </div>
            </div>

            {/* Badges Ganados (si hay) */}
            {insights.badges.length > 0 && (
                <div className="px-5 pb-3">
                    <p className="text-[10px] font-bold text-white/40 uppercase mb-2 flex items-center gap-2">
                        <Award className="w-3 h-3" />
                        Logros Desbloqueados
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        {insights.badges.map((badge) => (
                            <div
                                key={badge.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${badgeColors[badge.color]
                                    } ${badge.unlockedNow ? 'animate-in fade-in' : ''}`}
                                title={badge.description}
                            >
                                <span className="text-lg">{badge.icon}</span>
                                <div>
                                    <p className="text-xs font-bold">{badge.name}</p>
                                    {badge.unlockedNow && (
                                        <p className="text-[10px] opacity-60">¡Nuevo!</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Botón Expandir */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-5 py-3 border-t border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors touch-target"
            >
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    {isExpanded ? 'Ver Menos' : 'Ver Análisis Completo'}
                </span>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                )}
            </button>

            {/* Análisis Detallado (Expandible) */}
            {isExpanded && (
                <div className="border-t border-white/5 px-5 py-4 space-y-4">

                    {/* Mejor y Peor Viaje */}
                    <div>
                        <p className="text-[10px] font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
                            <Trophy className="w-3 h-3" />
                            Comparativa de Viajes
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Mejor Viaje */}
                            {insights.bestTrip && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <p className="text-xs font-bold text-green-400">Mejor Viaje</p>
                                    </div>
                                    <p className="text-sm text-white/60">
                                        {formatTime(insights.bestTrip.timestamp)}
                                    </p>
                                    <p className="text-xl font-black text-green-400 mt-1">
                                        ${insights.bestTrip.margin.toLocaleString('es-AR')}
                                    </p>
                                    <p className="text-xs text-white/40 mt-1">
                                        Tarifa: ${insights.bestTrip.fare.toLocaleString('es-AR')}
                                    </p>
                                </div>
                            )}

                            {/* Peor Viaje */}
                            {insights.worstTrip && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingDown className="w-4 h-4 text-red-400" />
                                        <p className="text-xs font-bold text-red-400">Menor Ganancia</p>
                                    </div>
                                    <p className="text-sm text-white/60">
                                        {formatTime(insights.worstTrip.timestamp)}
                                    </p>
                                    <p className="text-xl font-black text-red-400 mt-1">
                                        ${insights.worstTrip.margin.toLocaleString('es-AR')}
                                    </p>
                                    <p className="text-xs text-white/40 mt-1">
                                        Tarifa: ${insights.worstTrip.fare.toLocaleString('es-AR')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mejor Hora del Día */}
                    {insights.bestTimeOfDay && (
                        <div className="bg-gradient-to-br from-nodo-petrol/20 to-black border border-nodo-petrol/30 rounded-xl p-4 relative overflow-hidden">
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Clock className="w-16 h-16 text-nodo-petrol" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-xs font-bold text-nodo-petrol uppercase tracking-wider mb-1">
                                    Zona Horaria de Oro
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-black text-white">
                                        {insights.bestTimeOfDay}
                                    </p>
                                    <span className="text-xs text-white/40 font-mono">hrs</span>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-nodo-petrol w-3/4"></div> {/* Barra de "intensidad" visual */}
                                    </div>
                                    <span className="text-[10px] text-nodo-petrol font-bold">Alta Demanda</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tips Accionables */}
                    {insights.tips.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
                                <Lightbulb className="w-3 h-3" />
                                Tips para Mejorar
                            </p>

                            <div className="space-y-2">
                                {insights.tips.map((tip, index) => (
                                    <div
                                        key={index}
                                        className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex gap-3"
                                    >
                                        <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-white/80 leading-relaxed">
                                            {tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estadística Extra: Promedio */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/40 uppercase tracking-tight">
                                    Ganancia Promedio
                                </p>
                                <p className="text-2xl font-black text-white mt-1">
                                    ${insights.avgMarginPerTrip.toLocaleString('es-AR')}
                                </p>
                                <p className="text-xs text-white/40 mt-1">por viaje</p>
                            </div>
                            <div className="w-16 h-16 bg-nodo-petrol/20 rounded-full flex items-center justify-center">
                                <Target className="w-8 h-8 text-nodo-petrol" />
                            </div>
                        </div>
                    </div>

                    {/* Mensaje Motivacional */}
                    <div className="bg-gradient-to-r from-nodo-petrol/10 to-purple-500/10 border border-nodo-petrol/30 rounded-xl p-4 text-center">
                        <p className="text-sm font-bold text-white mb-1">
                            {insights.profitableTripsPercent >= 80 && '¡Excelente trabajo, conductor!'}
                            {insights.profitableTripsPercent >= 60 && insights.profitableTripsPercent < 80 && '¡Buen desempeño hoy!'}
                            {insights.profitableTripsPercent < 60 && 'Sigue mejorando, vas por buen camino'}
                        </p>
                        <p className="text-xs text-white/60">
                            {insights.trend === 'improving' && 'Tus números van en aumento 📈'}
                            {insights.trend === 'stable' && 'Mantén la consistencia 🎯'}
                            {insights.trend === 'declining' && 'Aplica los tips para mejorar 💡'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};