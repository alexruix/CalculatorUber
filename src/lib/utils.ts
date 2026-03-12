/**
 * lib/utils.ts
 * Versión Híbrida: Robustez + Lógica de Negocio Manejate
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 1. EL MOTOR DE UI (Necesario para el Design System Gaming)
// Requiere: npm install clsx tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. EL MOTOR FINANCIERO (Contexto Argentina)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// 3. TU LÓGICA DE NEGOCIO (Crítica para el "Cierre de Turno")
export const calculateTimeRange = (startTime: string | undefined, durationMins: number) => {
    if (!startTime || !startTime.includes(':')) return null;
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMins;
    
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    
    const f = (n: number) => n.toString().padStart(2, '0');
    return `${startTime} — ${f(endHours)}:${f(endMins)}`;
};

// 4. HELPERS DE RENDIMIENTO (BI)
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, (value / total) * 100); // Guardamos que no supere el 100%
}

export function generateId(): string {
  // Si no usás una librería como uuid, esto es liviano y funcional
  return Math.random().toString(36).substring(2, 10);
}

// 5. FORMATEADOR DE FECHAS (Contexto Latam/Argentina)
export function formatDateLatam(dateString: string, style: 'short' | 'long' | 'full' = 'long'): string {
  if (!dateString) return '';
  
  // 1. Evitar el bug de zona horaria desarmando el string manualmente
  // '2026-03-12' -> [2026, 3, 12]
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Nota: los meses en JS empiezan en 0 (Enero = 0)
  const localDate = new Date(year, month - 1, day);

  // 2. Formateador nativo para Argentina
  const options: Intl.DateTimeFormatOptions = { day: 'numeric' };
  
  if (style === 'short') options.month = 'short'; // "12 mar"
  if (style === 'long') options.month = 'long';   // "12 de marzo"
  if (style === 'full') {
      options.month = 'long';
      options.year = 'numeric'; // "12 de marzo de 2026"
  }

  return new Intl.DateTimeFormat('es-AR', options).format(localDate);
}