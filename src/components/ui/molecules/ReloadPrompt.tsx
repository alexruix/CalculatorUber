import React from 'react';
// @ts-ignore - Virtual module provided by vite-plugin-pwa
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '../../../lib/utils';

export const ReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: any) {
      console.log('SW Registered');
    },
    onRegisterError(error: any) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-80 z-100 animate-in slide-in-from-bottom-5 duration-500">
      <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-primary/30 shadow-[0_0_30px_rgba(0,242,255,0.15)] flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
               <RefreshCw className={cn("w-5 h-5 text-primary", needRefresh && "animate-spin-slow")} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-0.5">
                {needRefresh ? 'Actualización' : 'Offline Ready'}
              </span>
              <p className="text-xs font-semibold text-white/90">
                {needRefresh 
                  ? 'Hay una nueva versión disponible.' 
                  : 'Manejate ya funciona sin conexión.'}
              </p>
            </div>
          </div>
          <button 
            onClick={close}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Cerrar aviso"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {needRefresh && (
          <Button 
            variant="neon" 
            size="sm" 
            fullWidth 
            onClick={() => updateServiceWorker(true)}
            className="h-10 text-[10px] tracking-widest uppercase font-black"
          >
            Recargar la app
          </Button>
        )}
      </div>
    </div>
  );
};
