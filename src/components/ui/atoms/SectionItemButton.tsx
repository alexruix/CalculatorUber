import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge, type BadgeVariant } from "./Badge";

export interface SectionItemButtonProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  onClick?: () => void;
  danger?: boolean; // For logout/delete actions
}

export const SectionItemButton: React.FC<SectionItemButtonProps> = ({
  icon: Icon,
  label,
  description,
  badge,
  badgeVariant = "primary",
  onClick,
  danger = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl",
        "bg-white/5 border-2 border-white/10",
        "hover:bg-white/10 hover:border-white/20",
        "active:scale-[0.98]",
        "transition-all duration-200",
        "flex items-center gap-4",
        "text-left",
        danger && "hover:bg-red-500/10 hover:border-red-500/30",
      )}
    >
      {/* Icon Circle */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0",
          danger && "bg-red-500/10",
        )}
      >
        <Icon
          className={cn("w-6 h-6", danger ? "text-red-400" : "text-starlight")}
          aria-hidden="true"
        />
      </div>

      {/* Content block */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-base font-bold",
            danger ? "text-red-400" : "text-starlight",
          )}
        >
          {label}
        </p>
        {description && (
          <p className="text-sm text-moon truncate">{description}</p>
        )}
      </div>

      {/* Optional Gaming Badge */}
      {badge && (
        <div className="shrink-0 mr-1">
          <Badge variant={badgeVariant} size="sm">
            {badge}
          </Badge>
        </div>
      )}

      {/* Chevron Arrow */}
      <ChevronRight
        className={cn(
          "w-5 h-5 shrink-0",
          danger ? "text-red-400/50" : "text-moon",
        )}
        aria-hidden="true"
      />
    </button>
  );
};

SectionItemButton.displayName = "SectionItemButton";
