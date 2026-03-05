import React, { type ReactElement, type ReactNode } from 'react';
import { AlertCircle } from '../../../lib/icons';

interface FieldProps {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    icon?: React.ElementType;
    suffix?: string;
    children: ReactElement; // Expects an Input atom or raw <input>
}

export const Field: React.FC<FieldProps> = ({
    id,
    label,
    hint,
    error,
    required,
    icon: Icon,
    suffix,
    children
}) => {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    // Clonar el input para pasarle los ref y aria attrs
    const inputEl = children as ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;

    return (
        <div className="field-wrapper">
            <label htmlFor={id} className="label-base ml-1">
                {label}
                {required && (
                    <span className="text-sky-500 ml-1" aria-hidden="true">*</span>
                )}
            </label>

            <div className="field-input-wrapper">
                {Icon && (
                    <Icon className="field-icon-left z-10" aria-hidden="true" />
                )}

                {React.cloneElement(inputEl, {
                    id,
                    'aria-required': required ? 'true' : undefined,
                    'aria-invalid': error ? 'true' : 'false',
                    'aria-describedby': [error ? errorId : null, hint ? hintId : null]
                        .filter(Boolean)
                        .join(' ') || undefined,
                    className: [
                        inputEl.props.className, // Keep existing classes (Input atom classes)
                        Icon ? 'pl-12' : '',
                        suffix ? 'pr-16' : '',
                        error ? 'input-error' : '',
                    ]
                        .filter(Boolean)
                        .join(' '),
                })}

                {suffix && (
                    <span className="field-suffix" aria-hidden="true">
                        {suffix}
                    </span>
                )}
            </div>

            {hint && !error && (
                <p id={hintId} className="label-hint ml-1">
                    {hint}
                </p>
            )}

            {error && (
                <p id={errorId} role="alert" className="feedback-error ml-1 mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
};
