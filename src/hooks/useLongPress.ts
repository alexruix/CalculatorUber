/**
 * useLongPress.ts
 * ─────────────────────────────────────────────────────────────
 * Hook para detectar Long Press (mantener presionado) en elementos
 * interactivos, con soporte para mouse y touch.
 *
 * Implementa "Latest Ref pattern" para evitar stale closures y
 * asegura la limpieza de memoria en el desmontaje (Unmount).
 */
import { useCallback, useEffect, useRef } from 'react';

interface UseLongPressOptions {
  /** Milisegundos de espera para activar long press (default: 800) */
  delay?: number;
  /** Si se debe prevenir el default en touch events */
  shouldPreventDefault?: boolean;
}

export const useLongPress = (
  onLongPress: () => void,
  onClick?: () => void,
  options: UseLongPressOptions = {}
) => {
  const { delay = 800, shouldPreventDefault = true } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  // 1. LATEST REF PATTERN: Evita stale closures sin disparar re-renders innecesarios
  const callbacksRef = useRef({ onLongPress, onClick });
  
  useEffect(() => {
    callbacksRef.current = { onLongPress, onClick };
  }, [onLongPress, onClick]);

  // 2. CANCELACIÓN CENTRALIZADA
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 3. HANDLER DE INICIO
  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      // Prevención segura para React 17+ (Eventos táctiles pasivos)
      if (shouldPreventDefault && 'touches' in event && event.cancelable) {
        event.preventDefault();
      }
      
      isLongPress.current = false;
      cancel(); // Limpiamos cualquier timer residual por seguridad

      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        callbacksRef.current.onLongPress();
      }, delay);
    },
    [delay, cancel, shouldPreventDefault] // Ya no dependemos de onLongPress
  );

  // 4. HANDLER DE CLICK SINTÉTICO
  const handleClick = useCallback(() => {
    cancel();
    if (!isLongPress.current && callbacksRef.current.onClick) {
      callbacksRef.current.onClick();
    }
  }, [cancel]);

  // 5. CLEANUP DE MEMORIA (CRÍTICO)
  // Si el componente que usa el FAB se desmonta, destruimos el timer.
  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
    onClick: handleClick,
  } as const;
};