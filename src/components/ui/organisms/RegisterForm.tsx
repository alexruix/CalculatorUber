import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { TextLink } from '../atoms/TextLink';
import { OtpInput } from '../molecules/OtpInput';
import { useAuthForm } from '../../../hooks/useAuthForm';

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
        loading, error, handleAuth, handleVerifyOtp, handleResendOtp,
        validatePassword, validateName
    } = useAuthForm(onSuccess || (() => window.location.href = '/app'), 'signup');

    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (view === 'check-email' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, view]);

    const handleResend = async () => {
        if (countdown > 0) return;
        const success = await handleResendOtp('signup');
        if (success) {
            setCountdown(60);
        }
    };

    const isFormValid = email.length > 0 && validateName(fullName) && validatePassword(password) && password === confirmPassword;

    if (view === 'check-email') {
        const isOtpValid = otpCode.length === 6;
        return (
            <div className="w-full flex justify-center mt-4">
                <div className="w-full max-w-sm flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-3">Verificá tu correo</h2>
                    <p className="text-sm font-medium text-starlight text-center mb-8">
                        Ingresá el código de 6 dígitos que enviamos a <strong>{email}</strong>.
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
                        <div className="w-full mb-6 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-medium text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="button"
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

                    <div className="mt-6 flex justify-center w-full">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={countdown > 0 || loading}
                            onClick={handleResend}
                            className="text-starlight hover:text-white"
                        >
                            {countdown > 0 ? `Reenviar código en ${countdown}s` : 'Reenviar código'}
                        </Button>
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

                    {/* Validaciones de Seguridad Visuales */}
                    {password.length > 0 && (
                        <div className="flex flex-col gap-1.5 px-1">
                            {[
                                { label: '8 caracteres mínimos', met: password.length >= 8 },
                                { label: 'Una mayúscula', met: /[A-Z]/.test(password) },
                                { label: 'Una minúscula', met: /[a-z]/.test(password) },
                                { label: 'Un número', met: /\d/.test(password) },
                                { label: 'Un caracter especial', met: /[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/\-]/.test(password) }
                            ].map((check, idx) => (
                                <div key={idx} className={`text-[11px] font-semibold tracking-wide flex items-center gap-2 transition-colors duration-300 ${check.met ? 'text-primary' : 'text-error'}`}>
                                    <span className="text-base leading-none">{check.met ? '✓' : '✗'}</span>
                                    {check.label}
                                </div>
                            ))}
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
                        error={error?.toLowerCase().includes('coinciden') || confirmPassword && password !== confirmPassword ? "Las contraseñas no coinciden" : undefined}
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
