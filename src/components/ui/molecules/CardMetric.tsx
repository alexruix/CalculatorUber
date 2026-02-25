import React, { type HTMLAttributes } from 'react';

interface CardMetricProps extends HTMLAttributes<HTMLDivElement> {
    interactive?: boolean;
    flat?: boolean;
}

export const CardMetric: React.FC<CardMetricProps> = ({
    children,
    interactive = false,
    flat = false,
    className = '',
    ...props
}) => {
    let baseClass = 'card-metric';
    if (interactive) baseClass = 'card-metric-interactive';
    if (flat) baseClass = 'card-metric-flat';

    return (
        <div className={`${baseClass} ${className}`} {...props}>
            {children}
        </div>
    );
};
