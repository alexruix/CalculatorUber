/**
 * nav.data.ts
 * ─────────────────────────────────────────────────────────────
 * Definición de las pestañas del BottomNavigation.
 * Al separar los datos del presentacional, cambiar labels o el
 * orden de tabs no requiere tocar el componente.
 */
import { Calculator, BarChart3, History, User, Zap } from '../lib/icons';
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
  { id: 'simulator',  label: 'Turno',    icon: Zap         },
  { id: 'calculator', label: 'Cierre',   icon: Calculator  },
  { id: 'history',    label: 'Historial', icon: History    },
  { id: 'analysis',   label: 'Análisis', icon: BarChart3, hideOnXS: true },
  { id: 'profile',    label: 'Perfil',   icon: User        },
];
