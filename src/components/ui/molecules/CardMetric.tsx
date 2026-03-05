//
import React, { type HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface CardMetricProps extends HTMLAttributes<HTMLDivElement> {
    label?: string;
    value?: string | number;
    subValue?: string | number;
    status?: 'positive' | 'negative' | 'neutral' | 'info' | 'fare' | 'warning';
    icon?: LucideIcon;
    flat?: boolean;
}

export const CardMetric: React.FC<CardMetricProps> = ({
    label,
    value,
    subValue,
    status = 'neutral',
    icon: Icon,
    flat = false,
    className = '',
    ...props
}) => {
    const baseClass = flat ? 'card-metric-flat' : 'card-metric';
    const valueClassMap = {
        positive: 'trip-value-positive',
        negative: 'trip-value-negative',
        neutral: 'text-white',
        info: 'text-info',
        fare: 'trip-value-fare',
        warning: 'text-warning'
    };

    return (
        <div className={`${baseClass} ${className}`} {...props}>
            <div className="flex items-start justify-between mb-1">
                {label && (
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                        {label}
                    </p>
                )}
                {Icon && <Icon className="w-3 h-3 text-white/20" />}
            </div>
            
            {value !== undefined && (
                <p className={`text-xl font-black ${valueClassMap[status]} leading-tight`}>
                    {value}
                </p>
            )}
            
            {subValue && (
                <p className="text-[10px] text-white/30 font-bold uppercase mt-1">
                    {subValue}
                </p>
            )}
        </div>
    );
};