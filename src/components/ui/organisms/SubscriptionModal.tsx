import React, { useState, useEffect } from 'react';
import { Rocket, Star, History, CheckCircle2, X } from 'lucide-react';
import { useProfileStore } from '../../../store/useProfileStore';
import { supabase } from '../../../lib/supabase';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, featureName = "esta funcionalidad" }) => {
    const { user, setProfile } = useProfileStore();

    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // En producción, esto viene de variable de entorno
        const publicKey = import.meta.env.PUBLIC_MP_PUBLIC_KEY || 'TEST-33e186af-c333-40d4-a7f4-3661fc909e0d';
        initMercadoPago(publicKey, { locale: 'es-AR' });
    }, []);

    if (!isOpen) return null;

    const handleUpgrade = async () => {
        if (!user) {
            alert('Debes iniciar sesión para suscribirte.');
            return;
        }

        setIsLoading(true);

        try {
            // Endpoint hacia nuestro backend (Astro API Route) para crear una Preference
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id
                })
            });

            // Simulación: Si MP falla por auth de test, volvemos al modo de simulacion anterior
            if (!response.ok) {
                const confirmUpdate = window.confirm('[MODO DEV] MP falló (Falta Token Válido). ¿Simular actualización a PRO localmente?');
                if (confirmUpdate) {
                    setProfile({ isPro: true });
                    await supabase.from('profiles').update({ subscription_tier: 'pro' }).eq('id', user.id);
                    alert('¡Bienvenido a Manejate PRO (Simulado)!');
                    onClose();
                }
                return;
            }

            const data = await response.json();
            setPreferenceId(data.id);
        } catch (error) {
            console.error('Error generando Checkout:', error);
            alert('Hubo un error al procesar el pago. Intenta más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop obscuro */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-nodo-wine/10 border border-nodo-wine/30 rounded-[2.5rem] w-full max-w-sm p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 bg-gradient-to-tr from-nodo-wine to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-nodo-wine/20">
                    <Star className="w-8 h-8 text-white fill-white/20" />
                </div>

                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                    Manejate <span className="text-nodo-wine">PRO</span>
                </h2>

                <p className="text-sm font-medium text-white/50 leading-relaxed mb-8">
                    Desbloqueá <strong className="text-white">{featureName}</strong> y llevá tu control de ganancias al siguiente nivel.
                </p>

                <div className="w-full space-y-4 mb-8 text-left">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/80 font-medium leading-relaxed">
                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-0.5">Historial Ilimitado</strong>
                            Accedé a tus meses y años anteriores para liquidar impuestos.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/80 font-medium leading-relaxed">
                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-0.5">El Radar de Rentabilidad</strong>
                            Métricas avanzadas, tendencias semanales y consejos personalizados.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-white/80 font-medium leading-relaxed">
                            <strong className="text-white block uppercase tracking-widest text-[10px] mb-0.5">Sync en la Nube</strong>
                            Nunca pierdas tus datos, aunque cambies o pierdas el teléfono.
                        </p>
                    </div>
                </div>

                {!preferenceId ? (
                    <button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="btn-primary w-full h-14 text-sm gap-2 shadow-[0_0_30px_rgba(233,69,96,0.3)] bg-gradient-to-r from-nodo-wine to-red-600 border-none group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Asegurando conexión...</span>
                        ) : (
                            <>
                                <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Actualizar a PRO (ARS $3,500/mes)
                            </>
                        )}
                    </button>
                ) : (
                    <div className="w-full">
                        <Wallet initialization={{ preferenceId }} />
                    </div>
                )}
            </div>
        </div>
    );
};
