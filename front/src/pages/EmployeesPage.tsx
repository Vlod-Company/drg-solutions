import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
    Card,
    CardHeader,
    CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Users, UserPlus, Target, Heart, Award } from "lucide-react";
import { EmployeeService } from "../api/services";
import { EmployeeResponseDto } from "../types/api";
import { toast } from "sonner"; // Fixed import

export function EmployeesPage() {
    const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponseDto | null>(
        null
    );

    const fetchEmployees = async () => {
        try {
            const data = await EmployeeService.getAll();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees", error);
            // toast.error("Не удалось загрузить сотрудников");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreateEmployee = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.info("Создание сотрудника пока не поддерживается API");
        setShowCreateModal(false);
    };

    // Helper to map API status to UI colors/labels
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "success";
            case "ON_MISSION":
                return "warning";
            case "RESTING":
                return "info";
            case "INJURED":
                return "danger";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "Активен";
            case "ON_MISSION":
                return "На миссии";
            case "RESTING":
                return "Отдыхает";
            case "INJURED":
                return "Ранен";
            default:
                return status;
        }
    };

    // Helpers to safely access properties that might differ in DTO
    const getDepartment = (e: EmployeeResponseDto) => (e as any).department || "Неопределен";
    const getQualification = (e: EmployeeResponseDto) => (e as any).qualification || "Специалист";
    const getMissionsCompleted = (e: EmployeeResponseDto) => (e as any).missionsCompleted || 0;
    const getJoinedAt = (e: EmployeeResponseDto) => (e as any).employmentDate || (e as any).joinedAt || new Date().toISOString();

    return (
        <Layout currentPage="/employees">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2">
                            Управление персоналом
                        </h1>
                        <p className="text-[#8B949E]">
                            Список сотрудников корпорации
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <UserPlus size={18} className="mr-2" />
                        Зарегистрировать сотрудника
                    </Button>
                </div>

                {/* Stats */}
                {!loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            {
                                label: "Всего сотрудников",
                                count: employees.length,
                                icon: Users,
                                color: "text-[#4FC3F7]",
                            },
                            {
                                label: "На миссиях",
                                count: employees.filter(
                                    (e) => e.status === "ON_MISSION",
                                ).length,
                                icon: Target,
                                color: "text-[#FF6B35]",
                            },
                            {
                                label: "Активные",
                                count: employees.filter(
                                    (e) => e.status === "ACTIVE",
                                ).length,
                                icon: Users,
                                color: "text-[#56C271]",
                            },
                            {
                                label: "Раненые",
                                count: employees.filter(
                                    (e) => e.status === "INJURED",
                                ).length,
                                icon: Heart,
                                color: "text-[#D32F2F]",
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg"
                            >
                                <stat.icon
                                    className={`${stat.color} mb-2`}
                                    size={20}
                                />
                                <div className="text-[#C9D1D9] text-2xl font-bold">
                                    {stat.count}
                                </div>
                                <div className="text-[#8B949E] text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Employees Grid */}
                {loading ? (
                    <div className="text-[#C9D1D9]">Загрузка сотрудников...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employees.map((employee) => (
                            <Card
                                key={employee.id}
                                onClick={() => setSelectedEmployee(employee)}
                                className="cursor-pointer hover:border-[#FF6B35] transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center">
                                                <Users
                                                    size={20}
                                                    className="text-white"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-[#C9D1D9]">
                                                    {employee.name}
                                                </div>
                                                <div className="text-[#8B949E] text-xs font-mono">
                                                    ID: {employee.id}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={getStatusColor(
                                                employee.status
                                            )}
                                        >
                                            {getStatusLabel(employee.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8B949E]">
                                                Отдел:
                                            </span>
                                            <span className="text-[#C9D1D9]">
                                                {getDepartment(employee)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8B949E]">
                                                Квалификация:
                                            </span>
                                            <Badge variant="info">
                                                {getQualification(employee)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                
                {!loading && employees.length === 0 && (
                     <div className="text-center py-12 text-[#8B949E]">
                         Сотрудники не найдены
                     </div>
                )}

                {/* Create Employee Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Регистрация нового сотрудника"
                >
                    <form onSubmit={handleCreateEmployee}>
                        <Input
                            name="name"
                            label="Полное имя"
                            placeholder="Иванов Иван Иванович"
                            required
                        />

                        {/* Simplified Creation Form since logic is mocked */}
                        <div className="flex gap-2 justify-end mt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Отмена
                            </Button>
                            <Button type="submit">Зарегистрировать</Button>
                        </div>
                    </form>
                </Modal>

                {/* Employee Details Modal */}
                {selectedEmployee && (
                    <Modal
                        isOpen={!!selectedEmployee}
                        onClose={() => setSelectedEmployee(null)}
                        title="Профиль сотрудника"
                    >
                        <div className="space-y-6">
                            {/* Employee Header */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center">
                                    <Users size={32} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[#C9D1D9] text-xl">
                                        {selectedEmployee.name}
                                    </h3>
                                    <p className="text-[#8B949E] font-mono text-sm">
                                        ID: {selectedEmployee.id}
                                    </p>
                                </div>
                                <Badge
                                    variant={getStatusColor(
                                        selectedEmployee.status
                                    )}
                                >
                                    {getStatusLabel(selectedEmployee.status)}
                                </Badge>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Отдел
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {getDepartment(selectedEmployee)}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Квалификация
                                    </div>
                                    <Badge variant="info">
                                        {getQualification(selectedEmployee)}
                                    </Badge>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Миссий завершено
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award
                                            className="text-[#FF6B35]"
                                            size={20}
                                        />
                                        <span className="text-[#C9D1D9] text-xl font-bold">
                                            {getMissionsCompleted(selectedEmployee)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Дата приема
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {new Date(
                                            getJoinedAt(selectedEmployee)
                                        ).toLocaleDateString("ru-RU")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
