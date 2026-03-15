import React from "react";
import { CheckCircle } from "../../../lib/icons";
import { useProfileStore } from "../../../store/useProfileStore";
import { cn } from "../../../lib/utils";

interface RuleSuggestionCheckboxProps {
  ruleId: string;
}

export const RuleSuggestionCheckbox: React.FC<RuleSuggestionCheckboxProps> = ({ ruleId }) => {
  const acceptedRules = useProfileStore((state) => state.acceptedRules || []);
  const toggleRule = useProfileStore((state) => state.toggleRule);
  const isAccepted = acceptedRules.includes(ruleId);

  return (
    <button
      onClick={() => toggleRule?.(ruleId)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all relative",
        "min-h-[44px] min-w-[44px]", // Audit: Minimum touch target 44x44px
        isAccepted
          ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(0,240,104,0.2)]"
          : "bg-white/10 border-white/20 text-white/60 hover:text-white/90",
      )}
      aria-pressed={isAccepted}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors",
          isAccepted ? "bg-primary border-primary" : "border-white/40",
        )}
      >
        {isAccepted && <CheckCircle className="w-3 h-3 text-black" />}
      </div>
      <span className="text-xs font-bold uppercase tracking-tighter">
        {isAccepted ? "Aplicado" : "Aceptar"}
      </span>
    </button>
  );
};
