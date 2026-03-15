import React from "react";
import type { VerticalType } from "../../../types/calculator.types";
import { VERTICAL_CONFIGS } from "../../../data/verticalConfigs";

interface VehicleIdentityCardProps {
  vehicleName: string;
  vertical: VerticalType | null;
  onClick?: () => void;
}

const DEFAULT_CONFIG = VERTICAL_CONFIGS.transport;

export const VehicleIdentityCard: React.FC<VehicleIdentityCardProps> = ({
  vehicleName,
  vertical,
  onClick,
}) => {
  const cfg = vertical ? VERTICAL_CONFIGS[vertical] : DEFAULT_CONFIG;
  const { Icon } = cfg;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300 text-left
        ${cfg.theme.bg} ${cfg.theme.border}
        ${onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black" : "cursor-default"}
      `}
      style={{ boxShadow: `0 0 24px ${cfg.theme.glow}` }}
      aria-label={`Vehículo: ${vehicleName || "Sin nombre"}. Vertical: ${cfg.subtitle}`}
    >
      {/* Vehicle icon */}
      <div
        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 ${cfg.theme.bg} ${cfg.theme.border}`}
        aria-hidden="true"
      >
        <Icon size={28} className={cfg.theme.text} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-black text-white truncate leading-tight">
          {vehicleName || "Tu Máquina"}
        </p>
        <p className="text-xs text-white/50 mt-0.5">{cfg.subtitle}</p>
      </div>

      {/* Badge */}
      <span className={cfg.theme.badge} aria-hidden="true">
        {cfg.title}
      </span>
    </button>
  );
};
