import { useState, useEffect } from 'react';
import type { SavedTrip } from '../types/calculator.types';

/**
 * Hook para manejar la persistencia de viajes en localStorage
 * 
 * @param key - Clave de localStorage donde se guardarán los datos
 * @param initialValue - Valor inicial si no hay datos guardados
 * @returns Tupla con [viajes, setViajes]
 * 
 * @example
 * const [trips, setTrips] = useSessionStorage('nodo_session_v1', []);
 */
export const useSessionStorage = (
  key: string, 
  initialValue: SavedTrip[]
): [SavedTrip[], React.Dispatch<React.SetStateAction<SavedTrip[]>>] => {
  
  // Estado inicializado desde localStorage
  const [value, setValue] = useState<SavedTrip[]>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading from localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Sincronización con localStorage en cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};