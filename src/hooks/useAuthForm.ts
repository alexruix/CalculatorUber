import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfileStore } from '../store/useProfileStore';
import { translateAuthError } from '../constants/auth-errors';

export type AuthView = 'login' | 'signup' | 'check-email';

export const useAuthForm = (onSuccess: () => void) => {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
                
                // Aseguramos que la sesión se persista antes de llamar onSuccess
                if (data.session) {
                    onSuccess();
                }
            } else {
                const { error, data } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                
                // Si Supabase no devolvió sesión, es porque requiere confirmación de mail
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
        loading,
        error,
        handleAuth,
        toggleView,
        showPassword,
        setShowPassword
    };
};
