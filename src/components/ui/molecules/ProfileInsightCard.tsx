import React from "react";
import { Zap } from "lucide-react";

interface ProfileInsightCardProps {
  kmPerLiter: number;
  /** Average km/L for the platform — default 9 */
  avgKmPerLiter?: number;
}

export const ProfileInsightCard: React.FC<ProfileInsightCardProps> = ({
  kmPerLiter,
  avgKmPerLiter = 9,
}) => {
  if (kmPerLiter <= 0) return null;

  const diffPct = Math.round(
    ((kmPerLiter - avgKmPerLiter) / avgKmPerLiter) * 100,
  );
  const isEfficient = diffPct > 0;
  const isAvg = Math.abs(diffPct) < 3; // within 3% considered average

  let copy: string;
  let badge: string;
  if (isAvg) {
    copy = `Con ${kmPerLiter} km/L, estás en el promedio de la plataforma. Cada mejora cuenta.`;
    badge = "badge-neutral";
  } else if (isEfficient) {
    copy = `Con ${kmPerLiter} km/L, sos un ${diffPct}% más eficiente que el promedio (${avgKmPerLiter} km/L). Eso se traduce directamente en más plata limpia.`;
    badge = "badge-success";
  } else {
    copy = `Con ${kmPerLiter} km/L, gastás un ${Math.abs(diffPct)}% más que el promedio (${avgKmPerLiter} km/L). Revisá tu conducción o tipo de vehículo.`;
    badge = "badge-warning";
  }

  return (
    <div
      className="card-section flex gap-3 items-start"
      role="note"
      aria-label="Insight de eficiencia de combustible"
    >
      <div
        className="icon-wrap-md icon-wrap-accent shrink-0 mt-0.5"
        aria-hidden="true"
      >
        <Zap size={18} className="text-sky-300" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-[11px] font-black text-white/50 uppercase tracking-widest">
            Tu Eficiencia
          </p>
          <span className={badge} aria-hidden="true">
            {isAvg ? "PROMEDIO" : isEfficient ? `+${diffPct}%` : `${diffPct}%`}
          </span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed font-medium">
          {copy}
        </p>
      </div>
    </div>
  );
};
