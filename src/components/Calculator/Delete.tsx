import React from 'react';
import { Calculator, BarChart3, History, User } from 'lucide-react';

export type TabId = 'calculator' | 'history' | 'analysis' | 'profile';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

interface BottomTabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  badgeCount?: number; 
}

const tabs: Tab[] = [
  { id: 'calculator', label: '', icon: Calculator }, 
  { id: 'history', label: '', icon: History }, 
  { id: 'analysis', label: '', icon: BarChart3 }, 
  { id: 'profile', label: '', icon: User },
];

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({
  activeTab,
  onTabChange,
  badgeCount = 0
}) => {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 z-50 pb-safe"
      aria-label="Navegación principal de la aplicación"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'history' && badgeCount > 0;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${tab.label}${showBadge ? `, ${badgeCount} viajes en sesión` : ''}`}
              className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 touch-target
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                ${isActive ? 'text-sky-400' : 'text-white/40 hover:text-white/70'}
              `}
            >
              {/* Átomo: Indicador de Pestaña Activa */}
              {isActive && (
                <div className="absolute top-0 w-10 h-1 bg-sky-400 rounded-b-full shadow-[0_0_12px_rgba(56,189,248,0.6)] animate-in fade-in" />
              )}

              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]' : 'scale-100'}`} 
                  aria-hidden="true" 
                />

                {/* Átomo: Badge de Notificación (Actualizado para accesibilidad) */}
                {showBadge && (
                  <div className="absolute -top-2 -right-2 min-w-5] h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center px-1 animate-in zoom-in-95">
                    <span className="text-[10px] font-black text-white leading-none tracking-tighter">
                      {badgeCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Etiqueta de Texto */}
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none transition-colors duration-300
                ${isActive ? 'text-sky-400' : 'text-white/40'}
              `}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};