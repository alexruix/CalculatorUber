import React from "react";
import { User, Car, Target, DollarSign, ChevronRight } from "lucide-react";
import type { VerticalType } from "../../../../types/calculator.types";
import { PROFILE_STRINGS } from "../../../../data/profile.data";
import { SectionItemButton } from "../../atoms/SectionItemButton";

interface ProfileMachineSectionProps {
  vehicleName: string;
  vertical: VerticalType | null;
  // Other props kept for future detail views or hidden inline edits
  fuelPrice: number;
  kmPerLiter: number;
  maintPerKm: number;
  handleFieldSave: (data: any) => void;
  handleVerticalSelect: (v: VerticalType) => void;
}

export const ProfileMachineSection: React.FC<ProfileMachineSectionProps> = ({
  vehicleName,
  vertical,
  handleVerticalSelect,
}) => {
  const { machine } = PROFILE_STRINGS.sections;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="text-xs font-extrabold text-moon uppercase tracking-widest pl-2 mb-4">
        {machine.title}
      </h3>

      <div className="space-y-2">
        {/* 1. Datos personales */}
        <SectionItemButton
          icon={User}
          label={machine.personalData}
          description={machine.personalDataDesc}
          onClick={() => console.log("Personal data navigation")}
        />

        {/* 2. Mi vehículo */}
        <SectionItemButton
          icon={Car}
          label={machine.myVehicle}
          description={vehicleName || machine.myVehicleDesc}
          onClick={() => console.log("Vehicle settings navigation")}
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
          onClick={() => console.log("Vertical switch navigation/modal")}
        />

        {/* 4. Gastos y costos */}
        <SectionItemButton
          icon={DollarSign}
          label={machine.expenses}
          description={machine.expensesDesc}
          onClick={() => console.log("Expenses settings navigation")}
        />
      </div>
    </div>
  );
};
