import React, { useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { TextLink } from '../atoms/TextLink';
import { GoogleButton } from '../atoms/GoogleButton';
import { useAuthForm } from '../../../hooks/useAuthForm';
import { cn } from '../../../lib/utils';

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = React.useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'password-updated') {
            setSuccessMessage('Contraseña actualizada con éxito. Ya podés ingresar.');
        }
    }, []);

    const handleLoginSuccess = () => {
        setLoginSuccess(true);
        if (onSuccess) {
            onSuccess();
        } else {
            setTimeout(() => {
                window.location.href = '/app';
            }, 800);
        }
    };

    // We bind directly to the existing hook functionality
    const {
        email, setEmail, password, setPassword,
        loading, error, handleAuth, handleGoogleLogin, canSubmit, isLocked
    } = useAuthForm(handleLoginSuccess, 'login');



    return (
        <form onSubmit={handleAuth} className="w-full flex justify-center">
            <div className="w-full max-w-sm flex flex-col items-center">

                {successMessage && (
                    <div className="w-full mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold text-center animate-in zoom-in-95 duration-500">
                        {successMessage}
                    </div>
                )}

                <div className="w-full space-y-5">
                    <FormField
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        icon={<Mail className="w-5 h-5" />}
                        required
                        disabled={loading || loginSuccess}
                        error={error?.toLowerCase().includes('email') ? error : undefined}
                    />

                    <FormField
                        id="password"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        icon={<Lock className="w-5 h-5" />}
                        required
                        isPassword
                        minLength={8}
                        disabled={loading || loginSuccess || isLocked}
                        error={error?.toLowerCase().includes('contraseña') ? error : undefined}
                    />

                    <div className="flex justify-end pr-2 -mt-2">
                        <TextLink href="/forgot-password" className="text-xs text-moon hover:text-primary-glow font-medium">
                            ¿Olvidaste tu contraseña?
                        </TextLink>
                    </div>
                </div>

                {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('contraseña') && (
                    <div 
                        role="alert" 
                        aria-live="polite" 
                        className="w-full mt-4 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold text-center animate-in shake"
                    >
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant={loginSuccess ? "neon" : (canSubmit ? "neon" : "secondary-dark")}
                    size="lg"
                    fullWidth
                    disabled={!canSubmit && !loginSuccess}
                    className={cn(
                        "mt-8 transition-all duration-500 gap-2 h-14",
                        loginSuccess && "bg-primary text-black scale-105 shadow-[0_0_30px_var(--color-primary-glow)]"
                    )}
                >
                    {loginSuccess ? (
                        <>¡Adentro! Redirigiendo...</>
                    ) : loading ? (
                        'Procesando...'
                    ) : (
                        <>
                            Ingresar
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </Button>

                <div className="w-full mt-8">
                    <div className="flex items-center gap-4 mb-6 opacity-60">
                        <div className="h-px bg-white/20 flex-1"></div>
                        <span className="text-xs font-medium text-moon text-center whitespace-nowrap">
                            o continuar con
                        </span>
                        <div className="h-px bg-white/20 flex-1"></div>
                    </div>
                    <div className="flex w-full">
                        <GoogleButton disabled={loading || loginSuccess} />
                    </div>
                </div>

                <div className="mt-8 text-center text-sm font-medium text-starlight">
                    ¿No tenés cuenta?{' '}
                    <TextLink href="/register">
                        Unite al club
                    </TextLink>
                </div>
            </div>
        </form>
    );
};
