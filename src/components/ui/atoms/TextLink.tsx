import React from 'react';
import { cn } from '../../../lib/utils';

interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
}

export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
    ({ href, children, className, ...props }, ref) => {
        return (
            <a
                ref={ref}
                href={href}
                className={cn(
                    "text-primary font-bold transition-all duration-300",
                    "hover:text-primary-glow hover:drop-shadow-[0_0_8px_var(--color-primary-glow)]",
                    "underline-offset-4 hover:underline",
                    className
                )}
                {...props}
            >
                {children}
            </a>
        );
    }
);

TextLink.displayName = 'TextLink';
