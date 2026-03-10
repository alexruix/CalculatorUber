import React, { useState } from 'react';
import { Label } from '../atoms/Label';
import { Input, type InputProps } from '../atoms/Input';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps extends InputProps {
    label: string;
    id: string;
    error?: string;
    isPassword?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, id, error, className, type, isPassword, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;
        return (
            <div className={`flex flex-col gap-2 ${className || ''}`}>
                <Label htmlFor={id} variant={error ? 'primary' : 'default'} className={error ? 'text-error' : ''}>
                    {label}
                </Label>
                <div className="relative">
                    <Input
                        id={id}
                        ref={ref}
                        type={resolvedType}
                        variant={error ? 'error' : 'default'}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className={isPassword ? 'pr-12' : ''}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowPassword(prev => !prev);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/20 hover:text-white transition-colors focus:outline-none z-10"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    )}
                </div>
                {error && (
                    <p id={`${id}-error`} className="text-xs text-error mt-1" role="alert">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = 'FormField';
