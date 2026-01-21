import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    // Add explicitly if needed but normally extension handles it.
    // Given the lint errors, we'll make it explicit.
    name?: string;
    type?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-[#C9D1D9] mb-2 text-sm">
                    {label}
                </label>
            )}
            <input
                className={`w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors ${error ? "border-[#D32F2F]" : ""} ${className}`}
                {...props}
            />
            {error && <p className="text-[#D32F2F] text-sm mt-1">{error}</p>}
        </div>
    );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    name?: string;
}

export function Textarea({
    label,
    error,
    className = "",
    ...props
}: TextareaProps) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-[#C9D1D9] mb-2 text-sm">
                    {label}
                </label>
            )}
            <textarea
                className={`w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors min-h-[100px] ${error ? "border-[#D32F2F]" : ""} ${className}`}
                {...props}
            />
            {error && <p className="text-[#D32F2F] text-sm mt-1">{error}</p>}
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
    name?: string;
}

export function Select({
    label,
    error,
    options,
    className = "",
    ...props
}: SelectProps) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-[#C9D1D9] mb-2 text-sm">
                    {label}
                </label>
            )}
            <select
                className={`w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors ${error ? "border-[#D32F2F]" : ""} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-[#D32F2F] text-sm mt-1">{error}</p>}
        </div>
    );
}
