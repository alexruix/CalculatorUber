import React, { useState, useEffect, useMemo } from 'react';
import { Mail, ArrowRight, CheckCircle2, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { FormField } from '../molecules/FormField';
import { Button } from '../atoms/Button';
import { OtpInput } from '../molecules/OtpInput';
import { useAuthForm, PASSWORD_REQUIREMENTS } from '../../../hooks/useAuthForm';

export const ForgotPasswordForm: React.FC = () => {
    // Reusing the state and functions from our custom hook
    const {
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        otpCode, setOtpCode,
        loading, error, handleResetPassword, handleVerifyOtp, handleUpdatePassword,
        handleResendOtp,
        view, canSubmit
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
                        <div 
                            role="alert" 
                            aria-live="polite" 
                            className="w-full mb-6 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-bold text-center animate-in shake"
                        >
                            {error}
                        </div>
                    )}

                    <Button
                        type="button"
                        onClick={() => handleVerifyOtp('recovery')}
                        variant={canSubmit ? "neon" : "secondary-dark"}
                        size="lg"
                        fullWidth
                        disabled={!canSubmit}
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
                            minLength={8}
                            error={error?.toLowerCase().includes('contraseña') && !error.toLowerCase().includes('coinciden') ? error : undefined}
                        />

                        {/* Validaciones de Seguridad Visuales */}
                        {password.length > 0 && (
                            <div className="flex flex-col gap-1.5 px-3 py-3 animate-in fade-in slide-in-from-top-1 duration-300 bg-white/2 rounded-2xl border border-white/5">
                                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Tu contraseña debe tener:</p>
                                {PASSWORD_REQUIREMENTS.map((check) => {
                                    const met = check.test(password);
                                    return (
                                        <div key={check.id} className={cn(
                                            "text-xs font-bold tracking-wide flex items-center gap-2 transition-all duration-300",
                                            met ? 'text-primary' : 'text-white/60'
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full flex items-center justify-center text-xs border transition-all duration-300",
                                                met ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/30"
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
                            error={confirmPassword.length >= password.length && confirmPassword !== password ? "Las contraseñas no coinciden" : undefined}
                        />
                    </div>

                    {error && !error.toLowerCase().includes('contraseña') && !error.toLowerCase().includes('coinciden') && (
                        <div 
                            role="alert" 
                            aria-live="polite" 
                            className="w-full mt-6 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-bold text-center animate-in shake"
                        >
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant={canSubmit ? "neon" : "secondary-dark"}
                        size="lg"
                        fullWidth
                        disabled={!canSubmit}
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
                    <div 
                        role="alert" 
                        aria-live="polite" 
                        className="w-full mt-6 p-3 rounded-2xl bg-error-bg border border-error-border text-error text-xs font-bold text-center animate-in shake"
                    >
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant={canSubmit ? "neon" : "secondary-dark"}
                    size="lg"
                    fullWidth
                    disabled={!canSubmit}
                    className="mt-8 transition-colors duration-300 gap-2 h-14"
                >
                    {loading ? 'Procesando...' : 'Enviar código'}
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
