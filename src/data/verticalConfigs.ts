import { Car, Bike, Truck } from '../lib/icons';
import type { VerticalType } from '../types/calculator.types';

export interface VerticalConfig {
  id: VerticalType;
  title: string;      // e.g., "Transporte" (badgeText in Card)
  subtitle: string;   // e.g., "Viajes con pasajeros" (label in Card)
  Icon: React.ElementType;
  apps: string[];
  theme: {
    bg: string;          // e.g., "bg-success/10"
    border: string;      // e.g., "border-success/30"
    text: string;        // e.g., "text-success"
    badge: string;       // e.g., "badge-success"
    glow: string;        // e.g., "var(--color-success-glow)"
  };
}

export const VERTICAL_CONFIGS: Record<VerticalType, VerticalConfig> = {
  transport: {
    id: "transport",
    title: "Transporte",
    subtitle: "Viajes con pasajeros",
    Icon: Car,
    apps: ["Uber", "Cabify", "DiDi"],
    theme: {
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      badge: "badge-success",
      glow: "var(--color-success-glow)",
    },
  },
  delivery: {
    id: "delivery",
    title: "Delivery",
    subtitle: "Reparto urbano",
    Icon: Bike,
    apps: ["PedidosYa", "Rappi"],
    theme: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      text: "text-warning",
      badge: "badge-warning",
      glow: "var(--color-warning-glow)",
    },
  },
  logistics: {
    id: "logistics",
    title: "Logística",
    subtitle: "Cargas y fletes",
    Icon: Truck,
    apps: ["Mercado Libre", "Fletes"],
    theme: {
      bg: "bg-info/10",
      border: "border-info/30",
      text: "text-info",
      badge: "badge-info",
      glow: "var(--color-info-glow)",
    },
  },
};
