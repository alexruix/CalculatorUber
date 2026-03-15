import React from 'react';
import { Button } from '../atoms/Button';
import iconLogo from '../../../assets/icon5.png';
import { useAuthForm } from '../../../hooks/useAuthForm';
import { WELCOME } from '../../../data/ui-strings';
import { authCopy } from '../../../data/authContent';

interface WelcomeTemplateProps {
    logoUrl?: string;
}

export const WelcomeTemplate: React.FC<WelcomeTemplateProps> = ({ logoUrl }) => {
    const { handleGoogleLogin, loading } = useAuthForm(() => {
        window.location.href = `${window.location.origin}/app`;
    });

    return (
        <div className="relative min-h-screen bg-[#0b0b0b] text-white overflow-hidden flex flex-col items-center gap-6 justify-between px-6 pb-12 pt-16">
            {/* Top Glow (Radial Gradient fading into black) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_top,var(--color-primary-dim)_0%,transparent_70%)] opacity-80 pointer-events-none" />

            <div className="flex flex-col items-center flex-1 w-full max-w-sm justify-between">

                {/* Top Section: Logo (Approx 30% down visual weight) */}
                <div className="mt-12 md:mt-20 mb-4 flex flex-col items-center">
                    <div className="relative group">
                        {/* Glow de fondo con el color de la marca */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Contenedor del Logo (Estilo Glassmorphism Cuadrado Redondeado) */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            {/* Overlay de luz interna */}
                            <div className="absolute" />

                            <img
                                src={logoUrl || "/icon5.png"}
                                alt="Manejate Logo"
                                className="w-full h-full object-contain animate-in zoom-in duration-700 ease-out"
                            />
                        </div>

                        {/* Badge sutil de versión o "beta" (Opcional, le da un look más pro) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-secondary px-3 py-0.5 rounded-full shadow-[0_0_15px_var(--color-primary-glow)]">
                            <span className="text-xs font-black uppercase tracking-tighter text-black">{WELCOME.version('1.0')}</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Typography (Approx 55% down visual weight) */}
                <div className="text-center flex-1 flex flex-col justify-center max-w-[420px] mx-auto z-10 space-y-4 mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                        {WELCOME.title}
                    </h1>
                    <p className="text-lg text-white/70 font-medium leading-relaxed">
                        {WELCOME.subtitle}
                    </p>
                </div>

                {/* Bottom Section: Action Zone (Thumb Area) */}
                <div className="w-full flex flex-col gap-4 z-10">
                    <Button variant="secondary-dark" size="lg" fullWidth onClick={() => handleGoogleLogin(`${window.location.origin}/app`)} disabled={loading}>
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        {loading ? authCopy.loading.processing : authCopy.actions.continueWithGoogle}
                    </Button>
                    <Button variant="primary-white" size="lg" fullWidth onClick={() => window.location.href = '/register'}>
                        {WELCOME.createAccount}
                    </Button>
                    <Button variant="secondary-dark" size="lg" fullWidth onClick={() => window.location.href = '/login'}>
                        {authCopy.actions.toggleToLogin.split('? ')[1]}
                    </Button>
                </div>

            </div>
        </div>
    );
};
