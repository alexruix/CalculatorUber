import React from "react";
import { Sparkles, Users, Gift, Rocket } from "lucide-react";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { SectionItemButton } from "../../atoms/SectionItemButton";

export const ProfileDiscoverSection: React.FC = () => {
  const { discover } = PROFILE_STRINGS.sections;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h3 className="text-xs font-extrabold text-moon uppercase tracking-widest pl-2 mb-4">
        {discover.title}
      </h3>

      <div className="space-y-2">
        <SectionItemButton
          icon={Sparkles}
          label={discover.proTitle}
          description={discover.proDesc}
          badge={discover.proBadge}
          badgeVariant="accent" // Orange for "Nuevo"
          onClick={() => console.log("Pro navigation")}
        />

        <SectionItemButton
          icon={Users}
          label={discover.referralsTitle}
          description={discover.referralsDesc}
          badge={discover.referralsBadge}
          badgeVariant="primary" // Green for "$500"
          onClick={() => console.log("Referrals navigation")}
        />

        <SectionItemButton
          icon={Gift}
          label={discover.benefitsTitle}
          description={discover.benefitsDesc}
          onClick={() => console.log("Benefits navigation")}
        />

        <SectionItemButton
          icon={Rocket}
          label={discover.newsTitle}
          description={discover.newsDesc}
          onClick={() => console.log("News navigation")}
        />
      </div>
    </div>
  );
};

ProfileDiscoverSection.displayName = "ProfileDiscoverSection";
