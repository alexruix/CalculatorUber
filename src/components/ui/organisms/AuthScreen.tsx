import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { Car, ChevronRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useProfileStore } from '../../../store/useProfileStore';

interface AuthScreenProps {
    onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseConfigured()) {
            // Si no hay variables de entorno, simulamos el ingreso para dev/demo
            setError(null);
            useProfileStore.getState().setProfile({ isConfigured: true }); // Mock config
            onSuccess();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // Dependiendo de la config de Supabase, puede requerir confirmación por mail
                alert('Revisa tu correo para confirmar tu cuenta');
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error en la autenticación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-12 animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-nodo-wine/20 rounded-3xl flex items-center justify-center mb-8 border border-nodo-wine/30">
                <Car className="w-10 h-10 text-nodo-wine" />
            </div>

            <div className="text-center mb-10 w-full max-w-sm">
                <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Manejate</h1>
                <p className="text-sm font-medium text-white/50 leading-relaxed px-4">
                    Tu radar de rentabilidad. Ingresá para guardar todo en la nube.
                </p>
            </div>

            <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
                <div className="space-y-3">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            required
                            className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            required
                            minLength={6}
                            className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-medium">{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full h-14 gap-2 shadow-[0_0_30px_rgba(233,69,96,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                >
                    {loading ? 'Cargando...' : isLogin ? 'Ingresar a mi cuenta' : 'Crear mi cuenta'}
                    {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-8 text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
            >
                {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
            </button>

            {!isSupabaseConfigured() && (
                <div className="mt-8 text-[10px] text-amber-500/50 uppercase tracking-widest font-black text-center">
                    Modo Demo Local (Sin BD)
                </div>
            )}
        </div>
    );
};
