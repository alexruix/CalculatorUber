/**
 * utils.ts — Utilidades compartidas
 * Función `cn` para combinar clases de Tailwind de forma segura.
 * Evita instalar clsx/tailwind-merge para mantener el bundle liviano.
 */

/**
 * Combina múltiples strings de clases CSS filtrando falsy values.
 * Uso: cn('base-class', condition && 'conditional-class', className)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Calcula el rango de tiempo (Inicio - Fin) basado en startTime y duración.
 */
export const calculateTimeRange = (startTime: string | undefined, durationMins: number) => {
    if (!startTime || !startTime.includes(':')) return null;
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMins;
    
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    
    const f = (n: number) => n.toString().padStart(2, '0');
    return `${startTime} — ${f(endHours)}:${f(endMins)}`;
};