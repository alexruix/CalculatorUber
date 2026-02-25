import React, { type HTMLAttributes } from 'react';

export type IconWrapSize = 'sm' | 'md' | 'lg';
export type IconWrapTheme = 'accent' | 'success' | 'warning' | 'error' | 'neutral';

interface IconWrapProps extends HTMLAttributes<HTMLDivElement> {
    size?: IconWrapSize;
    theme?: IconWrapTheme;
}

export const IconWrap: React.FC<IconWrapProps> = ({
    children,
    size = 'md',
    theme = 'neutral',
    className = '',
    ...props
}) => {
    return (
        <div
            className={`icon-wrap-${size} icon-wrap-${theme} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
