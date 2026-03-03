import {
  Car,
  ChevronRight,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Inbox,
  ArrowLeft,
} from "lucide-react";
import { useAuthForm } from "../../../hooks/useAuthForm";
import { isSupabaseConfigured } from "../../../lib/supabase";

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const {
    view,
    setView,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleAuth,
    handleGuestEntry,
    toggleView,
    showPassword,
    setShowPassword,
  } = useAuthForm(onSuccess);

  if (view === "check-email") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 py-12 animate-in fade-in zoom-in-95 duration-500 text-center">
        <div className="w-20 h-20 bg-sky-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-sky-500/30">
          <Inbox className="w-10 h-10 text-sky-400" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-4">
          ¡Casi listo!
        </h1>
        <p className="text-sm font-medium text-white/60 leading-relaxed mb-10 max-w-xs">
          Enviamos un enlace de confirmación a{" "}
          <b className="text-white">{email}</b>. Verificá tu casilla para
          activar tu cuenta.
        </p>
        <button
          onClick={() => setView("login")}
          className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-widest hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al ingreso
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-12 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-nodo-wine/20 rounded-3xl flex items-center justify-center mb-8 border border-nodo-wine/30">
        <Car className="w-10 h-10 text-nodo-wine" />
      </div>

      <div
        className={`text-center mb-10 w-full max-w-sm transition-all duration-500 ${loading ? "opacity-50 grayscale" : ""}`}
      >
        <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-3">
          Manejate
        </h1>
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
          {view === "login"
            ? "Tu radar de rentabilidad"
            : "Unite a la comunidad"}
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
              className="input-base input-focus pl-12 pr-4 text-sm"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              minLength={6}
              className="input-base input-focus pl-12 pr-12 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
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
          className="btn-primary w-full h-14 gap-2 shadow-[0_10px_40px_-10px_rgba(233,69,96,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Procesando...
            </span>
          ) : (
            <>
              {view === "login" ? "Ingresar a mi cuenta" : "Crear mi cuenta"}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleGuestEntry}
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-2 text-[11px] font-black text-white/50 uppercase tracking-[0.2em] hover:text-white transition-colors border border-white/10 rounded-xl hover:bg-white/5 active:scale-95 disabled:opacity-50"
        >
          Ingresar como invitado
        </button>

        <button
          onClick={toggleView}
          className="w-full text-[11px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-sky-400 transition-colors"
        >
          {view === "login"
            ? "¿No tenés cuenta? Registrate"
            : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </div>

      {!isSupabaseConfigured() && (
        <div className="mt-8 text-[10px] text-amber-500/50 uppercase tracking-widest font-black text-center">
          Modo Demo Local (Sin BD)
        </div>
      )}
    </div>
  );
};
