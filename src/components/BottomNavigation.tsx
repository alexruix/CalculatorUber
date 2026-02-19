import React from 'react';
import { Calculator, BarChart3, User } from 'lucide-react';

export type TabId = 'calculator' | 'session' | 'profile';

interface Tab {
  id: TabId;
  label: string;
}

interface BottomTabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  badgeCount?: number; // Simplificado para mostrar viajes en la sesión actual
}

const tabs: Tab[] = [
    { id: 'calculator', label: 'CALCULADORA', icon: Calculator },
    { id: 'session', label: 'SESION', icon: BarChart3 },
    { id: 'profile', label: 'PERFIL', icon: User },
];

export const BottomTabNavigation: React.FC<BottomTabNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  badgeCount = 0
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-50 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-3 h-20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 touch-target
                ${isActive ? 'text-nodo-petrol' : 'text-white/30'}
              `}
            >
              {/* Indicador de pestaña activa tipo NODO */}
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-nodo-petrol rounded-b-full shadow-[0_0_10px_rgba(0,183,189,0.5)]" />
              )}

              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
                
                {/* Badge con tu color Wine para el historial */}
                {tab.id === 'session' && badgeCount > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-nodo-wine border border-black rounded-full flex items-center justify-center px-1 animate-in zoom-in">
                    <span className="text-[9px] font-black text-white leading-none">
                      {badgeCount}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-[9px] font-black tracking-[0.15em] leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};