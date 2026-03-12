/**
 * journey.ts — Lógica Centralizada de Jornadas
 * ─────────────────────────────────────────────────────────────
 * Maneja el concepto de "jornada comercial" que va desde las 04:00 AM
 * de un día hasta las 03:59 AM del día siguiente.
 *
 * Ejemplo de jornada "Martes 11 de Marzo":
 *   Martes 11 04:00 AM → Miércoles 12 03:59 AM
 */

import type { SavedTrip } from '../types/calculator.types';

/** Hora de corte para inicio de nueva jornada (04:00 AM) */
export const JOURNEY_CUTOFF_HOUR = 4;

/** Días máximos para date override retroactivo */
export const MAX_OVERRIDE_DAYS = 7;

/**
 * Determina a qué "jornada comercial" pertenece un timestamp.
 *
 * @param timestamp - Unix timestamp en milisegundos
 * @returns Fecha de jornada en formato "YYYY-MM-DD"
 *
 * @example
 * // Miércoles 02:00 → pertenece a jornada del Martes
 * getJourneyDate(new Date('2026-03-12T02:00:00').getTime()) // → "2026-03-11"
 *
 * // Miércoles 05:00 → pertenece a jornada del Miércoles
 * getJourneyDate(new Date('2026-03-12T05:00:00').getTime()) // → "2026-03-12"
 */
export const getJourneyDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hour = date.getHours();

    // Si es antes de las 04:00, pertenece al día anterior
    if (hour < JOURNEY_CUTOFF_HOUR) {
        date.setDate(date.getDate() - 1);
    }

    // Formato YYYY-MM-DD local (sin conversión UTC para evitar off-by-one)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Obtiene la jornada de "hoy" según la hora actual.
 */
export const getTodayJourneyDate = (): string => {
    return getJourneyDate(Date.now());
};

/**
 * Calcula un Unix timestamp preciso combinando una fecha y una hora.
 *
 * @param date - Fecha en formato "YYYY-MM-DD"
 * @param time - Hora en formato "HH:MM". Si está vacío, usa la hora actual.
 * @returns Unix timestamp en milisegundos
 */
export const calculateTimestamp = (date: string, time?: string): number => {
    if (!time) return Date.now();
    const isoString = `${date}T${time}:00`;
    const ts = new Date(isoString).getTime();
    // Fallback si el string es inválido
    return isNaN(ts) ? Date.now() : ts;
};

/**
 * Calcula el tiempo de espera entre el fin de un viaje anterior y el inicio del actual.
 * Robusto: usa timestamps absolutos, no strings de hora.
 *
 * @param prevTrip - Viaje anterior con timestamp y duration (en minutos)
 * @param currTimestamp - Timestamp de inicio del viaje actual
 * @returns Minutos de espera (mínimo 0)
 *
 * @example
 * // Viaje 1 termina a las 23:50. Viaje 2 empieza a la 01:00 (día siguiente)
 * calculateWaitMinutes(
 *   { timestamp: ..., duration: 20 },  // 23:30 + 20min = 23:50
 *   new Date('...01:00').getTime()      // 01:00 → 70min de espera ✅
 * )
 */
export const calculateWaitMinutes = (
    prevTrip: { timestamp: number; duration: number },
    currTimestamp: number
): number => {
    const prevEndMs = prevTrip.timestamp + prevTrip.duration * 60 * 1000;
    const waitMs = currTimestamp - prevEndMs;
    return Math.max(0, Math.round(waitMs / (60 * 1000)));
};

/**
 * Filtra un array de viajes por jornada comercial.
 *
 * @param trips - Array de viajes
 * @param journeyDate - Fecha de jornada en formato "YYYY-MM-DD"
 * @returns Viajes que pertenecen a la jornada indicada
 */
export const filterTripsByJourney = (
    trips: SavedTrip[],
    journeyDate: string
): SavedTrip[] => {
    return trips.filter((trip) => {
        // Priorizar campo `date` si existe, sino calcularlo del timestamp
        const tripDate = trip.date ?? getJourneyDate(trip.timestamp);
        return tripDate === journeyDate;
    });
};

/**
 * Verifica si una fecha es válida para date override.
 * Acepta fechas entre hoy -7 días y hoy (inclusive).
 *
 * @param dateString - Fecha en formato "YYYY-MM-DD"
 */
export const isValidOverrideDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date(getTodayJourneyDate());
    const maxPastDate = new Date(today);
    maxPastDate.setDate(today.getDate() - MAX_OVERRIDE_DAYS);

    return date >= maxPastDate && date <= today;
};

/**
 * Retorna la fecha mínima permitida para date override (hoy - 7 días).
 * En formato "YYYY-MM-DD" para uso en input[type=date].
 */
export const getMinOverrideDate = (): string => {
    const today = new Date(getTodayJourneyDate());
    today.setDate(today.getDate() - MAX_OVERRIDE_DAYS);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Retorna la fecha de hoy en formato "YYYY-MM-DD" para input[type=date].
 */
export const getTodayString = (): string => {
    return getTodayJourneyDate();
};
