import React, { useMemo } from "react";
import {
  Flame,
  TrendingUp,
  Heart,
  TrendingDown,
  Activity,
  Zap, // Añadimos Zap para el estado de "Listo para arrancar"
} from "../../../lib/icons";
import { cn } from "../../../lib/utils";
import type { ExtendedSessionInsights } from "../../../hooks/useSessionInsights";

interface EmotionalSupportSectionProps {
  insights: ExtendedSessionInsights;
}

export const EmotionalSupportSection: React.FC<
  EmotionalSupportSectionProps
> = ({ insights }) => {
  const vsPrev = insights.vsPrev?.pct || 0;
  const tripCount = insights.tripCount || 0;

  const state = useMemo(() => {
    // 1. ESTADO: Pre-Arranque (0 viajes)
    if (tripCount === 0) {
      return {
        icon: <Zap className="w-8 h-8 text-secondary" />,
        title: "Listo para arrancar",
        body: "Aún no registraste viajes en este período. Ajustá tu meta y salí a romperla.",
        theme: "border-secondary/40 bg-secondary/10 text-secondary",
      };
    }

    // 2. ESTADO: Calibración (1 o 2 viajes)
    // Evita dar un porcentaje volátil o estresante con una muestra muy chica
    if (tripCount > 0 && tripCount < 3) {
      return {
        icon: <Activity className="w-8 h-8 text-white/60 animate-pulse" />,
        title: "Calibrando radar...",
        body: "Ya estás en la calle. Registrá un par de viajes más para activar tus métricas.",
        theme: "border-white/20 bg-white/5 text-white/80",
      };
    }

    // 3. ESTADOS ESTÁNDAR (>= 3 viajes, muestra estadísticamente válida)
    if (vsPrev > 20)
      return {
        icon: <Flame className="w-8 h-8 text-primary animate-pulse" />,
        title: "¡Nivel leyenda!",
        body: `Estás un ${Math.round(vsPrev)}% arriba. No es suerte, es estrategia pura.`,
        theme: "border-primary/40 bg-primary/10 text-primary",
      };
    if (vsPrev > 5)
      return {
        icon: <TrendingUp className="w-8 h-8 text-success" />,
        title: "Ritmo ganador",
        body: "Venís mejorando tu promedio. Mantené el ritmo.",
        theme: "border-success/40 bg-success/10 text-success",
      };
    if (vsPrev < -15)
      return {
        icon: <Heart className="w-8 h-8 text-error shrink-0" />,
        title: "Día de aguante",
        body: "El mercado está un poco lento. Pasa seguido, a resetear que hay revancha.",
        theme: "border-error/40 bg-error/10 text-error",
      };
    if (vsPrev < -5)
      return {
        icon: <TrendingDown className="w-8 h-8 text-warning" />,
        title: "Día tranqui",
        body: "Un poco abajo del promedio. ¿Probaste cambiar de horario o zona?",
        theme: "border-warning/40 bg-warning/10 text-warning",
      };

    // Estado de "Mantenimiento" (entre -5% y +5%)
    return {
      icon: <Activity className="w-8 h-8 text-white/50" />,
      title: "Estás en tu zona",
      body: "Estás rindiendo lo que proyectamos. Seguí así.",
      theme: "border-white/20 bg-white/10 text-white/80",
    };
  }, [vsPrev, tripCount]); // Importante: agregamos tripCount al array de dependencias

  return (
    <div
      className={cn(
        "glass-card p-5 border-2 rounded-3xl flex gap-4 items-center animate-in zoom-in-95",
        state.theme,
      )}
    >
      <div className="shrink-0">{state.icon}</div>
      <div>
        <h4 className="text-sm font-black uppercase tracking-tight leading-none mb-1">
          {state.title}
        </h4>
        <p className="text-xs font-bold opacity-90">{state.body}</p>
      </div>
    </div>
  );
};
