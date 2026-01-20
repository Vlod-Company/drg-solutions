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
import {
    AlertTriangle,
    Target,
    Building2,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { mockRequests, mockMissions, mockStations } from "../data/mockData";

export function DashboardPage() {
    const { user } = useAuth();

    // Статистика по роли
    const getStats = () => {
        const activeRequests = mockRequests.filter(
            (r) => r.status === "IN_PROGRESS" || r.status === "NEW",
        ).length;
        const activeMissions = mockMissions.filter(
            (m) => m.status === "ACTIVE",
        ).length;
        const operationalStations = mockStations.filter(
            (s) => s.status === "OPERATIONAL",
        ).length;
        const criticalAlerts = mockRequests.filter(
            (r) => r.priority === "CRITICAL",
        ).length;

        return {
            activeRequests,
            activeMissions,
            operationalStations,
            criticalAlerts,
        };
    };

    const stats = getStats();

    // Задачи для пользователя
    const getUserTasks = () => {
        const role = user?.role;

        if (role === "ROLE_MAINTENANCE_EMPLOYEE") {
            return [
                {
                    id: "1",
                    text: "Оценить угрозу на станции Alpha",
                    priority: "CRITICAL",
                    icon: AlertTriangle,
                },
                {
                    id: "2",
                    text: "Провести плановую инспекцию станции Gamma",
                    priority: "MEDIUM",
                    icon: Building2,
                },
            ];
        }

        if (role === "ROLE_MISSION_CONTROL_EMPLOYEE") {
            return [
                {
                    id: "1",
                    text: "Назначить команду на миссию RESCUE-0067",
                    priority: "HIGH",
                    icon: Target,
                },
                {
                    id: "2",
                    text: "Проверить статус миссии MINING-0043",
                    priority: "MEDIUM",
                    icon: CheckCircle2,
                },
            ];
        }

        if (role === "ROLE_MANAGEMENT_EMPLOYEE") {
            return [
                {
                    id: "1",
                    text: "Согласовать проект новой станции Delta",
                    priority: "HIGH",
                    icon: Building2,
                },
                {
                    id: "2",
                    text: "Рассмотреть заявку на найм новых сотрудников",
                    priority: "MEDIUM",
                    icon: Users,
                },
            ];
        }

        return [
            {
                id: "1",
                text: "Ознакомиться с текущими миссиями",
                priority: "LOW",
                icon: Target,
            },
            {
                id: "2",
                text: "Обновить личный профиль",
                priority: "LOW",
                icon: Users,
            },
        ];
    };

    const tasks = getUserTasks();

    // Недавние запросы для роли
    const getRelevantRequests = () => {
        return mockRequests.slice(0, 3);
    };

    const recentRequests = getRelevantRequests();

    return (
        <Layout currentPage="/dashboard">
            <div className="max-w-7xl">
                {/* Welcome */}
                <div className="mb-6">
                    <h1 className="text-[#C9D1D9] mb-2">
                        Добро пожаловать, {user?.name}
                    </h1>
                    <p className="text-[#8B949E]">
                        {new Date().toLocaleDateString("ru-RU", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="text-[#8B949E] text-sm mb-1">
                                    Активные запросы
                                </div>
                                <div className="text-[#C9D1D9] text-2xl font-bold">
                                    {stats.activeRequests}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-[#4FC3F7] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <Clock className="text-[#4FC3F7]" size={24} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="text-[#8B949E] text-sm mb-1">
                                    Активные миссии
                                </div>
                                <div className="text-[#C9D1D9] text-2xl font-bold">
                                    {stats.activeMissions}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-[#FF6B35] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <Target className="text-[#FF6B35]" size={24} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="text-[#8B949E] text-sm mb-1">
                                    Рабочие станции
                                </div>
                                <div className="text-[#C9D1D9] text-2xl font-bold">
                                    {stats.operationalStations}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-[#56C271] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <Building2
                                    className="text-[#56C271]"
                                    size={24}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="text-[#8B949E] text-sm mb-1">
                                    Критические алерты
                                </div>
                                <div className="text-[#C9D1D9] text-2xl font-bold">
                                    {stats.criticalAlerts}
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-[#D32F2F] bg-opacity-10 rounded-lg flex items-center justify-center">
                                <AlertTriangle
                                    className="text-[#D32F2F]"
                                    size={24}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2
                                    size={20}
                                    className="text-[#FF6B35]"
                                />
                                Ваши задачи
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-3 bg-[#0D1117] rounded border border-[#30363D] hover:border-[#FF6B35] transition-colors cursor-pointer"
                                    >
                                        <task.icon
                                            size={18}
                                            className="text-[#8B949E] mt-0.5"
                                        />
                                        <div className="flex-1">
                                            <p className="text-[#C9D1D9] text-sm">
                                                {task.text}
                                            </p>
                                            <Badge
                                                variant={
                                                    task.priority === "CRITICAL"
                                                        ? "danger"
                                                        : task.priority ===
                                                            "HIGH"
                                                          ? "warning"
                                                          : task.priority ===
                                                              "MEDIUM"
                                                            ? "info"
                                                            : "default"
                                                }
                                                className="mt-2"
                                            >
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Requests */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle
                                    size={20}
                                    className="text-[#FF6B35]"
                                />
                                Недавние запросы
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-3 bg-[#0D1117] rounded border border-[#30363D] hover:border-[#FF6B35] transition-colors cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/requests/${request.id}`)
                                        }
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#C9D1D9] font-mono text-sm">
                                                    {request.id}
                                                </span>
                                                <Badge
                                                    variant={
                                                        request.status === "NEW"
                                                            ? "info"
                                                            : request.status ===
                                                                "IN_PROGRESS"
                                                              ? "warning"
                                                              : request.status ===
                                                                  "COMPLETED"
                                                                ? "success"
                                                                : "default"
                                                    }
                                                >
                                                    {request.status}
                                                </Badge>
                                            </div>
                                            <Badge
                                                variant={
                                                    request.priority ===
                                                    "CRITICAL"
                                                        ? "danger"
                                                        : request.priority ===
                                                            "HIGH"
                                                          ? "warning"
                                                          : "default"
                                                }
                                            >
                                                {request.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-[#C9D1D9] text-sm mb-1">
                                            {request.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-[#8B949E] text-xs">
                                            <span>От: {request.from}</span>
                                            <span>→</span>
                                            <span>Кому: {request.to}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-6">
                    <h2 className="text-[#C9D1D9] mb-4">Быстрые действия</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a
                            href="/requests"
                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#FF6B35] transition-colors text-center"
                        >
                            <AlertTriangle
                                className="text-[#FF6B35] mx-auto mb-2"
                                size={24}
                            />
                            <div className="text-[#C9D1D9] text-sm">
                                Запросы
                            </div>
                        </a>
                        <a
                            href="/missions"
                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#FF6B35] transition-colors text-center"
                        >
                            <Target
                                className="text-[#FF6B35] mx-auto mb-2"
                                size={24}
                            />
                            <div className="text-[#C9D1D9] text-sm">Миссии</div>
                        </a>
                        <a
                            href="/stations"
                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#FF6B35] transition-colors text-center"
                        >
                            <Building2
                                className="text-[#FF6B35] mx-auto mb-2"
                                size={24}
                            />
                            <div className="text-[#C9D1D9] text-sm">
                                Станции
                            </div>
                        </a>
                        <a
                            href="/employees"
                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#FF6B35] transition-colors text-center"
                        >
                            <Users
                                className="text-[#FF6B35] mx-auto mb-2"
                                size={24}
                            />
                            <div className="text-[#C9D1D9] text-sm">
                                Сотрудники
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
