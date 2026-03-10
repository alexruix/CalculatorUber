import React, { useState } from "react";
import { LogOut, Trash2 } from "lucide-react";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { SectionItemButton } from "../../atoms/SectionItemButton";

interface ProfileSecuritySectionProps {
  handleLogout: () => void;
  handleReset: () => void;
}

export const ProfileSecuritySection: React.FC<ProfileSecuritySectionProps> = ({
  handleLogout,
  handleReset,
}) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const { account } = PROFILE_STRINGS.sections;

  return (
    <div className="px-2 space-y-4 animate-in fade-in duration-300">
      {/* 
        The guide separates Logout as a 'destructive action' at the bottom.
        We'll keep a small section for it.
      */}
      <div className="space-y-2">
        {/* Logout */}
        <SectionItemButton
          icon={LogOut}
          label={account.logout}
          onClick={handleLogout}
        />

        {/* Danger Zone (Delete Account / Reset) */}
        {!isConfirmingReset ? (
          <SectionItemButton
            icon={Trash2}
            label={account.dangerZone}
            description={account.dangerDesc}
            danger
            onClick={() => setIsConfirmingReset(true)}
          />
        ) : (
          <div className="p-6 border-2 border-error-border bg-error-bg text-center shadow-[0_0_30px_rgba(255,68,68,0.15)] animate-in zoom-in-95 duration-200 rounded-3xl">
            <h4
              id="danger-heading"
              className="text-sm font-black text-error uppercase tracking-widest mb-2"
            >
              {account.confirmTitle}
            </h4>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="btn-ghost flex-1 py-4 rounded-2xl font-bold uppercase text-xs"
                autoFocus
              >
                {account.cancel}
              </button>
              <button
                onClick={handleReset}
                className="btn-danger flex-1 py-4 rounded-2xl shadow-[0_0_20px_rgba(255,68,68,0.3)] font-black uppercase text-xs"
              >
                {account.confirmDelete}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
