import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "../types";
import { AuthService } from "../api/services";

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            const tokenInfo = await AuthService.getMe();
            // Map TokenInfo to User
            const mappedUser: User = {
                id: tokenInfo.user_id?.toString() || "0",
                username: tokenInfo.username || "",
                name: tokenInfo.username || "Unknown", 
                roles: (tokenInfo.roles as Role[]) || ["ROLE_USER"],
                department: tokenInfo.department || "Unknown",
                employeeId: tokenInfo.employee_id,
            };
            setUser(mappedUser);
        } catch (error) {
            console.error("Failed to load user", error);
            localStorage.removeItem("token");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (
        username: string,
        password: string
    ): Promise<boolean> => {
        try {
            const response = await AuthService.login({ name: username, password });
            if (response.token) {
                localStorage.setItem("token", response.token);
                await loadUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
