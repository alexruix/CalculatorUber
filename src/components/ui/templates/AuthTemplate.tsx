import React from 'react';
import { ArrowLeft } from 'lucide-react';
import iconLogo from '../../../assets/icon5.png';

interface AuthTemplateProps {
    title: string;
    description: string;
    children: React.ReactNode;
    logoUrl?: string;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({ title, description, children, logoUrl }) => {
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
                <h2 className="sr-only">Formulario de acceso</h2>
                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-10 w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <div className="relative group">
                        {/* Glow de fondo con el color de la marca */}
                        <div className="bg-primary/20 blur-3xl rounded-full scale-150 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Contenedor del Logo (Estilo Glassmorphism Cuadrado Redondeado) */}
                        <div className="relative mb-4 w-28 h-28 bg-white/3 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.15)] border border-white/10 overflow-hidden group-hover:border-primary/40 transition-colors duration-500">
                            {/* Overlay de luz interna */}
                            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

                            <img
                                src={"/icon5.png"}
                                alt="Manejate Logo"
                                className="w-full h-full object-contain animate-in zoom-in duration-700 ease-out"
                            />
                        </div>

                        {/* Badge sutil de versión o "beta" (Opcional, le da un look más pro) */}
                        {/* <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-secondary px-3 py-0.5 rounded-full shadow-[0_0_15px_var(--color-primary-glow)]">
                            <span className="text-xs font-black uppercase tracking-tighter text-black">V1.0</span>
                        </div> */}
                    </div>

                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight mb-3">
                        {title}
                    </h1>
                    <p className="text-sm font-medium text-white/70 max-w-[280px]">
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
                <a href="#" className="text-xs font-medium text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60">
                    Términos de Uso
                </a>
                <a href="#" className="text-xs font-medium text-white/70 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white/60">
                    Política de Privacidad
                </a>
            </footer>

        </div>
    );
};
