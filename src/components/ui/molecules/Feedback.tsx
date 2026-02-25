import React, { type HTMLAttributes, type ElementType } from 'react';

export type FeedbackType = 'info' | 'success' | 'warning' | 'error';

interface FeedbackProps extends HTMLAttributes<HTMLParagraphElement> {
    type: FeedbackType;
    icon?: ElementType;
}

export const Feedback: React.FC<FeedbackProps> = ({
    children,
    type,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <p className={`feedback-${type} ${className}`} {...props}>
            {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />}
            <span>{children}</span>
        </p>
    );
};
