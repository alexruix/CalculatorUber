/**
 * nav.data.ts
 * ─────────────────────────────────────────────────────────────
 * Definición de las pestañas del BottomNavigation Manejate v3.
 */
import { History, User, Home, LayoutDashboard } from '../lib/icons';
import type { LucideIcon } from '../lib/icons';
import type { TabId } from '../components/ui/organisms/BottomNavigation';

export interface NavTab {
  id: TabId;
  /** Etiqueta visible bajo el ícono. Máximo 8 chars para mobile. */
  label: string;
  icon: LucideIcon;
  /** Si es true, solo se muestra en grid de 5 tabs (pantallas ≥ 375px) */
  hideOnXS?: boolean;
}

export const NAV_TABS: NavTab[] = [
  { id: 'home',    label: 'Inicio',      icon: Home },
  { id: 'stats',   label: 'Análisis',    icon: LayoutDashboard },
  { id: 'history', label: 'Historial',   icon: History },
  { id: 'profile', label: 'Perfil',      icon: User },
];
