import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: "button" | "submit" | "reset";
}

export function Button({
    variant = "primary",
    size = "md",
    children,
    className = "",
    ...props
}: ButtonProps) {
    const baseClasses =
        "inline-flex items-center justify-center rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-[#FF6B35] hover:bg-[#FF7A47] text-white",
        secondary:
            "bg-[#161B22] hover:bg-[#1F2428] text-[#C9D1D9] border border-[#30363D]",
        danger: "bg-[#D32F2F] hover:bg-[#E03E3E] text-white",
        success: "bg-[#56C271] hover:bg-[#67D082] text-white",
        ghost: "bg-transparent hover:bg-[#161B22] text-[#C9D1D9]",
    };

    const sizeClasses = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
