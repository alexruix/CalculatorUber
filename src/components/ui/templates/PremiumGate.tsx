import React from 'react';
import { ark } from '@ark-ui/react/factory';
import { Lock } from '../../../lib/icons';
import { useProfileStore } from '../../../store/useProfileStore';
import { PREMIUM } from '../../../data/ui-strings';
import { Button } from '../atoms/Button';
import { cn } from '../../../lib/utils';

interface PremiumGateProps {
    children: React.ReactNode;
    featureName?: string;
    className?: string;
}

/**
 * PremiumGate - Template Component
 * ─────────────────────────────────────────────────────────────
 * Protege funcionalidades Pro con un paywall de estética racing.
 * V2: Alineado con el Design System (Secondary Nebula theme).
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({ 
    children, 
    featureName = 'esta funcionalidad',
    className
}) => {
    const isPro = useProfileStore((state) => state.isPro);
    const isInitialLoading = useProfileStore((state) => state.isInitialLoading);

    // Evitar parpadeo del Paywall durante la hidratación inicial
    if (isInitialLoading) {
        return (
            <div className={cn(
                "relative overflow-hidden rounded-3xl bg-white/5 animate-pulse min-h-[100px] flex items-center justify-center",
                className
            )}>
                <div className="w-8 h-8 rounded-full border-2 border-secondary/10 border-t-secondary/40 animate-spin" />
            </div>
        );
    }

    if (isPro) {
        return <>{children}</>;
    }

    return (
        <ark.div className={cn("relative overflow-hidden rounded-3xl group border-2 border-secondary/10 bg-secondary/5", className)}>
            {/* Contenido borroso de fondo (Ghost View) */}
            <div className="blur-md opacity-30 pointer-events-none select-none transition-all duration-700">
                {children}
            </div>

            {/* Paywall Overlay - Racing Dashboard Aesthetic */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-xs animate-fade-in">
                
                {/* Hexagon/Locked Icon Container */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center border-2 border-secondary/40 shadow-[0_0_20px_var(--color-secondary-glow)]">
                        <Lock className="w-7 h-7 text-secondary text-glow-secondary" />
                    </div>
                </div>

                <h3 className="text-sm font-extrabold text-starlight uppercase tracking-[0.2em] mb-2 text-glow-secondary">
                    {PREMIUM.title}
                </h3>

                <p className="text-xs text-white/50 mb-8 font-medium leading-relaxed max-w-[240px] mx-auto uppercase tracking-wide">
                    {PREMIUM.description(featureName)}
                </p>

                <Button
                    variant="gradient"
                    size="md"
                    className="w-full max-w-[240px] border border-secondary/50 shadow-[0_0_25px_var(--color-secondary-glow)]"
                    onClick={() => {
                        // Demo action: toggle pro for testing
                        if (confirm(PREMIUM.demoConfirm)) {
                            useProfileStore.getState().setProfile({ isPro: true });
                        }
                    }}
                >
                    {PREMIUM.action}
                </Button>
            </div>
            
            {/* Decorative Corner Element (Racing detail) */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary-glow)]" />
            </div>
        </ark.div>
    );
};

PremiumGate.displayName = 'PremiumGate';
