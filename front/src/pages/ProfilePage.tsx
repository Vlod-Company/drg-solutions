import React from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { User, Shield, Briefcase, Calendar, Award } from "lucide-react";

export function ProfilePage() {
    const { user } = useAuth();

    if (!user) return null;

    const getRoleDisplay = (role: string) => {
        const roleMap: Record<string, string> = {
            ROLE_ADMIN: "Администратор",
            ROLE_MANAGEMENT_EMPLOYEE: "Менеджмент",
            ROLE_MISSION_CONTROL_EMPLOYEE: "Центр управления миссиями",
            ROLE_SCANCOM_EMPLOYEE: "ScanCom",
            ROLE_RND_EMPLOYEE: "R&D",
            ROLE_SCIENCE_DEPARTMENT_EMPLOYEE: "Научный отдел",
            ROLE_LAUNCH_CONTROL_EMPLOYEE: "Контроль запусков",
            ROLE_MAINTENANCE_EMPLOYEE: "Обслуживание",
            ROLE_MINER_EMPLOYEE: "Шахтер",
        };
        return roleMap[role] || role;
    };

    return (
        <Layout currentPage="/profile">
            <div className="max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[#C9D1D9] mb-2">
                        Профиль пользователя
                    </h1>
                    <p className="text-[#8B949E]">
                        Информация о вашей учетной записи
                    </p>
                </div>

                {/* Profile Card */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-[#FF6B35] rounded-full flex items-center justify-center">
                                <User size={48} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-[#C9D1D9] text-2xl mb-2">
                                    {user.name}
                                </h2>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge variant="warning">
                                        {getRoleDisplay(user.role)}
                                    </Badge>
                                    <Badge variant="info">
                                        {user.department}
                                    </Badge>
                                </div>
                                <div className="text-[#8B949E] text-sm">
                                    ID:{" "}
                                    <span className="font-mono text-[#C9D1D9]">
                                        {user.id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase
                                    size={20}
                                    className="text-[#FF6B35]"
                                />
                                Роль и доступ
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Роль
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {getRoleDisplay(user.role)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Отдел
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {user.department}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Имя пользователя
                                    </div>
                                    <div className="text-[#C9D1D9] font-mono">
                                        {user.username}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield size={20} className="text-[#FF6B35]" />
                                Безопасность
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Уровень доступа
                                    </div>
                                    <Badge
                                        variant={
                                            user.role === "ROLE_ADMIN"
                                                ? "danger"
                                                : "success"
                                        }
                                    >
                                        {user.role === "ROLE_ADMIN"
                                            ? "Полный доступ"
                                            : "Стандартный"}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Последний вход
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {new Date().toLocaleString("ru-RU")}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Статус аккаунта
                                    </div>
                                    <Badge variant="success">Активен</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award size={20} className="text-[#FF6B35]" />
                            Права доступа
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {user.role === "ROLE_ADMIN" && (
                                <>
                                    <PermissionItem
                                        text="Полный доступ к системе"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление пользователями"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление станциями"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление миссиями"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Просмотр всех отчетов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Системные настройки"
                                        granted
                                    />
                                </>
                            )}
                            {user.role === "ROLE_MANAGEMENT_EMPLOYEE" && (
                                <>
                                    <PermissionItem
                                        text="Управление персоналом"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление станциями"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Просмотр запросов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Согласование проектов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление миссиями"
                                        granted={false}
                                    />
                                    <PermissionItem
                                        text="Системные настройки"
                                        granted={false}
                                    />
                                </>
                            )}
                            {user.role === "ROLE_MISSION_CONTROL_EMPLOYEE" && (
                                <>
                                    <PermissionItem
                                        text="Управление миссиями"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Планирование операций"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Мониторинг команд"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Просмотр запросов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление персоналом"
                                        granted={false}
                                    />
                                    <PermissionItem
                                        text="Управление станциями"
                                        granted={false}
                                    />
                                </>
                            )}
                            {user.role === "ROLE_MAINTENANCE_EMPLOYEE" && (
                                <>
                                    <PermissionItem
                                        text="Управление станциями"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Просмотр запросов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Техническое обслуживание"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Оценка угроз"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление миссиями"
                                        granted={false}
                                    />
                                    <PermissionItem
                                        text="Управление персоналом"
                                        granted={false}
                                    />
                                </>
                            )}
                            {user.role === "ROLE_MINER_EMPLOYEE" && (
                                <>
                                    <PermissionItem
                                        text="Просмотр миссий"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Участие в операциях"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Просмотр биомов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление миссиями"
                                        granted={false}
                                    />
                                    <PermissionItem
                                        text="Управление персоналом"
                                        granted={false}
                                    />
                                    <PermissionItem
                                        text="Управление станциями"
                                        granted={false}
                                    />
                                </>
                            )}
                            {[
                                "ROLE_SCANCOM_EMPLOYEE",
                                "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE",
                                "ROLE_RND_EMPLOYEE",
                                "ROLE_LAUNCH_CONTROL_EMPLOYEE",
                            ].includes(user.role) && (
                                <>
                                    <PermissionItem
                                        text="Просмотр миссий"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Просмотр биомов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Создание запросов"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Специализированные функции"
                                        granted
                                    />
                                    <PermissionItem
                                        text="Управление персоналом"
                                        granted={false}
                                    />
                                    <PermissionItem
                                        text="Управление станциями"
                                        granted={false}
                                    />
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

function PermissionItem({ text, granted }: { text: string; granted: boolean }) {
    return (
        <div className="flex items-center gap-2 p-2 bg-[#0D1117] rounded">
            <div
                className={`w-2 h-2 rounded-full ${granted ? "bg-[#56C271]" : "bg-[#8B949E]"}`}
            />
            <span className={granted ? "text-[#C9D1D9]" : "text-[#8B949E]"}>
                {text}
            </span>
        </div>
    );
}
