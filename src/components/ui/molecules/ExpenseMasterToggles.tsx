import React, { useMemo } from "react";
import { Fuel, Wrench, ShieldCheck, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import { Switch } from "@ark-ui/react/switch";
import type { ExpenseToggle } from "../../../types/calculator.types";

interface ExpenseMasterTogglesProps {
  expenseSettings: ExpenseToggle[];
  kmPerLiter: number;
  fuelPrice: number;
  maintPerKm: number;
  amortizationPerKm: number;
  onToggle: (id: string) => void;
}

const EXPENSE_META: Record<
  string,
  { label: string; desc: string; Icon: React.ElementType }
> = {
  fuel: {
    label: "Combustible",
    desc: "Gasto de nafta por KM recorrido",
    Icon: Fuel,
  },
  maintenance: {
    label: "Mantenimiento",
    desc: "Lavado, aceite y gastos corrientes",
    Icon: Wrench,
  },
  amortization: {
    label: "Amortización",
    desc: "Ahorro para mecánico y desgaste",
    Icon: ShieldCheck,
  },
};

// Same formula as useProfitability
function calcCostPerKm(
  expenseSettings: ExpenseToggle[],
  kmPerLiter: number,
  fuelPrice: number,
  maintPerKm: number,
  amortizationPerKm: number,
): number {
  let cost = 0;
  const expenses = Array.isArray(expenseSettings) ? expenseSettings : [];
  const isFuel = expenses.find((e) => e.id === "fuel")?.enabled;
  const isMaint = expenses.find((e) => e.id === "maintenance")?.enabled;
  const isAmort = expenses.find((e) => e.id === "amortization")?.enabled;

  if (isFuel && kmPerLiter > 0) cost += fuelPrice / kmPerLiter;
  if (isMaint) cost += maintPerKm;
  if (isAmort) cost += amortizationPerKm;
  return Math.round(cost);
}

export const ExpenseMasterToggles: React.FC<ExpenseMasterTogglesProps> = ({
  expenseSettings,
  kmPerLiter,
  fuelPrice,
  maintPerKm,
  amortizationPerKm,
  onToggle,
}) => {
  const costPerKm = useMemo(
    () => calcCostPerKm(expenseSettings, kmPerLiter, fuelPrice, maintPerKm, amortizationPerKm),
    [expenseSettings, kmPerLiter, fuelPrice, maintPerKm, amortizationPerKm],
  );

  const enabledCount = Array.isArray(expenseSettings) ? expenseSettings.filter((e) => e.enabled).length : 0;

  return (
    <div className="space-y-3">
      {/* Live preview pill */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="label-base">Incluir en el Costo</span>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
          <span className="text-xs font-black text-white/40 uppercase tracking-widest">
            Costo/KM
          </span>
          <span className="text-base font-black text-white">${costPerKm}</span>
        </div>
      </div>

      <fieldset className="space-y-2.5 border-0 p-0 m-0">
        <legend className="sr-only">
          Selección de gastos a incluir en el cálculo
        </legend>

        {Array.isArray(expenseSettings) && expenseSettings.map((expense) => {
          const meta = EXPENSE_META[expense.id];
          if (!meta) return null;
          const { Icon, label, desc } = meta;
          const isOn = expense.enabled;

          // Calculate partial cost contribution for preview
          const withToggle = expenseSettings.map((e) =>
            e.id === expense.id ? { ...e, enabled: !isOn } : e,
          );
          const previewCost = calcCostPerKm(
            withToggle,
            kmPerLiter,
            fuelPrice,
            maintPerKm,
            amortizationPerKm,
          );
          const diff = previewCost - costPerKm;

          return (
            <Switch.Root
              key={expense.id}
              checked={isOn}
              onCheckedChange={() => onToggle(expense.id)}
              className={isOn ? "toggle-row-on border-info box-glow-secondary" : "toggle-row-off border-white/10"}
            >
              <Switch.HiddenInput />
              <div className="flex items-center gap-3.5">
                <Switch.Control className="sr-only">
                  <Switch.Thumb />
                </Switch.Control>
                <div
                  className={`icon-wrap-md ${isOn ? "icon-wrap-accent box-glow-secondary" : "icon-wrap-neutral"}`}
                  aria-hidden="true"
                >
                  <Icon
                    size={18}
                    className={isOn ? "text-info text-glow-secondary" : "text-white/40"}
                  />
                </div>

                <div className="text-left">
                  <Switch.Label className={isOn ? "toggle-label-on text-glow-secondary" : "toggle-label-off"}>
                    {label}
                  </Switch.Label>
                  <p className={isOn ? "toggle-desc-on" : "toggle-desc-off"}>
                    {desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Preview of cost impact when toggling */}
                {diff !== 0 && (
                  <span
                    className={`text-xs font-black uppercase tracking-tight flex items-center gap-0.5 ${isOn
                      ? "text-success" // turning OFF → cost goes down → green
                      : "text-error" // turning ON  → cost goes up   → red
                      }`}
                    aria-hidden="true"
                  >
                    {isOn ? (
                      <TrendingDown size={11} />
                    ) : (
                      <TrendingUp size={11} />
                    )}
                    ${Math.abs(diff)}
                  </span>
                )}
                <div
                  className={
                    isOn ? "toggle-indicator-on shadow-[0_0_15px_var(--color-info-glow)]" : "toggle-indicator-off"
                  }
                  aria-hidden="true"
                >
                  {isOn && <CheckCircle2 size={14} className="text-white" />}
                </div>
              </div>
            </Switch.Root>
          );
        })}
      </fieldset>

      {/* Education note */}
      <div
        role="note"
        className="flex items-start gap-3 p-3.5 bg-white/3 rounded-2xl border border-white/7"
      >
        <span
          className="text-info text-lg leading-none shrink-0"
          aria-hidden="true"
        >
          💡
        </span>
        <p className="feedback-info">
          Al apagar un gasto, el costo/KM baja en tiempo real y tu margen sube.
          Útil para comparar estrategias.
        </p>
      </div>
    </div>
  );
};
