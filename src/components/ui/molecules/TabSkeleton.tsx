/**
 * TabSkeleton.tsx
 * ─────────────────────────────────────────────────────────────
 * Skeleton loader para el Suspense de React.lazy de las pestañas.
 * Imita la estructura de la Calculator Card para evitar  el
 * "salto" visual al cargar el chunk de Javascript.
 */
import React from 'react';

export const TabSkeleton: React.FC = () => {
    return (
        <div className="w-full flex justify-center animate-pulse pt-2 pb-24 px-4">
            <div className="w-full max-w-[500px] flex flex-col gap-4">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center px-2 pt-2">
                    <div className="h-4 w-24 bg-white/10 rounded-full"></div>
                    <div className="h-6 w-20 bg-brand-sea/20 rounded-full"></div>
                </div>

                {/* Main Card (ProfitabilityScore shape) */}
                <div className="glass-card p-6 md:p-8 rounded-4xl border border-white/5 relative overflow-hidden h-[300px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                    {/* Top Row Skeleton */}
                    <div className="flex justify-between items-start">
                        <div className="h-3 w-16 bg-white/10 rounded-full"></div>
                        <div className="h-6 w-6 bg-white/10 rounded-full"></div>
                    </div>

                    {/* Big Score Skeleton */}
                    <div className="my-6">
                        <div className="h-16 w-32 bg-white/10 rounded-3xl mb-2"></div>
                        <div className="h-4 w-48 bg-white/5 rounded-full"></div>
                    </div>

                    {/* Bottom Metrics Skeleton */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                            <div className="h-3 w-12 bg-white/10 rounded-full mb-2"></div>
                            <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                        </div>
                        <div>
                            <div className="h-3 w-16 bg-white/10 rounded-full mb-2"></div>
                            <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Form Input Skeletons */}
                <div className="glass-card p-6 rounded-4xl border border-white/5 flex flex-col gap-5 mt-2">
                    <div className="h-5 w-32 bg-white/10 rounded-full mb-2"></div>
                    <div className="h-14 w-full bg-white/5 rounded-2xl border border-white/5"></div>
                    <div className="h-14 w-full bg-white/5 rounded-2xl border border-white/5"></div>
                    <div className="h-14 w-full bg-white/5 rounded-2xl border border-white/5"></div>
                </div>
            </div>
        </div>
    );
};
