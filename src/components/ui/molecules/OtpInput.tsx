import React, { useRef, useState } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '../../../lib/utils';

export interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
    length = 6,
    value,
    onChange,
    error = false,
    disabled = false,
}) => {
    const [activeInput, setActiveInput] = useState<number>(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const updateCodeAt = (index: number, val: string) => {
        const chars = value.split('').slice(0, length);
        chars[index] = val;
        // Pad with empty strings if array is too small
        while (chars.length < length) chars.push('');

        onChange(chars.join('').substring(0, length));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value.trim();
        
        // Handle auto-fill or multi-digit paste
        if (val.length > 1) {
            const digits = val.match(/\d/g)?.join('').slice(0, length) || '';
            if (digits) {
                onChange(digits);
                const focusIndex = Math.min(digits.length, length - 1);
                setActiveInput(focusIndex);
                inputRefs.current[focusIndex]?.focus();
            }
            return;
        }

        const lastChar = val.slice(-1);
        if (lastChar && !/^\d$/.test(lastChar)) return; // Only allow digits

        if (lastChar !== '') {
            updateCodeAt(index, lastChar);
            focusNext(index);
        } else {
            updateCodeAt(index, '');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            // If the field is already empty, go back and clear the previous one
            const chars = value.padEnd(length, ' ').split('');
            if (chars[index] === ' ' || chars[index] === '') {
                if (index > 0) {
                    updateCodeAt(index - 1, '');
                    focusPrev(index);
                }
            } else {
                updateCodeAt(index, '');
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusPrev(index);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusNext(index);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        const matches = pastedData.match(/\d/g);

        if (matches) {
            const digits = matches.join('').slice(0, length);
            onChange(digits);
            // Focus the first empty box or the last box
            const focusIndex = Math.min(digits.length, length - 1);
            setActiveInput(focusIndex);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const focusNext = (index: number) => {
        if (index < length - 1) {
            setActiveInput(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const focusPrev = (index: number) => {
        if (index > 0) {
            setActiveInput(index - 1);
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Make sure we have enough character slots based on the length
    const displayValue = value.padEnd(length, ' ').split('').slice(0, length);

    return (
        <div
            className="flex justify-between items-center w-full gap-2"
            onPaste={handlePaste}
        >
            {displayValue.map((char, index) => {
                const isActive = activeInput === index;
                const hasValue = char !== ' ';

                return (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        name="otp"
                        autoComplete="one-time-code"
                        maxLength={2} // Allows catching quick keystrokes
                        value={char === ' ' ? '' : char}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={() => setActiveInput(index)}
                        disabled={disabled}
                        className={cn(
                            "w-12 h-14 md:w-14 md:h-16 rounded-2xl bg-white/5 border border-white/10 text-center text-2xl font-bold font-mono text-starlight transition-all duration-300 outline-none",
                            "focus:border-primary focus:shadow-[0_0_15px_var(--color-primary-glow)] focus:bg-primary/5 focus:text-white",
                            isActive && !hasValue && "animate-pulse border-white/20",
                            hasValue && "border-primary/50 text-white",
                            error && "border-error text-error focus:border-error focus:shadow-[0_0_15px_rgba(255,87,87,0.3)] bg-error/5 focus:bg-error/10 animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]",
                            disabled && "opacity-50 cursor-not-allowed bg-white/5 border-white/5"
                        )}
                        aria-label={`Dígito ${index + 1}`}
                    />
                );
            })}
        </div>
    );
};
