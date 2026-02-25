import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    label: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({
    enabled,
    onToggle,
    label,
    description,
    icon,
    className = '',
    ...props
}) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onToggle(!enabled)}
            className={`${enabled ? 'toggle-row-on' : 'toggle-row-off'} ${className}`}
            {...props}
        >
            <div className="flex items-center gap-4 text-left">
                {icon && icon}
                <div>
                    <p className={enabled ? 'toggle-label-on' : 'toggle-label-off'}>{label}</p>
                    {description && (
                        <p className={enabled ? 'toggle-desc-on' : 'toggle-desc-off'}>{description}</p>
                    )}
                </div>
            </div>
            <div className={enabled ? 'toggle-indicator-on' : 'toggle-indicator-off'} aria-hidden="true" />
        </button>
    );
};
