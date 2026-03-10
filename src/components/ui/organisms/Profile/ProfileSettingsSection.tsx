import React from "react";
import { Palette, Bell, ShieldCheck } from "lucide-react";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { SectionItemButton } from "../../atoms/SectionItemButton";

export const ProfileSettingsSection: React.FC = () => {
  const { settings } = PROFILE_STRINGS.sections;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h3 className="text-xs font-extrabold text-moon uppercase tracking-widest pl-2 mb-4">
        {settings.title}
      </h3>

      <div className="space-y-2">
        <SectionItemButton
          icon={Palette}
          label={settings.customization}
          description={settings.customizationDesc}
          onClick={() => console.log("Customization")}
        />

        <SectionItemButton
          icon={Bell}
          label={settings.notifications}
          description={settings.notificationsDesc}
          onClick={() => console.log("Notifications")}
        />

        <SectionItemButton
          icon={ShieldCheck}
          label={settings.security}
          description={settings.securityDesc}
          onClick={() => console.log("Security")}
        />
      </div>
    </div>
  );
};

ProfileSettingsSection.displayName = "ProfileSettingsSection";
