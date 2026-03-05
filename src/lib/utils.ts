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
