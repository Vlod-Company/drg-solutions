import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "danger" | "warning" | "info";
    className?: string;
}

export function Badge({
    children,
    variant = "default",
    className = "",
}: BadgeProps) {
    const variantClasses = {
        default: "bg-[#30363D] text-[#C9D1D9]",
        success: "bg-[#56C271] text-white",
        danger: "bg-[#D32F2F] text-white",
        warning: "bg-[#FF6B35] text-white",
        info: "bg-[#4FC3F7] text-white",
    };

    return (
        <span
            className={`inline-block px-2 py-1 rounded text-xs ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
