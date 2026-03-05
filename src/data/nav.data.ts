/**
 * nav.data.ts
 * ─────────────────────────────────────────────────────────────
 * Definición de las pestañas del BottomNavigation.
 * Al separar los datos del presentacional, cambiar labels o el
 * orden de tabs no requiere tocar el componente.
 */
import { NotebookPen, TimerReset, History, User, Home } from '../lib/icons';
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
  { id: 'home',    label: 'Inicio',    icon: Home         },
  { id: 'trips',   label: 'Viajes', icon: NotebookPen },
  { id: 'close',   label: 'Cierre',    icon: TimerReset  },
  { id: 'history', label: 'Historial', icon: History     },
  { id: 'profile', label: 'Perfil',    icon: User        },
];
