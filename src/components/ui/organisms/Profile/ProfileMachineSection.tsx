import React from "react";
import { User, Car, Target, DollarSign, ChevronRight } from "lucide-react";
import type { VerticalType } from "../../../../types/calculator.types";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { SectionItemButton } from "../../atoms/SectionItemButton";

interface ProfileMachineSectionProps {
  vehicleName: string;
  vertical: VerticalType | null;
  onEditVehicle: () => void;
  onEditVertical: () => void;
  onEditExpenses: () => void;
}

export const ProfileMachineSection: React.FC<ProfileMachineSectionProps> = ({
  vehicleName,
  vertical,
  onEditVehicle,
  onEditVertical,
  onEditExpenses,
}) => {
  const { machine } = PROFILE_STRINGS.sections;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="text-xs font-extrabold text-moon uppercase tracking-widest pl-2 mb-4">
        {machine.title}
      </h3>

      <div className="space-y-2">
        {/* 1. Datos personales */}
        {/* <SectionItemButton
          icon={User}
          label={machine.personalData}
          description={machine.personalDataDesc}
          onClick={() => console.log("Personal data navigation")}
        /> */}

        {/* 2. Mi vehículo */}
        <SectionItemButton
          icon={Car}
          label={machine.myVehicle}
          description={vehicleName || machine.myVehicleDesc}
          onClick={onEditVehicle}
        />

        {/* 3. Rubro (Vertical) */}
        <SectionItemButton
          icon={Target}
          label={machine.vertical}
          description={
            vertical === "transport"
              ? "Transporte (Uber/Cabify)"
              : vertical === "delivery"
                ? "Delivery (Rappi/Pedidos)"
                : vertical === "logistics"
                  ? "Logística (Flete/Envíos)"
                  : machine.verticalDesc
          }
          onClick={onEditVertical}
        />

        {/* 4. Gastos y costos */}
        <SectionItemButton
          icon={DollarSign}
          label={machine.expenses}
          description={machine.expensesDesc}
          onClick={onEditExpenses}
        />
      </div>
    </div>
  );
};
