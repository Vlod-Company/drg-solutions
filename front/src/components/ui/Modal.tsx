import React from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
}: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-75"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#30363D]">
                    <h2 className="text-[#C9D1D9]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}
