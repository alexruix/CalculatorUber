/**
 * Diccionario de traducción para errores de Supabase Auth (GoTrue).
 * Mapea los mensajes de error en inglés a mensajes amigables en español.
 */
export const AUTH_ERRORS: Record<string, string> = {
    "Invalid login credentials": "Correo o contraseña incorrectos.",
    "User not found": "Correo o contraseña incorrectos.", // Anti-enumeración
    "User already registered": "Ya sos parte del club. Probá iniciando sesión.",
    "Email not confirmed": "Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.",
    "Signup is disabled": "El registro de nuevos usuarios está deshabilitado temporalmente.",
    "Password should be at least 8 characters": "La contraseña debe tener al menos 8 caracteres.",
    "Invalid email format": "El formato del correo electrónico no es válido.",
    "Rate limit exceeded": "Demasiados intentos. Por favor, espera un minuto antes de volver a intentarlo.",
    "Email link is invalid or has expired": "El código es inválido o ha expirado.",
    "Database error saving new user": "Error técnico al guardar el usuario. Reintenta en unos instantes.",
    "Failed to fetch": "Sin conexión. Revisá tu señal e intentá de nuevo.", // Error de red\
};

/**
 * Función helper para traducir errores dinámicamente.
 * Si el error no está en el diccionario, se devuelve un mensaje genérico o el original.
 */
export const translateAuthError = (errorMessage: string): string => {
    // Buscamos coincidencia parcial o total
    for (const [key, value] of Object.entries(AUTH_ERRORS)) {
        if (errorMessage.includes(key)) return value;
    }
    return "Ocurrió un error inesperado en la autenticación.";
};
