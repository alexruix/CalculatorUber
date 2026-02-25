import React, { type ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    isLoading,
    disabled,
    ...props
}) => {
    const baseClass = variant === 'icon' ? 'btn-icon' : `btn-${variant}`;

    return (
        <button
            className={`${baseClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <span className="opacity-50 tracking-widest text-xs">Cargando...</span> : children}
        </button>
    );
};
