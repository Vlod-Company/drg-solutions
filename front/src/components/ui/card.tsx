import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
    return (
        <div
            className={`bg-[#161B22] border border-[#30363D] rounded-lg p-4 ${onClick ? "cursor-pointer hover:border-[#FF6B35] transition-colors" : ""} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`mb-3 ${className}`}>{children}</div>;
}

export function CardTitle({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <h3 className={`text-[#C9D1D9] ${className}`}>{children}</h3>;
}

export function CardContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`text-[#8B949E] ${className}`}>{children}</div>;
}
