/**
 * Field.tsx - Refactored Molecule
 * Form field wrapper with label, hint, error states
 * 
 * Uses design tokens from global.css
 * Integrates with refactored Input and Label atoms
 */

import React, { type ReactElement } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Label } from '../atoms/Label';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  icon?: React.ElementType;
  suffix?: string;
  children: ReactElement; // Expects an Input atom or raw <input>
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  id,
  label,
  hint,
  error,
  required,
  icon: Icon,
  suffix,
  children,
  className,
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Clone the input to inject props
  const inputEl = children as ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label 
        htmlFor={id}
        variant={error ? 'default' : 'muted'}
        size="sm"
        uppercase
        required={required}
      >
        {label}
      </Label>

      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <Icon 
              className={cn(
                'w-5 h-5 transition-colors duration-300',
                error ? 'text-error' : 'text-moon'
              )}
              aria-hidden="true" 
            />
          </div>
        )}

        {/* Input Element (cloned with enhanced props) */}
        {React.cloneElement(inputEl, {
          id,
          'aria-required': required ? 'true' : undefined,
          'aria-invalid': error ? 'true' : 'false',
          'aria-describedby': [
            error ? errorId : null, 
            hint ? hintId : null
          ]
            .filter(Boolean)
            .join(' ') || undefined,
          className: cn(
            // Preserve existing Input atom classes
            inputEl.props.className,
            // Icon padding
            Icon && 'pl-12',
            // Suffix padding
            suffix && 'pr-16',
            // Error state (if not using Input atom variant)
            error && 'border-error bg-error/5'
          ),
        })}

        {/* Right Suffix (e.g., "km/L", "XP") */}
        {suffix && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span 
              className="text-xs font-extrabold text-primary uppercase tracking-widest"
              aria-hidden="true"
            >
              {suffix}
            </span>
          </div>
        )}
      </div>

      {/* Hint Text (only shown when no error) */}
      {hint && !error && (
        <p 
          id={hintId} 
          className="text-xs text-moon font-medium ml-1"
        >
          {hint}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div
          id={errorId}
          role="alert"
          className={cn(
            'flex items-center gap-2',
            'px-3 py-2 rounded-lg',
            'bg-error/10 border-2 border-error/30',
            'text-sm font-semibold text-error',
            'animate-slide-in-top'
          )}
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

Field.displayName = 'Field';