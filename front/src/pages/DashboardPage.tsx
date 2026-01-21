import React, { useEffect, useState } from "react";
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
    Clock,
    CheckCircle2,
    Users,
} from "lucide-react";
import {
    MissionService,
    RequestService,
    StationService,
} from "../api/services";
import { RequestDto } from "../types/api";

export function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeRequests: 0,
        activeMissions: 0,
        operationalStations: 0,
        criticalAlerts: 0,
    });
    const [tasks, setTasks] = useState<RequestDto[]>([]);
    const [recentRequests, setRecentRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Requests (My Department)
                const requestsData = await RequestService.getMyDepartmentRequests();
                const requests = Array.isArray(requestsData) ? requestsData : [];
                
                const activeRequestsCount = requests.filter(
                    (r) => {
                        const s = r.status?.toUpperCase();
                        return s === "IN_PROGRESS" || s === "NEW";
                    }
                ).length;
                
                // My tasks (assigned to me or my department pending)
                setTasks(requests.filter((r) => r.status?.toUpperCase() !== "COMPLETED"));
                setRecentRequests(requests.slice(0, 3));

                // Fetch Missions
                const missionsData = await MissionService.getAll(0, 100);
                const activeMissionsCount = missionsData.data?.filter(
                    (m) => {
                        const s = m.status?.toUpperCase().trim();
                        return (
                            s === "ACTIVE" ||
                            s === "IN_PROGRESS" ||
                            s === "STARTED" ||
                            s === "PLANNED" ||
                            s === "CREATED" ||
                            s === "NEW"
                        );
                    }
                ).length || 0;

                // Fetch Stations
                const stationsData = await StationService.getAll();
                const stations = Array.isArray(stationsData) ? stationsData : [];
                const operationalStationsCount = stations.filter(
                    (s) => {
                        const st = s.status?.toUpperCase().trim();
                        return st === "OPERATIONAL" || st === "ACTIVE" || st === "ONLINE";
                    }
                ).length;
                
                // Critical alerts equivalent
                const criticalCount = requests.filter(r => r.status?.toUpperCase() === 'NEW').length;

                setStats({
                    activeRequests: activeRequestsCount,
                    activeMissions: activeMissionsCount,
                    operationalStations: operationalStationsCount,
                    criticalAlerts: criticalCount,
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <Layout currentPage="/dashboard">
                <div className="flex justify-center items-center h-64 text-[#C9D1D9]">
                    Загрузка данных...
                </div>
            </Layout>
        );
    }

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
                                    Новые запросы
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
                    {/* Tasks (Requests for Dept) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2
                                    size={20}
                                    className="text-[#FF6B35]"
                                />
                                Задачи отдела
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tasks.length === 0 && (
                                    <div className="text-[#8B949E] text-sm">Нет активных задач</div>
                                )}
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start gap-3 p-3 bg-[#0D1117] rounded border border-[#30363D] hover:border-[#FF6B35] transition-colors cursor-pointer"
                                        onClick={() => window.location.href = `/requests`}
                                    >
                                        <AlertTriangle
                                            size={18}
                                            className="text-[#8B949E] mt-0.5"
                                        />
                                        <div className="flex-1">
                                            <p className="text-[#C9D1D9] text-sm">
                                                {task.description || "Без описания"}
                                            </p>
                                            <Badge
                                                variant={
                                                    task.status === "NEW"
                                                        ? "info"
                                                        : "warning"
                                                }
                                                className="mt-2"
                                            >
                                                {task.status}
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
                                {recentRequests.length === 0 && (
                                    <div className="text-[#8B949E] text-sm">Нет запросов</div>
                                )}
                                {recentRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="p-3 bg-[#0D1117] rounded border border-[#30363D] hover:border-[#FF6B35] transition-colors cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/requests`)
                                        }
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#C9D1D9] font-mono text-sm">
                                                    {request.requestCode}
                                                </span>
                                                <Badge
                                                    variant={
                                                        request.status === "NEW"
                                                            ? "info"
                                                            : request.status ===
                                                              "IN_PROGRESS"
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                >
                                                    {request.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-[#C9D1D9] text-sm mb-1">
                                            {request.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-[#8B949E] text-xs">
                                            <span>От: {request.senderDepartment}</span>
                                            <span>→</span>
                                            <span>Кому: {request.recipientDepartment}</span>
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
