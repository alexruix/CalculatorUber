import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { TextLink } from '../atoms/TextLink';
import { OtpInput } from '../molecules/OtpInput';
import { useAuthForm, PASSWORD_REQUIREMENTS } from '../../../hooks/useAuthForm';

interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const {
        view,
        fullName, setFullName,
        email, setEmail, password, setPassword,
        confirmPassword, setConfirmPassword,
        otpCode, setOtpCode,
        loading, error, setError, handleAuth, handleVerifyOtp, handleResendOtp,
        validatePassword, validateName
    } = useAuthForm(onSuccess || (() => window.location.href = '/app'), 'signup');

    // Debug logs para detectar reactividad
    useEffect(() => {
        console.log('[RegisterForm] State Updated:', { 
            fullName, 
            email, 
            password: '***', 
            confirmPassword: '***',
            isNameValid: validateName(fullName),
            isEmailValid: email.includes('@'),
            isPassValid: validatePassword(password),
            isMatch: password === confirmPassword
        });
    }, [fullName, email, password, confirmPassword, validateName, validatePassword]);

    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        // Cuando aterrizamos en la vista por primera vez, disparamos el timer
        if (view === 'check-email' && countdown === 0 && !error) {
            setCountdown(60);
        }

        let timer: NodeJS.Timeout;
        if (view === 'check-email' && countdown > 0) {
            timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, view, error]);

    const handleResend = async () => {
        if (countdown > 0) return;
        const success = await handleResendOtp('signup');
        if (success) {
            // Reiniciamos el timer a 60 si el backend confirma el envío
            setCountdown(60);
        }
    };

    const isFormValid = useMemo(() => {
        const nameOk = validateName(fullName);
        const passOk = validatePassword(password);
        const matchOk = password === confirmPassword;
        const emailOk = email.length > 0 && email.includes('@');
        
        const valid = nameOk && passOk && matchOk && emailOk && !loading;
        
        console.log('[RegisterForm] isFormValid Check:', { 
            nameOk, passOk, matchOk, emailOk, loading, 
            finalResult: valid 
        });
        
        return valid;
    }, [fullName, email, password, confirmPassword, loading, validateName, validatePassword]);

    if (view === 'check-email') {
        const isOtpValid = otpCode.length === 6;
        return (
            <div className="w-full flex justify-center mt-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-full max-w-sm flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-3">Verificá tu correo</h2>
                    <p className="text-sm font-medium text-starlight text-center mb-8 leading-relaxed">
                        Ingresá el código de 6 dígitos que enviamos a <br />
                        <strong className="text-white">{email}</strong>.
                    </p>

                    <div className="w-full mb-8">
                        <OtpInput
                            value={otpCode}
                            onChange={setOtpCode}
                            disabled={loading}
                            error={error !== null}
                        />
                    </div>

                    {error && (
                        <div className="w-full mb-6 p-3 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-medium text-center animate-in shake">
                            {error}
                        </div>
                    )}

                    <Button
                        type="button" // Cambiar a submit si se envuelve en un <form> propio
                        onClick={() => handleVerifyOtp('signup')}
                        variant={isOtpValid ? "neon" : "secondary-dark"}
                        size="lg"
                        fullWidth
                        disabled={!isOtpValid || loading}
                        className="transition-colors duration-300 gap-2 h-14"
                    >
                        {loading ? 'Verificando...' : 'Confirmar cuenta'}
                        {!loading && <ChevronRight className="w-5 h-5" />}
                    </Button>

                    <div className="mt-6 flex flex-col items-center justify-center w-full gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={countdown > 0 || loading}
                            onClick={handleResend}
                            className="text-starlight hover:text-white transition-colors"
                        >
                            {countdown > 0 ? `Reenviar código en ${countdown}s` : 'Volver a enviar el código'}
                        </Button>

                        {/* ✅ Mejora UX: Salida de emergencia si el usuario se equivocó de email */}
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest mt-2"
                        >
                            Usar otro correo
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleAuth} className="w-full flex justify-center">
            <div className="w-full max-w-sm flex flex-col items-center">

                <div className="w-full space-y-5">
                    <FormField
                        id="fullname"
                        type="text"
                        label="Nombre completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Pérez"
                        required
                        error={error?.toLowerCase().includes('nombre') ? error : undefined}
                    />

                    <FormField
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        icon={<Mail className="w-5 h-5" />}
                        required
                        error={error?.toLowerCase().includes('email') ? error : undefined}
                    />

                    <FormField
                        id="password"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        icon={<Lock className="w-5 h-5" />}
                        required
                        isPassword
                        minLength={8}
                        error={error?.toLowerCase().includes('contraseña') && !error.toLowerCase().includes('coinciden') ? error : undefined}
                    />

                    {/* Validaciones de Seguridad Visuales - Siempre visibles si hay algo escrito */}
                    {password.length > 0 && (
                        <div className="flex flex-col gap-1.5 px-3 py-3 animate-in fade-in slide-in-from-top-1 duration-300 bg-white/2 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Tu contraseña debe tener:</p>
                            {PASSWORD_REQUIREMENTS.map((check) => {
                                const met = check.test(password);
                                return (
                                    <div key={check.id} className={cn(
                                        "text-[11px] font-bold tracking-wide flex items-center gap-2 transition-all duration-300",
                                        met ? 'text-primary' : 'text-white/20'
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full flex items-center justify-center text-[10px] border transition-all duration-300",
                                            met ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/20"
                                        )}>
                                            {met ? '✓' : '•'}
                                        </div>
                                        {check.label}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <FormField
                        id="confirmPassword"
                        type="password"
                        label="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        icon={<Lock className="w-5 h-5" />}
                        required
                        isPassword
                        minLength={8}
                        error={
                            // Lógica Mersiva/Permisiva: Solo mostrar error si ya escribió el mismo largo o más
                            confirmPassword.length >= password.length && confirmPassword !== password 
                                ? "Las contraseñas no coinciden" 
                                : undefined
                        }
                    />
                </div>

                {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('contraseña') && !error.toLowerCase().includes('coinciden') && (
                    <div className="w-full mt-4 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-medium text-center">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant={isFormValid ? "neon" : "secondary-dark"}
                    size="lg"
                    fullWidth
                    disabled={!isFormValid || loading}
                    className="mt-8 transition-colors duration-300 gap-2 h-14"
                >
                    {loading ? 'Procesando...' : 'Crear cuenta'}
                    {!loading && <ChevronRight className="w-5 h-5" />}
                </Button>

                <div className="mt-8 mb-4 text-center text-sm font-medium text-starlight">
                    ¿Ya tenés cuenta?{' '}
                    <TextLink href="/login">
                        Inicia sesión
                    </TextLink>
                </div>
            </div>
        </form>
    );
};
