import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthTemplateProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ title, description, children }) => {
    return (
        <div className="relative min-h-screen bg-[#0b0b0b] text-white overflow-hidden flex flex-col items-center">

            {/* Top Glow (Radial Gradient fading into black) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,var(--color-primary-dim)_0%,transparent_70%)] opacity-50 pointer-events-none" />

            {/* Navigation and Control */}
            <div className="w-full h-16 flex items-center px-4 absolute top-0 left-0 z-20">
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            <main className="flex-1 w-full max-w-sm flex flex-col justify-center px-6 pt-20 pb-24 z-10">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-10 w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] mb-6">
                        <span className="text-black font-extrabold text-xl tracking-tighter">M</span>
                    </div>

                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight mb-3">
                        {title}
                    </h1>
                    <p className="text-sm font-medium text-white/50 max-w-[280px]">
                        {description}
                    </p>
                </div>

                {/* Authentication Form */}
                <div className="w-full animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100 fill-mode-both">
                    {children}
                </div>
            </main>

            {/* Footer Legal Links */}
            <footer className="absolute bottom-6 left-0 w-full flex items-center justify-center gap-6 z-20">
                <a href="#" className="text-xs font-medium text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">
                    Términos de Uso
                </a>
                <a href="#" className="text-xs font-medium text-white/40 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">
                    Política de Privacidad
                </a>
            </footer>

        </div>
    );
};
