import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AlertCircle } from "lucide-react";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const success = await login(username, password);
        if (!success) {
            setError("Неверное имя пользователя или пароль");
        } else {
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B35] rounded-lg mb-4">
                        <span className="text-white text-2xl font-bold">
                            DRG
                        </span>
                    </div>
                    <h1 className="text-[#C9D1D9] text-2xl mb-2">
                        Deep Rock Galactic
                    </h1>
                    <p className="text-[#8B949E]">
                        Corporation Management System
                    </p>
                </div>

                {/* Login form */}
                <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
                    <h2 className="text-[#C9D1D9] mb-6">Вход в систему</h2>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Имя пользователя"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите логин"
                            required
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Введите пароль"
                            required
                        />

                        {error && (
                            <div className="mb-4 p-3 bg-[#D32F2F] bg-opacity-10 border border-[#D32F2F] rounded flex items-center gap-2">
                                <AlertCircle
                                    size={18}
                                    className="text-[#D32F2F]"
                                />
                                <span className="text-[#D32F2F] text-sm">
                                    {error}
                                </span>
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            Войти
                        </Button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-[#0D1117] border border-[#30363D] rounded">
                        <p className="text-[#8B949E] text-xs mb-2">
                            Демо-аккаунты:
                        </p>
                        <div className="text-[#8B949E] text-xs space-y-1">
                            <div>admin / admin123 (Администратор)</div>
                            <div>management / mgmt123 (Менеджмент)</div>
                            <div>mission / mission123 (Центр миссий)</div>
                            <div>maintenance / maint123 (Обслуживание)</div>
                            <div>miner / miner123 (Шахтер)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
