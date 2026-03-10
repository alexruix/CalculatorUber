import React from "react";
import { Zap } from "../../../lib/icons";

interface CostoOperativoCardProps {
  costPerKm: number;
  vehicleName: string;
  className?: string;
}

export const CostoOperativoCard: React.FC<CostoOperativoCardProps> = ({
  costPerKm,
  vehicleName,
  className = "",
}) => {
  return (
    <div
      className={`glass-card rounded-4xl p-6 border border-white/10 text-center relative overflow-hidden shadow-2xl ${className}`}
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-error via-warning to-success opacity-50" />

      <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
        <Zap className="w-6 h-6 text-error" />
      </div>

      <h2 className="text-sm text-white/50 uppercase tracking-widest font-black mb-1">
        Costo Operativo
      </h2>
      <div className="flex justify-center items-end gap-1 mb-2">
        <span className="text-5xl font-black text-white tracking-tighter">
          ${Math.round(costPerKm)}
        </span>
        <span className="text-lg text-white/40 font-bold mb-1">/km</span>
      </div>
      <p className="text-xs text-white/40 mx-auto max-w-[250px] leading-relaxed">
        Esto te cuesta mover tu {vehicleName || "vehículo"} 1 kilómetro (nafta,
        arreglos y desgaste).
      </p>
    </div>
  );
};
