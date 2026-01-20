import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "../types";

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
    admin: {
        password: "admin123",
        user: {
            id: "1",
            username: "admin",
            name: "Главный администратор",
            role: "ROLE_ADMIN",
            department: "Управление",
        },
    },
    management: {
        password: "mgmt123",
        user: {
            id: "2",
            username: "management",
            name: "Менеджер Иванов",
            role: "ROLE_MANAGEMENT_EMPLOYEE",
            department: "Менеджмент",
        },
    },
    mission: {
        password: "mission123",
        user: {
            id: "3",
            username: "mission",
            name: "Контроллер Петров",
            role: "ROLE_MISSION_CONTROL_EMPLOYEE",
            department: "Центр управления миссиями",
        },
    },
    scancom: {
        password: "scan123",
        user: {
            id: "4",
            username: "scancom",
            name: "Разведчик Сидоров",
            role: "ROLE_SCANCOM_EMPLOYEE",
            department: "ScanCom",
        },
    },
    rnd: {
        password: "rnd123",
        user: {
            id: "5",
            username: "rnd",
            name: "Инженер Козлов",
            role: "ROLE_RND_EMPLOYEE",
            department: "R&D",
        },
    },
    science: {
        password: "science123",
        user: {
            id: "6",
            username: "science",
            name: "Ученый Волков",
            role: "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE",
            department: "Научный отдел",
        },
    },
    launch: {
        password: "launch123",
        user: {
            id: "7",
            username: "launch",
            name: "Логист Морозов",
            role: "ROLE_LAUNCH_CONTROL_EMPLOYEE",
            department: "Контроль запусков",
        },
    },
    maintenance: {
        password: "maint123",
        user: {
            id: "8",
            username: "maintenance",
            name: "Техник Новиков",
            role: "ROLE_MAINTENANCE_EMPLOYEE",
            department: "Обслуживание",
        },
    },
    miner: {
        password: "miner123",
        user: {
            id: "9",
            username: "miner",
            name: "Шахтер Соколов",
            role: "ROLE_MINER_EMPLOYEE",
            department: "Шахтеры",
        },
    },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check for stored auth token
        const token = localStorage.getItem("drg_token");
        const storedUser = localStorage.getItem("drg_user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (
        username: string,
        password: string,
    ): Promise<boolean> => {
        const mockUser = mockUsers[username];
        if (mockUser && mockUser.password === password) {
            const token = `mock_jwt_${Date.now()}`;
            localStorage.setItem("drg_token", token);
            localStorage.setItem("drg_user", JSON.stringify(mockUser.user));
            setUser(mockUser.user);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem("drg_token");
        localStorage.removeItem("drg_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
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
