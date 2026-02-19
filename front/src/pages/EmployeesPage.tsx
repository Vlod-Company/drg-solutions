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
import { Users, UserPlus, Target, Heart, Award, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editData, setEditData] = useState<Partial<EmployeeResponseDto>>({});
    const [activeTab, setActiveTab] = useState("ALL");
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 9;

    const fetchEmployees = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const response = await EmployeeService.getAll(pageNumber, pageSize);
            if (Array.isArray(response)) {
                setEmployees(response);
                setTotalItems(response.length);
            } else {
                setEmployees(response.data || []);
                setTotalItems(response.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(page);
    }, [page]);

    const handleCreateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const experience = Number(formData.get("experience") || 0);
        if (experience < 0) {
            toast.error("Опыт не может быть отрицательным");
            return;
        }

        try {
            await EmployeeService.create({
                name: formData.get("name") as string,
                post: formData.get("post") as string,
                department: formData.get("department") as string,
                experience: experience,
                status: "ACTIVE",
                hiredDate: new Date().toISOString(),
            });
            toast.success("Сотрудник зарегистрирован");
            setShowCreateModal(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при регистрации сотрудника");
        }
    };

    const handleUpdateEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedEmployee?.id) return;
        
        if (editData.experience !== undefined && editData.experience < 0) {
            toast.error("Опыт не может быть отрицательным");
            return;
        }

        try {
            const updated = await EmployeeService.update(selectedEmployee.id, editData);
            toast.success("Данные сотрудника обновлены");
            setIsEditing(false);
            setSelectedEmployee(updated);
            fetchEmployees();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при обновлении данных");
        }
    };

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case "ACTIVE":
                return "success";
            case "ON_VACATION":
                return "warning";
            case "FIRED":
                return "danger";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: string | undefined) => {
        switch (status) {
            case "ACTIVE":
                return "Активен";
            case "ON_VACATION":
                return "В отпуске";
            case "FIRED":
                return "Уволен";
            default:
                return status || "Неизвестно";
        }
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
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

                {/* Tabs / Filter */}
                {!loading && (
                    <div className="flex flex-wrap gap-2 mb-8 p-1 bg-[#161B22] border border-[#30363D] rounded-lg w-fit">
                        {["Все", ...Array.from(new Set(employees.map(e => e.department).filter(Boolean)))].map((dept) => (
                            <button
                                key={dept}
                                onClick={() => {
                                    setActiveTab(dept as string);
                                    setPage(0);
                                }}
                                className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                                    activeTab === dept
                                        ? "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20"
                                        : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]"
                                }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                )}

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
                                label: "В отпуске",
                                count: employees.filter(
                                    (e) => e.status === "ON_VACATION",
                                ).length,
                                icon: Target,
                                color: "text-[#FF6B35]",
                            },
                            {
                                label: "Активны",
                                count: employees.filter(
                                    (e) => e.status === "ACTIVE",
                                ).length,
                                icon: Users,
                                color: "text-[#56C271]",
                            },
                            {
                                label: "Уволены",
                                count: employees.filter(
                                    (e) => e.status === "FIRED",
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
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin text-[#FF6B35] mb-4" size={40} />
                        <p className="text-[#8B949E] font-mono">Синхронизация данных...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employees
                            .filter(e => activeTab === "Все" || e.department === activeTab)
                            .map((employee) => (
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
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8B949E]">Отдел:</span>
                                            <span className="text-[#C9D1D9] font-medium">{employee.department || "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#8B949E]">Должность:</span>
                                            <span className="text-[#C9D1D9]">{employee.post || "—"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#30363D]">
                                            <span className="text-[#8B949E]">Опыт:</span>
                                            <Badge variant="outline" className="text-[#FF6B35] border-[#FF6B35]/30 font-mono">
                                                {employee.experience || 0} XP
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-8 mb-12 px-1">
                    <div className="text-[#8B949E] text-sm font-mono bg-[#161B22]/50 border border-[#30363D] px-3 py-1.5 rounded-md">
                        <span className="text-[#FF6B35]">
                            {totalItems === 0 ? 0 : page * pageSize + 1}
                        </span>
                        {" - "}
                        <span className="text-[#FF6B35]">
                            {Math.min((page + 1) * pageSize, totalItems)}
                        </span>
                        {" / "}
                        <span className="text-[#C9D1D9]">{totalItems}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="bg-[#161B22] border-[#30363D]"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Назад
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={(page + 1) * pageSize >= totalItems}
                            onClick={() => setPage(page + 1)}
                            className="bg-[#161B22] border-[#30363D]"
                        >
                            Вперед
                            <ChevronRight size={16} className="ml-1" />
                        </Button>
                    </div>
                </div>
                
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
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="post"
                                label="Должность"
                                placeholder="Инженер"
                                required
                            />
                            <Input
                                name="department"
                                label="Отдел"
                                placeholder="Технический"
                                required
                            />
                        </div>
                        
                        <Input
                            name="experience"
                            label="Опыт (XP)"
                            type="number"
                            min="0"
                            placeholder="0"
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
                        onClose={() => {
                            setSelectedEmployee(null);
                            setIsEditing(false);
                        }}
                        title={isEditing ? "Редактирование профиля" : "Профиль сотрудника"}
                        size="lg"
                    >
                        {isEditing ? (
                            <form onSubmit={handleUpdateEmployee} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="ФИО"
                                        value={editData.name || ""}
                                        onChange={e => setEditData({...editData, name: e.target.value})}
                                        required
                                    />
                                    <Select
                                        label="Статус"
                                        value={editData.status || ""}
                                        onChange={e => setEditData({...editData, status: e.target.value as any})}
                                        options={[
                                            { value: "ACTIVE", label: "Активен" },
                                            { value: "ON_VACATION", label: "В отпуске" },
                                            { value: "FIRED", label: "Уволен" },
                                        ]}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Отдел"
                                        value={editData.department || ""}
                                        onChange={e => setEditData({...editData, department: e.target.value})}
                                    />
                                    <Input
                                        label="Должность"
                                        value={editData.post || ""}
                                        onChange={e => setEditData({...editData, post: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Опыт (XP)"
                                        type="number"
                                        min="0"
                                        value={editData.experience || 0}
                                        onChange={e => setEditData({...editData, experience: Number(e.target.value)})}
                                    />
                                    <Input
                                        label="Дата найма"
                                        type="date"
                                        value={editData.hiredDate ? editData.hiredDate.split("T")[0] : ""}
                                        onChange={e => setEditData({...editData, hiredDate: new Date(e.target.value).toISOString()})}
                                    />
                                </div>
                                {editData.status === "FIRED" && (
                                    <Input
                                        label="Дата увольнения"
                                        type="date"
                                        value={editData.firedDate ? editData.firedDate.split("T")[0] : ""}
                                        onChange={e => setEditData({...editData, firedDate: new Date(e.target.value).toISOString()})}
                                    />
                                )}

                                <div className="flex gap-2 justify-end mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                                        Отмена
                                    </Button>
                                    <Button type="submit">Сохранить изменения</Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                {/* Employee Header */}
                                <div className="flex items-center gap-4 p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                                    <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center">
                                        <Users size={32} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[#C9D1D9] text-xl font-bold">
                                            {selectedEmployee.name}
                                        </h3>
                                        <p className="text-[#8B949E] font-mono text-sm">
                                            ID: {selectedEmployee.id}
                                        </p>
                                    </div>
                                    <Badge variant={getStatusColor(selectedEmployee.status)}>
                                        {getStatusLabel(selectedEmployee.status)}
                                    </Badge>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                        <div className="text-[#8B949E] text-[10px] uppercase font-mono mb-1">Отдел</div>
                                        <div className="text-[#C9D1D9]">{selectedEmployee.department || "—"}</div>
                                    </div>

                                    <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                        <div className="text-[#8B949E] text-[10px] uppercase font-mono mb-1">Должность</div>
                                        <div className="text-[#C9D1D9]">{selectedEmployee.post || "—"}</div>
                                    </div>

                                    <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                        <div className="text-[#8B949E] text-[10px] uppercase font-mono mb-1">Опыт</div>
                                        <div className="flex items-center gap-2">
                                            <Award className="text-[#FF6B35]" size={18} />
                                            <span className="text-[#C9D1D9] text-lg font-bold font-mono">{selectedEmployee.experience || 0} XP</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                        <div className="text-[#8B949E] text-[10px] uppercase font-mono mb-1">Дата найма</div>
                                        <div className="text-[#C9D1D9] font-mono">{formatDate(selectedEmployee.hiredDate)}</div>
                                    </div>

                                    {selectedEmployee.status === "FIRED" && (
                                        <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded col-span-2">
                                            <div className="text-[#D32F2F] text-[10px] uppercase font-mono mb-1">Дата увольнения</div>
                                            <div className="text-[#C9D1D9] font-mono">{formatDate(selectedEmployee.firedDate)}</div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-[#30363D]">
                                    <Button
                                        onClick={() => {
                                            setEditData(selectedEmployee);
                                            setIsEditing(true);
                                        }}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={async () => {
                                            if (confirm("Вы уверены, что хотите удалить сотрудника?")) {
                                                try {
                                                    await EmployeeService.delete(selectedEmployee.id as number);
                                                    toast.success("Сотрудник удален");
                                                    setSelectedEmployee(null);
                                                    fetchEmployees();
                                                } catch (e) {
                                                    toast.error("Ошибка при удалении сотрудника");
                                                }
                                            }
                                        }}
                                    >
                                        Удалить сотрудника
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
