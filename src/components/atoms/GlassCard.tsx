import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * 디자인 컴포넌트: Glassmorphism 스타일
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ children, className = "" }, ref) => (
        <div ref={ref} className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl overflow-hidden ${className}`}>
            {children}
        </div>
    )
);
