import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';
import { AUTH_ERRORS, translateAuthError } from '../constants/auth-errors';

export type AuthView = 'login' | 'signup' | 'check-email' | 'forgot-password' | 'reset-password';

export const PASSWORD_REQUIREMENTS = [
    { id: 'length', label: '8 caracteres mínimos', test: (pass: string) => pass.length >= 8 },
    { id: 'uppercase', label: 'Una mayúscula', test: (pass: string) => /[A-Z]/.test(pass) },
    { id: 'special', label: 'Un caracter especial (!@#$%^&*)', test: (pass: string) => /[!@#$%^&*]/.test(pass) },
];

export const useAuthForm = (onSuccess: () => void, initialView: AuthView = 'login') => {
    const [view, setView] = useState<AuthView>(initialView);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (pass: string) => {
        return PASSWORD_REQUIREMENTS.every(req => req.test(pass));
    };

    const validateName = (name: string) => {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-\']+$/.test(name) && name.length >= 2;
    };

// --- NUEVA FUNCIÓN PARA GOOGLE ---
const handleGoogleLogin = async (redirectTo?: string) => {
    // 1. Limpiamos errores previos y activamos el loading
    setLoading(true);
    setError(null);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo || `${window.location.origin}/app`
            }
        });

        if (error) throw error;

        // Nota: El navegador redirigirá automáticamente a la página de Google,
        // por lo que no hace falta setear loading(false) en caso de éxito.

    } catch (err: any) {
        // 3. Solo si hay un error inmediato (ej: problemas de red o config)
        // traducimos el error y apagamos el loader.
        setError(translateAuthError(err.message));
        setLoading(false);
    }
};

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setError('Por favor, ingresá un correo válido.');
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (view === 'signup') {
            if (!validateName(fullName)) {
                setError('Ingresá un nombre válido (letras y espacios únicamente).');
                return;
            }
            if (!validatePassword(password)) {
                setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un caracter especial.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Las contraseñas no coinciden.');
                return;
            }
        }

        // --- MODO DEMO BYPASS ---
        if (!isSupabaseConfigured()) {
            setLoading(true);
            setTimeout(() => {
                setError(null);
                useProfileStore.getState().setProfile({ isConfigured: true });
                onSuccess();
                setLoading(false);
            }, 1000);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (view === 'login') {
                const { error, data } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                
                if (data.session) {
                    onSuccess();
                }
            } else {
                const { error, data } = await supabase.auth.signUp({
                    email, 
                    password,
                    options: {
                        data: {
                            full_name: fullName.trim()
                        }
                    }
                });
                if (error) throw error;
                
                if (data.user && !data.session) {
                    setView('check-email');
                } else {
                    onSuccess();
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(translateAuthError(err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Por favor, ingresá un correo válido.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/forgot-password`
            });
            if (error) throw error;
            setView('check-email');
        } catch (err: any) {
            setError(translateAuthError(err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (type: 'signup' | 'recovery') => {
        if (otpCode.length !== 6) {
            setError('El código debe tener 6 dígitos.');
            return;
        }
        setLoading(true);
        setError(null);
        
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: type,
            });
            if (error) throw error;

            if (type === 'recovery') {
                setView('reset-password');
                setOtpCode(''); // reset
            } else if (type === 'signup') {
                if (data.session) {
                    onSuccess();
                } else {
                    // Fallback to login view if session wasn't started directly
                    setView('login');
                }
            }
        } catch (err: any) {
            setError(translateAuthError(err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async (type: 'signup' | 'recovery') => {
        setLoading(true);
        setError(null);
        try {
            if (type === 'signup') {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                });
                if (error) throw error;
            } else if (type === 'recovery') {
                // Para recovery en GoTrue, re-enviar significa pedir volver a disparar el reseteo
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
            }
            return true;
        } catch (err: any) {
            setError(translateAuthError(err.message));
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validatePassword(password)) {
        setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial.');
        return;
    }

    if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
    }

    setLoading(true);

    try {
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;

        await supabase.auth.signOut();
        // Mandamos el parámetro success para que el LoginForm muestre el mensaje verde.
        window.location.href = '/login?success=password-updated';

    } catch (err: any) {
        // Traducimos el error de Supabase (ej: link expirado o misma clave anterior)
        setError(translateAuthError(err.message));
        setLoading(false); 
    }
};

    const toggleView = () => {
        setView(prev => prev === 'login' ? 'signup' : 'login');
        setError(null);
    };

    // Diagnostic console logs
    console.log('[useAuthForm] Rendering Hook:', { 
        view, 
        email, 
        passwordLen: password.length, 
        confirmPasswordLen: confirmPassword.length,
        isPasswordValid: validatePassword(password),
        arePasswordsMatching: password === confirmPassword
    });

    return {
        view,
        setView,
        fullName,
        setFullName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        otpCode,
        setOtpCode,
        loading,
        error,
        setError,
        handleAuth,
        handleGoogleLogin,
        handleResetPassword,
        handleUpdatePassword,
        handleVerifyOtp,
        handleResendOtp,
        toggleView,
        showPassword,
        setShowPassword,
        validatePassword,
        validateName
    };
};