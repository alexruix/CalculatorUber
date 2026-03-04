import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';
import { translateAuthError } from '../constants/auth-errors';

export type AuthView = 'login' | 'signup' | 'check-email' | 'forgot-password' | 'reset-password';

export const useAuthForm = (onSuccess: () => void) => {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // --- NUEVA FUNCIÓN PARA GOOGLE ---
const handleGoogleLogin = async () => {
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
                // Redirige a la página actual
                redirectTo: window.location.origin
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

        if (view === 'signup' && password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
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
                const { error, data } = await supabase.auth.signUp({ email, password });
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
                redirectTo: window.location.origin, // Esto disparará el evento PASSWORD_RECOVERY
            });
            if (error) throw error;
            setView('check-email');
        } catch (err: any) {
            setError(translateAuthError(err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
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
            onSuccess(); // Listo, contraseña actualizada y sesión activa
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
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        error,
        handleAuth,
        handleGoogleLogin,
        handleResetPassword,
        handleUpdatePassword,
        toggleView,
        showPassword,
        setShowPassword
    };
};