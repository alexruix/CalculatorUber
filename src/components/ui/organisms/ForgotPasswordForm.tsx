import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle2, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { OtpInput } from '../molecules/OtpInput';
import { useAuthForm } from '../../../hooks/useAuthForm';

export const ForgotPasswordForm: React.FC = () => {
    // Reusing the state and functions from our custom hook
    const {
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        otpCode, setOtpCode,
        loading, error, handleResetPassword, handleVerifyOtp, handleUpdatePassword,
        handleResendOtp,
        view
    } = useAuthForm(() => {
        window.location.href = '/app';
    }, 'forgot-password');

    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (view === 'check-email' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, view]);

    const handleResend = async () => {
        if (countdown > 0) return;
        const success = await handleResendOtp('recovery');
        if (success) {
            setCountdown(60);
        }
    };

    const isEmailValid = email.length > 0;
    const isOtpValid = otpCode.length === 6;
    const isPasswordValid = password.length > 5 && password === confirmPassword;

    if (view === 'check-email') {
        return (
            <div className="w-full flex justify-center mt-4">
                <div className="w-full max-w-sm flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-3">Revisá tu correo</h2>
                    <p className="text-sm font-medium text-starlight text-center mb-8">
                        Ingresá el código de 6 dígitos que enviamos a <strong>{email}</strong> para recuperar tu cuenta.
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
                        onClick={() => handleVerifyOtp('recovery')}
                        variant={isOtpValid ? "neon" : "secondary-dark"}
                        size="lg"
                        fullWidth
                        disabled={!isOtpValid || loading}
                        className="transition-colors duration-300 gap-2 h-14"
                    >
                        {loading ? 'Verificando...' : 'Confirmar código'}
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

    if (view === 'reset-password') {
        return (
            <form onSubmit={handleUpdatePassword} className="w-full flex justify-center">
                <div className="w-full max-w-sm flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-3">Nueva contraseña</h2>
                    <p className="text-sm font-medium text-starlight text-center mb-8">
                        Ingresá tu nueva clave para asegurar tu cuenta.
                    </p>

                    <div className="w-full space-y-5">
                        <FormField
                            id="password"
                            type="password"
                            label="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            icon={<Lock className="w-5 h-5" />}
                            required
                            isPassword
                            minLength={6}
                            error={error?.toLowerCase().includes('contraseña') && !error.toLowerCase().includes('coinciden') ? error : undefined}
                        />

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
                            minLength={6}
                            error={error?.toLowerCase().includes('coinciden') || confirmPassword && password !== confirmPassword ? "Las contraseñas no coinciden" : undefined}
                        />
                    </div>

                    {error && !error.toLowerCase().includes('contraseña') && !error.toLowerCase().includes('coinciden') && (
                        <div className="w-full mt-6 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-medium text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant={isPasswordValid ? "neon" : "secondary-dark"}
                        size="lg"
                        fullWidth
                        disabled={!isPasswordValid || loading}
                        className="mt-8 transition-colors duration-300 gap-2 h-14"
                    >
                        {loading ? 'Procesando...' : 'Actualizar y entrar'}
                        {!loading && <ChevronRight className="w-5 h-5" />}
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleResetPassword} className="w-full flex justify-center">
            <div className="w-full max-w-sm flex flex-col items-center">

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
                        error={error?.toLowerCase().includes('email') ? error : undefined}
                    />
                </div>

                {error && !error.toLowerCase().includes('email') && (
                    <div className="w-full mt-6 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-medium text-center">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant={isEmailValid ? "neon" : "secondary-dark"}
                    size="lg"
                    fullWidth
                    disabled={!isEmailValid || loading}
                    className="mt-8 transition-colors duration-300 gap-2 h-14"
                >
                    {loading ? 'Procesando...' : 'Recuperar'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </Button>

                <div className="mt-8 w-full flex justify-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = '/login'}
                        className="text-moon hover:text-white"
                        disabled={loading}
                    >
                        Volver a iniciar sesión
                    </Button>
                </div>
            </div>
        </form>
    );
};
