import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    FileText,
    Target,
    Building2,
    Globe,
    Users,
    BookOpen,
    User,
    LogOut,
    Bell,
    Menu,
    X,
    Shield,
} from "lucide-react";
import { Badge } from "./ui/Badge";

interface LayoutProps {
    children: React.ReactNode;
    currentPage?: string;
}

export function Layout({ children, currentPage }: LayoutProps) {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getNavigationItems = () => {
        const allItems = [
            { name: "Дашборд", icon: LayoutDashboard, path: "/dashboard" },
            {
                name: "Запросы",
                icon: FileText,
                path: "/requests",
                roles: [
                    "ROLE_ADMIN",
                    "ROLE_MANAGEMENT_EMPLOYEE",
                    "ROLE_MISSION_CONTROL_EMPLOYEE",
                    "ROLE_MAINTENANCE_EMPLOYEE",
                ],
            },
            {
                name: "Миссии",
                icon: Target,
                path: "/missions",
                roles: [
                    "ROLE_ADMIN",
                    "ROLE_MISSION_CONTROL_EMPLOYEE",
                    "ROLE_MINER_EMPLOYEE",
                    "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE",
                ],
            },
            {
                name: "Станции",
                icon: Building2,
                path: "/stations",
                roles: [
                    "ROLE_ADMIN",
                    "ROLE_MANAGEMENT_EMPLOYEE",
                    "ROLE_MAINTENANCE_EMPLOYEE",
                ],
            },
            {
                name: "Биомы",
                icon: Globe,
                path: "/biomes",
                roles: [
                    "ROLE_ADMIN",
                    "ROLE_SCANCOM_EMPLOYEE",
                    "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE",
                ],
            },
            {
                name: "Сотрудники",
                icon: Users,
                path: "/employees",
                roles: ["ROLE_ADMIN", "ROLE_MANAGEMENT_EMPLOYEE"],
            },
            {
                name: "Команды",
                icon: Shield,
                path: "/teams",
                roles: ["ROLE_ADMIN", "ROLE_MISSION_CONTROL_EMPLOYEE", "ROLE_MINER_EMPLOYEE"],
            },
            { name: "Глоссарий", icon: BookOpen, path: "/glossary" },
        ];

        return allItems.filter(
            (item) =>
                !item.roles ||
                item.roles.some((role) => user?.roles.includes(role as any)),
        );
    };



    return (
        <div className="min-h-screen bg-[#0D1117]">
            {/* Header */}
            <header className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-40">
                <div className="px-4 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden text-[#C9D1D9]"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                        >
                            {isMobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#FF6B35] rounded flex items-center justify-center">
                                <span className="text-white font-bold">
                                    DRG
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-[#C9D1D9] font-bold">
                                    Deep Rock Galactic
                                </div>
                                <div className="text-[#8B949E] text-xs">
                                    Corporation
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* User menu */}
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:block text-right">
                                <div className="text-[#C9D1D9] text-sm">
                                    {user?.name}
                                </div>
                                <div className="text-[#8B949E] text-xs">
                                    {user?.department}
                                </div>
                            </div>
                            <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <button
                                onClick={logout}
                                className="text-[#8B949E] hover:text-[#D32F2F] transition-colors"
                                title="Выйти"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-[#30363D] p-2">
                        {getNavigationItems().map((item) => (
                            <a
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded ${
                                    currentPage === item.path
                                        ? "bg-[#FF6B35] text-white"
                                        : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#0D1117]"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <item.icon size={18} />
                                <span>{item.name}</span>
                            </a>
                        ))}
                    </div>
                )}
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:block w-64 bg-[#161B22] border-r border-[#30363D] min-h-[calc(100vh-57px)] p-4">
                    <nav className="space-y-1">
                        {getNavigationItems().map((item) => (
                            <a
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                                    currentPage === item.path
                                        ? "bg-[#FF6B35] text-white"
                                        : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#0D1117]"
                                }`}
                            >
                                <item.icon size={18} />
                                <span>{item.name}</span>
                            </a>
                        ))}
                    </nav>

                    {/* Department badge */}
                    <div className="mt-6 p-3 bg-[#0D1117] border border-[#30363D] rounded">
                        <div className="text-[#8B949E] text-xs mb-1">
                            Ваш отдел
                        </div>
                        <Badge variant="info">{user?.department}</Badge>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    );
}
