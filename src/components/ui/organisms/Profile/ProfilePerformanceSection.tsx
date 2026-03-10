import React from "react";
import { TrendingUp, Target, FileDown } from "lucide-react";
import type { VerticalType } from "../../../../types/calculator.types";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { SectionItemButton } from "../../atoms/SectionItemButton";

interface ProfilePerformanceSectionProps {
  costPerKm: number;
  vertical: VerticalType | null;
  dailyGoal: number;
  dailyHours: number;
  dailyProgressPct: number;
  efficiencyPct: number;
  activeExpensesCount: number;
  todayTrips: any[];
  kmPerLiter: number;
  handleFieldSave: (data: any) => void;
}

export const ProfilePerformanceSection: React.FC<
  ProfilePerformanceSectionProps
> = () => {
  const { performance } = PROFILE_STRINGS.sections;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <h3 className="text-xs font-extrabold text-moon uppercase tracking-widest pl-2 mb-4 flex items-center">
        {performance.title}
      </h3>

      <div className="space-y-2">
        {/* 1. Estadísticas */}
        <SectionItemButton
          icon={TrendingUp}
          label={performance.stats}
          description={performance.statsDesc}
          onClick={() => console.log("Stats navigation")}
        />

        {/* 2. Metas diarias */}
        <SectionItemButton
          icon={Target}
          label={performance.goals}
          description={performance.goalsDesc}
          badge={performance.badge}
          badgeVariant="accent"
          onClick={() => console.log("Goals navigation")}
        />

        {/* 3. Exportar reportes */}
        <SectionItemButton
          icon={FileDown}
          label={performance.export}
          description={performance.exportDesc}
          onClick={() => console.log("Export navigation")}
        />
      </div>
    </div>
  );
};
