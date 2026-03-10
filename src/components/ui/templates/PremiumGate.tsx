import React from 'react';
import { Lock } from '../../../lib/icons';
import { useProfileStore } from '../../../store/useProfileStore';

interface PremiumGateProps {
    children: React.ReactNode;
    featureName?: string;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ children, featureName = 'esta funcionalidad' }) => {
    const isPro = useProfileStore((state) => state.isPro);
    const isInitialLoading = useProfileStore((state) => state.isInitialLoading);

    // Evitar parpadeo del Paywall durante la hidratación inicial
    if (isInitialLoading) {
        return (
            <div className="relative overflow-hidden rounded-4xl bg-white/5 animate-pulse min-h-[100px] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/30 animate-spin" />
            </div>
        );
    }

    if (isPro) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-4xl group">
            {/* Contenido borroso de fondo */}
            <div className="blur-sm opacity-50 pointer-events-none select-none">
                {children}
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-[2px]">
                <div className="w-12 h-12 bg-nodo-wine/20 rounded-2xl flex items-center justify-center mb-4 border border-nodo-wine/30 shadow-2xl">
                    <Lock className="w-5 h-5 text-nodo-wine" />
                </div>

                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">
                    Función Premium
                </h3>

                <p className="text-xs text-white/60 mb-6 font-medium leading-relaxed max-w-[200px] mx-auto">
                    Desbloqueá {featureName} convirtiéndote en conductor PRO.
                </p>

                <button
                    onClick={() => {
                        // Demo action: toggle pro for testing
                        if (confirm('¿[DEMO] Simular pago de suscripción PRO?')) {
                            useProfileStore.getState().setProfile({ isPro: true });
                        }
                    }}
                    className="btn-primary w-full max-w-[220px] shadow-[0_0_20px_rgba(233,69,96,0.3)] border-nodo-wine/50"
                >
                    Obtener Acceso PRO
                </button>
            </div>
        </div>
    );
};
