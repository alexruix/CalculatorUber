import React, { type HTMLAttributes, type ReactNode } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDetailsElement> {
    summary: ReactNode;
    open?: boolean;
    onToggle?: (e: React.SyntheticEvent<HTMLDetailsElement>) => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    summary,
    open,
    onToggle,
    className = '',
    ...props
}) => {
    return (
        <details
            className={`glass-card rounded-2xl overflow-hidden ${className}`}
            open={open}
            onToggle={onToggle}
            {...props}
        >
            <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-white/5 transition-colors group">
                {summary}
            </summary>
            <div className="px-5 pb-4 pt-2 border-t border-white/10 space-y-4">
                {children}
            </div>
        </details>
    );
};
