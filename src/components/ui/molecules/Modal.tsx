/**
 * Modal.tsx - Unified Molecule
 * ─────────────────────────────────────────────────────────────
 * Centralized modal component using Ark UI Dialog for accessibility.
 * Manages backdrops, animations, and container styles for the whole app.
 * 
 * @molecule
 */

import React from 'react';
import { Dialog } from '@ark-ui/react/dialog';
import { Portal } from '@ark-ui/react/portal';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type ModalVariant = 'primary' | 'warning' | 'error' | 'secondary';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    variant?: ModalVariant;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const variantStyles: Record<ModalVariant, string> = {
    primary: 'border-primary/30 shadow-[0_0_40px_var(--color-primary-glow)]',
    warning: 'border-warning/30 shadow-[0_0_40px_var(--color-warning-glow)]',
    error: 'border-error/30 shadow-[0_0_40px_var(--color-error-glow)]',
    secondary: 'border-secondary/30 shadow-[0_0_40px_var(--color-secondary-glow)]',
};

const iconColors: Record<ModalVariant, string> = {
    primary: 'text-primary',
    warning: 'text-warning',
    error: 'text-error',
    secondary: 'text-secondary',
};

const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    icon,
    children,
    footer,
    variant = 'primary',
    maxWidth = 'lg',
}) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()} trapFocus>
            <Portal>
                <Dialog.Backdrop className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm animate-fade-in" />
                
                <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4 pointer-events-none">
                    <Dialog.Positioner className="w-full flex justify-center">
                        <Dialog.Content
                            className={cn(
                                'w-full pointer-events-auto',
                                maxWidthStyles[maxWidth],
                                'bg-[#1A1A1A] border-2',
                                'rounded-3xl sm:rounded-2xl',
                                'p-6 sm:p-8',
                                'animate-zoom-in animate-slide-in-top',
                                variantStyles[variant]
                            )}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <Dialog.Title className="text-xl font-extrabold text-starlight mb-0 flex items-center gap-3">
                                    {icon && <span className={iconColors[variant]}>{icon}</span>}
                                    {title}
                                </Dialog.Title>
                                
                                <Dialog.CloseTrigger 
                                    onClick={onClose}
                                    className="p-2 rounded-lg text-moon hover:text-starlight hover:bg-white/10 transition-colors cursor-pointer"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="w-6 h-6" />
                                </Dialog.CloseTrigger>
                            </div>

                            {/* Body */}
                            <div className="relative">
                                {children}
                            </div>

                            {/* Footer */}
                            {footer && (
                                <div className="mt-8 pt-2">
                                    {footer}
                                </div>
                            )}
                        </Dialog.Content>
                    </Dialog.Positioner>
                </div>
            </Portal>
        </Dialog.Root>
    );
};

Modal.displayName = 'Modal';
