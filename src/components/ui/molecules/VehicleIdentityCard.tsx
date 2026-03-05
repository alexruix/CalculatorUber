import React from "react";
import { Car, Bike, Truck } from "lucide-react";
import type { VerticalType } from "../../../types/calculator.types";

interface VehicleIdentityCardProps {
  vehicleName: string;
  vertical: VerticalType | null;
  onClick?: () => void;
}

const VERTICAL_CONFIG: Record<
  VerticalType,
  {
    label: string;
    Icon: React.ElementType;
    accentBg: string;
    accentBorder: string;
    accentIcon: string;
    badge: string;
    badgeText: string;
    glow: string;
  }
> = {
  transport: {
    label: "Uber / Remis",
    Icon: Car,
    accentBg: "bg-success/10",
    accentBorder: "border-success/30",
    accentIcon: "text-success",
    badge: "badge-success",
    badgeText: "TRANSPORTE",
    glow: "0 0 24px var(--color-success-glow, rgba(34,197,94,0.1))",
  },
  delivery: {
    label: "Delivery / Rappi",
    Icon: Bike,
    accentBg: "bg-warning/10",
    accentBorder: "border-warning/30",
    accentIcon: "text-warning",
    badge: "badge-warning",
    badgeText: "DELIVERY",
    glow: "0 0 24px var(--color-warning-glow, rgba(249,115,22,0.1))",
  },
  logistics: {
    label: "Logística / Flete",
    Icon: Truck,
    accentBg: "bg-info/10",
    accentBorder: "border-info/30",
    accentIcon: "text-info",
    badge: "badge-info",
    badgeText: "LOGÍSTICA",
    glow: "0 0 24px var(--color-info-glow, rgba(14,165,233,0.1))",
  },
};

const DEFAULT_CONFIG = VERTICAL_CONFIG.transport;

export const VehicleIdentityCard: React.FC<VehicleIdentityCardProps> = ({
  vehicleName,
  vertical,
  onClick,
}) => {
  const cfg = vertical ? VERTICAL_CONFIG[vertical] : DEFAULT_CONFIG;
  const { Icon } = cfg;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300 text-left
        ${cfg.accentBg} ${cfg.accentBorder}
        ${onClick ? "cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black" : "cursor-default"}
      `}
      style={{ boxShadow: cfg.glow }}
      aria-label={`Vehículo: ${vehicleName || "Sin nombre"}. Vertical: ${cfg.label}`}
    >
      {/* Vehicle icon */}
      <div
        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shrink-0 ${cfg.accentBg} ${cfg.accentBorder}`}
        aria-hidden="true"
      >
        <Icon size={28} className={cfg.accentIcon} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-black text-white truncate leading-tight">
          {vehicleName || "Tu Máquina"}
        </p>
        <p className="text-xs text-white/50 mt-0.5">{cfg.label}</p>
      </div>

      {/* Badge */}
      <span className={cfg.badge} aria-hidden="true">
        {cfg.badgeText}
      </span>
    </button>
  );
};
