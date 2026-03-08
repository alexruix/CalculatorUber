/**
 * Auth Screen Copy & Content
 * Centralized text content for authentication flows
 * 
 * Benefits:
 * - Easy i18n integration in the future
 * - Single source of truth for copy changes
 * - Separates content from logic/presentation
 */

export const authCopy = {
  // Brand
  brand: {
    name: 'MANEJATE',
    tagline: 'Tu radar de rentabilidad',
  },

  // View Titles & Descriptions
  views: {
    login: {
      title: 'Bienvenido',
      subtitle: 'Ingresá a tu cuenta',
      description: 'Tu radar de rentabilidad',
    },
    signup: {
      title: 'Unite',
      subtitle: 'Creá tu cuenta',
      description: 'Unite a la comunidad',
    },
    forgotPassword: {
      title: 'Recuperar Clave',
      subtitle: 'Restablecé tu contraseña',
      description: 'Ingresá el correo con el que te registraste y te enviaremos un link.',
    },
    resetPassword: {
      title: 'Nueva Clave',
      subtitle: 'Actualizá tu contraseña',
      description: 'Elegí una contraseña segura',
    },
    checkEmail: {
      title: '¡Casi listo!',
      subtitle: 'Verificá tu correo',
      description: 'Enviamos un enlace de confirmación a',
      instruction: 'Verificá tu casilla para activar tu cuenta.',
    },
  },

  // Form Labels & Placeholders
  form: {
    email: {
      label: 'Email',
      placeholder: 'tu@email.com',
    },
    password: {
      label: 'Contraseña',
      placeholder: 'Mínimo 6 caracteres',
    },
    confirmPassword: {
      label: 'Confirmar Contraseña',
      placeholder: 'Repetí tu contraseña',
    },
  },

  // Buttons & Actions
  actions: {
    login: 'Ingresar a mi cuenta',
    signup: 'Crear mi cuenta',
    continueWithGoogle: 'Continuar con Google',
    sendResetLink: 'Enviar link',
    updatePassword: 'Actualizar clave',
    backToLogin: 'Volver al login',
    backToLoginShort: 'Volver al ingreso',
    forgotPassword: '¿Olvidaste tu contraseña?',
    toggleToSignup: '¿No tenés cuenta? Registrate',
    toggleToLogin: '¿Ya tenés cuenta? Iniciá sesión',
  },

  // Loading States
  loading: {
    processing: 'Procesando...',
    sending: 'Enviando...',
    authenticating: 'Autenticando...',
  },

  // Divider
  divider: {
    text: 'o usá tu email',
  },

  // System Messages
  system: {
    demoMode: 'Modo Demo Local (Sin BD)',
    offlineMode: 'Trabajando sin conexión',
  },
} as const;

// Error Messages (can be extended for i18n)
export const authErrors = {
  invalidEmail: 'Correo electrónico inválido',
  passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
  passwordMismatch: 'Las contraseñas no coinciden',
  emailAlreadyExists: 'Este email ya está registrado',
  invalidCredentials: 'Credenciales incorrectas',
  userNotFound: 'Usuario no encontrado',
  networkError: 'Error de conexión. Verificá tu internet.',
  unknownError: 'Ocurrió un error inesperado. Intentá de nuevo.',
} as const;