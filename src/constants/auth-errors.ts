/**
 * Diccionario de traducción para errores de Supabase Auth (GoTrue).
 * Mapea los mensajes de error en inglés a mensajes amigables en español.
 */
export const AUTH_ERRORS: Record<string, string> = {
    "Invalid login credentials": "El correo o la contraseña son incorrectos.",
    "User already registered": "Este correo ya está registrado.",
    "Email not confirmed": "Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.",
    "Signup is disabled": "El registro de nuevos usuarios está deshabilitado temporalmente.",
    "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
    "Invalid email format": "El formato del correo electrónico no es válido.",
    "Rate limit exceeded": "Demasiados intentos. Por favor, espera un minuto antes de volver a intentarlo.",
    "User not found": "No se encontró ningún usuario con este correo electrónico.",
    "Email link is invalid or has expired": "El enlace de confirmación es inválido o ha expirado.",
    "Database error saving new user": "Error técnico al guardar el usuario. Reintenta en unos instantes.",
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
