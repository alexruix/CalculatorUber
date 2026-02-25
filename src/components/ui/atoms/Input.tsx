import React, { type InputHTMLAttributes, forwardRef } from 'react';

export type InputState = 'default' | 'focus' | 'error' | 'success';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    state?: InputState;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', state = 'default', ...props }, ref) => {
        let stateClass = 'input-base input-focus'; // By default, it has base + focus interactions
        if (state === 'error') stateClass = 'input-base input-error';
        if (state === 'success') stateClass = 'input-base input-success';

        return (
            <input
                ref={ref}
                className={`${stateClass} ${className}`}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
