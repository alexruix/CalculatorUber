/**
 * BottomNavigation.tsx
 * ─────────────────────────────────────────────────────────────
 * Barra de navegación inferior — Mobile First.
 * Consume NAV_TABS desde /data/nav.data.ts.
 *
 * Fluent 2: indicador slide activo, touch targets ≥44px,
 * contraste de label WCAG AA, motion reducida respetada.
 */
import React from 'react';
import { NAV_TABS } from '../../../data/nav.data';

export type TabId = 'home' | 'trips' | 'close' | 'history' | 'profile';

interface BottomTabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  badgeCount?: number;
}

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab,
  onTabChange,
  badgeCount = 0
}) => {
  return (
    <nav
      className="nav-bar"
      aria-label="Navegación principal de la aplicación"
    >
      {/* Grid de 5 columnas: layout fijo para mobile */}
      <div className="max-w-md mx-auto grid grid-cols-5 h-15 sm:h-20">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative flex flex-col items-center justify-center gap-1
                transition-colors duration-200
                /* touch target mínimo 44px via padding */
                px-1 py-2
                ${isActive ? 'text-info' : 'text-white/30 hover:text-white/50'}
              `}
            >
              {/* Indicador superior — Fluent 2 pill */}
              <span
                aria-hidden="true"
                className={`
                  absolute top-0 h-0.5 rounded-b-full
                  transition-all duration-300
                  ${isActive
                    ? 'w-8 bg-info shadow-[0_0_8px_var(--color-info)]'
                    : 'w-0 bg-transparent'}
                `}
              />

              {/* Ícono */}
              <span className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 motion-reduce:transform-none ${isActive ? 'scale-110' : 'scale-100'}`}
                  aria-hidden="true"
                />

                {/* Badge de notificación */}
                {tab.id === 'close' && badgeCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2.5 min-w-[16px] h-4 bg-error border border-black rounded-full flex items-center justify-center px-1"
                    aria-label={`${badgeCount} registros pendientes`}
                  >
                    <span className="text-[10px] font-black text-white leading-none">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  </span>
                )}
              </span>

              {/* Label — visible desde 360px, oculta en pantallas muy pequeñas */}
              <span
                className="font-black tracking-wider leading-none hidden xs:block"
                style={{ fontSize: 'var(--text-micro)' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};