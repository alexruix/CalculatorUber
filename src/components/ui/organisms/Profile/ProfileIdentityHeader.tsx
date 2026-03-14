import React from "react";
import { RefreshCw, ChevronRight } from "lucide-react";
import type { VerticalType } from "../../../../types/calculator.types";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { VehicleIdentityCard } from "../../molecules/VehicleIdentityCard";
import { Badge } from "../../atoms/Badge";

interface ProfileIdentityHeaderProps {
  isPro: boolean;
  avatarUrl?: string;
  displayName: string;
  initials: string;
  email?: string;
  vehicleName: string;
  vertical: VerticalType | null;
  swapVehicle: () => void;
}

export const ProfileIdentityHeader: React.FC<ProfileIdentityHeaderProps> = ({
  isPro,
  avatarUrl,
  displayName,
  initials,
  email,
  vehicleName,
  vertical,
  swapVehicle,
}) => {
  return (
    <div className="px-4 py-6">
      <div className="glass rounded-3xl p-6 border-2 border-primary/30 relative overflow-hidden transition-all duration-300 shadow-[0_0_30px_var(--color-primary-glow)]">
        {/* Glow effect offset (Claude's style) */}
        <div
          className="absolute top-0 right-0 w-40 h-40 blur-[80px] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background: isPro
              ? "rgba(14,165,233,0.15)"
              : "var(--color-primary-glow)",
          }}
        />

        {/* User Info Block */}
        <div className="flex items-center gap-4 relative z-10 mb-6">
          {/* Avatar Area */}
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${PROFILE_STRINGS.header.avatarAlt}${displayName}`}
                className={`w-20 h-20 rounded-full object-cover border-2 shadow-lg ${
                  isPro ? "border-sky-400" : "border-primary"
                }`}
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 text-3xl font-extrabold text-white shadow-lg ${
                  isPro
                    ? "bg-linear-to-br from-sky-500 to-indigo-500 border-sky-400"
                    : "bg-linear-to-br from-primary to-secondary border-primary/50"
                }`}
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
            {isPro && (
              <div className="absolute -bottom-2 -right-2">
                <Badge
                  variant="info"
                  size="sm"
                  className="bg-sky-500 border-black text-white shadow-xl"
                >
                  {PROFILE_STRINGS.header.proBadge}
                </Badge>
              </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-extrabold text-starlight truncate">
              {displayName}
            </h2>
            <p className="text-sm font-semibold mt-0.5 text-primary text-glow-primary">
              {vertical === "transport"
                ? "Transporte"
                : vertical === "delivery"
                  ? "Delivery"
                  : vertical === "logistics"
                    ? "Logística"
                    : "Conductor"}
            </p>
          </div>

          {/* Decorative Chevron Button */}
          <button
            className="w-12 h-12 rounded-full border-2 border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Perfil"
          >
            <ChevronRight className="w-6 h-6 text-starlight" />
          </button>
        </div>

        {/* Vehicle identity - Component already handles styling internally */}
        <div className="relative z-10">
          <VehicleIdentityCard vehicleName={vehicleName} vertical={vertical} />
        </div>

        {/* Quick Swapper (PRO) */}
        {isPro && (
          <div className="relative z-10 mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-500">
            <button
              onClick={swapVehicle}
              className="w-full flex items-center justify-center gap-2 bg-info/10 hover:bg-info/20 border border-info/30 text-info py-3 px-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
            >
              <RefreshCw className="w-4 h-4" />
              {vertical === "transport"
                ? PROFILE_STRINGS.header.swapModeText.transport
                : vertical === "delivery"
                  ? PROFILE_STRINGS.header.swapModeText.delivery
                  : PROFILE_STRINGS.header.swapModeText.fallback}
            </button>
            <p className="text-xs text-white/60 mt-2 font-medium">
              {PROFILE_STRINGS.header.swapModeHint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
