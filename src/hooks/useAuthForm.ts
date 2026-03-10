import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';
import { translateAuthError } from '../constants/auth-errors';

export type AuthView = 'login' | 'signup' | 'check-email' | 'forgot-password' | 'reset-password';

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

    const validatePassword = (password: string) => {
        // Al menos 1 mayúscula, 1 minúscula, 1 número, 1 caracter especial (!@#$%^&*), y 8 caracteres
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{8,}$/.test(password);
    };

    const validateName = (name: string) => {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s\-\']+$/.test(name) && name.length >= 2;
    };

// --- NUEVA FUNCIÓN PARA GOOGLE ---
const handleGoogleLogin = async (redirectTo?: string) => {
    // Si estamos en modo demo (sin variables de entorno), evitamos la llamada
    if (!isSupabaseConfigured()) {
        setError('El login con Google no está disponible en el modo demo local.');
        return;
    }
    setLoading(true);
    setError(null);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Forzar redirección explícita o al dashboard
                redirectTo: redirectTo || `${window.location.origin}/app`
            }
        });
        if (error) throw error;
        // La ejecución se detendrá acá porque el navegador viaja a Google
    } catch (err: any) {
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

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (view === 'signup') {
            if (!validateName(fullName)) {
                setError('Ingresá un nombre válido (letras y espacios únicamente).');
                return;
            }
            if (!validatePassword(password)) {
                setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial.');
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
            const { error } = await supabase.auth.resetPasswordForEmail(email);
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
        if (!validatePassword(password)) {
            setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            // Para prevenir un loop o rebote al dashboard con token inválido,
            // forzamos el deslogueo. Esto obligará al usuario a ingresar de nuevo
            // de forma totalmente limpia, rotando de forma segura su estado.
            await supabase.auth.signOut();
            onSuccess();
        } catch (err: any) {
            setError(translateAuthError(err.message));
        } finally {
            setLoading(false);
        }
    };

    const toggleView = () => {
        setView(prev => prev === 'login' ? 'signup' : 'login');
        setError(null);
    };

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