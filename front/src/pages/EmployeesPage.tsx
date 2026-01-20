import React, { useState } from "react";
import { Layout } from "../components/Layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Users, UserPlus, Target, Heart, Award } from "lucide-react";
import { mockEmployees } from "../data/mockData";
import { Employee, Role } from "../types";
import { toast } from "sonner@2.0.3";

export function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        null,
    );

    const handleCreateEmployee = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newEmployee: Employee = {
            id: `EMP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            name: formData.get("name") as string,
            role: formData.get("role") as Role,
            department: formData.get("department") as string,
            qualification: formData.get("qualification") as string,
            missionsCompleted: 0,
            status: "ACTIVE",
            joinedAt: new Date().toISOString(),
        };

        setEmployees([...employees, newEmployee]);
        setShowCreateModal(false);
        toast.success(`Сотрудник ${newEmployee.name} успешно зарегистрирован`);
    };

    const getStatusColor = (status: Employee["status"]) => {
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

    const getStatusLabel = (status: Employee["status"]) => {
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

                {/* Employees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                        <Card
                            key={employee.id}
                            onClick={() => setSelectedEmployee(employee)}
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
                                                {employee.id}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={getStatusColor(
                                            employee.status,
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
                                            {employee.department}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8B949E]">
                                            Квалификация:
                                        </span>
                                        <Badge variant="info">
                                            {employee.qualification}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8B949E]">
                                            Миссий:
                                        </span>
                                        <span className="text-[#C9D1D9] font-bold">
                                            {employee.missionsCompleted}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8B949E]">
                                            Принят:
                                        </span>
                                        <span className="text-[#C9D1D9]">
                                            {new Date(
                                                employee.joinedAt,
                                            ).toLocaleDateString("ru-RU")}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

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

                        <Select
                            name="role"
                            label="Роль"
                            options={[
                                {
                                    value: "ROLE_MANAGEMENT_EMPLOYEE",
                                    label: "Менеджмент",
                                },
                                {
                                    value: "ROLE_MISSION_CONTROL_EMPLOYEE",
                                    label: "Центр управления миссиями",
                                },
                                {
                                    value: "ROLE_SCANCOM_EMPLOYEE",
                                    label: "ScanCom",
                                },
                                { value: "ROLE_RND_EMPLOYEE", label: "R&D" },
                                {
                                    value: "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE",
                                    label: "Научный отдел",
                                },
                                {
                                    value: "ROLE_LAUNCH_CONTROL_EMPLOYEE",
                                    label: "Контроль запусков",
                                },
                                {
                                    value: "ROLE_MAINTENANCE_EMPLOYEE",
                                    label: "Обслуживание",
                                },
                                {
                                    value: "ROLE_MINER_EMPLOYEE",
                                    label: "Шахтер",
                                },
                            ]}
                            required
                        />

                        <Input
                            name="department"
                            label="Отдел"
                            placeholder="Название отдела"
                            required
                        />

                        <Select
                            name="qualification"
                            label="Квалификация"
                            options={[
                                { value: "Новичок", label: "Новичок" },
                                { value: "Опытный", label: "Опытный" },
                                { value: "Специалист", label: "Специалист" },
                                { value: "Высшая", label: "Высшая" },
                            ]}
                            required
                        />

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
                                        {selectedEmployee.id}
                                    </p>
                                </div>
                                <Badge
                                    variant={getStatusColor(
                                        selectedEmployee.status,
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
                                        {selectedEmployee.department}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Квалификация
                                    </div>
                                    <Badge variant="info">
                                        {selectedEmployee.qualification}
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
                                            {selectedEmployee.missionsCompleted}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Дата приема
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {new Date(
                                            selectedEmployee.joinedAt,
                                        ).toLocaleDateString("ru-RU")}
                                    </div>
                                </div>
                            </div>

                            {/* Performance */}
                            {selectedEmployee.missionsCompleted > 0 && (
                                <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] mb-3">
                                        Производительность
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#C9D1D9]">
                                                Успешных миссий
                                            </span>
                                            <span className="text-[#56C271] font-bold">
                                                {
                                                    selectedEmployee.missionsCompleted
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#C9D1D9]">
                                                Эффективность
                                            </span>
                                            <Badge variant="success">
                                                Отличная
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
