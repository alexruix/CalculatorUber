// /**
//  * FloatingActionButton.tsx — FAB con Long Press
//  * ─────────────────────────────────────────────────────────────
//  * Tap  → acción normal
//  * Long press (800ms) → abre DateOverrideModal (retroactivo -7 días)
//  * Feedback visual durante long press: fill radial animado.
//  *
//  * @atom
//  */
// import React, { useState } from 'react';
// import { cn } from '../../../lib/utils';
// import { Plus } from '../../../lib/icons';
// import { useLongPress } from '../../../hooks/useLongPress';

// interface FloatingActionButtonProps {
//     onTap: () => void;
//     onLongPress: () => void;
//     disabled?: boolean;
//     className?: string;
//     'aria-label'?: string;
// }

// export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
//     onTap,
//     onLongPress,
//     disabled = false,
//     className,
//     'aria-label': ariaLabel,
// }) => {
//     const [isPressing, setIsPressing] = useState(false);

//     // Inicializamos el hook (delay de 800ms)
//     const longPressHandlers = useLongPress(
//         () => {
//             setIsPressing(false); // Apagamos la animación al completarse el tiempo
//             onLongPress();
//         },
//         onTap,
//         { delay: 800 }
//     );

//     // Handlers Interceptores (blindados contra 'disabled')
//     const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
//         if (disabled) return;
//         setIsPressing(true);
//         if ('touches' in e) {
//             longPressHandlers.onTouchStart(e as React.TouchEvent);
//         } else {
//             longPressHandlers.onMouseDown(e as React.MouseEvent);
//         }
//     };

//     const handleCancel = () => {
//         setIsPressing(false);
//         // El hook useLongPress usa una función `cancel` que no requiere eventos
//         longPressHandlers.onMouseLeave();
//         longPressHandlers.onTouchEnd();
//     };

//     const handleMouseUp = () => {
//         setIsPressing(false);
//         longPressHandlers.onMouseUp();
//     };

//     return (
//         <button
//             type="button"
//             disabled={disabled}
//             aria-label={ariaLabel ?? 'Agregar viaje'}
//             onClick={longPressHandlers.onClick}
//             onMouseDown={handleStart}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleCancel}
//             onTouchStart={handleStart}
//             onTouchEnd={handleCancel}
//             className={cn(
//                 // Base
//                 'relative w-16 h-16 rounded-full',
//                 'flex items-center justify-center',
//                 'transition-all duration-200',
//                 // Color
//                 'bg-primary text-black',
//                 'shadow-[0_4px_24px_var(--color-primary-glow)]',
//                 // Hover
//                 'hover:scale-110 hover:shadow-[0_6px_32px_var(--color-primary-glow)]',
//                 // Active
//                 'active:scale-95',
//                 // Disabled
//                 'disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none',
//                 // Long press feedback
//                 isPressing && 'scale-105 shadow-[0_0_40px_var(--color-primary-glow)]',
//                 className
//             )}
//         >
//             {/* Ícono */}
//             <Plus className="w-8 h-8 font-black" strokeWidth={3} />

//             {/* Indicador de long press: ring que se expande */}
//             {isPressing && (
//                 <span
//                     className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-50 pointer-events-none"
//                     aria-hidden="true"
//                 />
//             )}
//         </button>
//     );
// };

// FloatingActionButton.displayName = 'FloatingActionButton';