import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Input, Select } from "../components/ui/Input";
import {EmployeeService, UserService} from "../api/services";
import {
    Users,
    Plus,
    Shield,
    UserPlus,
    UserMinus,
    Calendar,
    Key,
    Loader2,
    CheckCircle2,
    XCircle,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import {Employee} from "../types";

// Типы данных
interface UserDto {
    id: number;
    employeeId: number;
    username: string;
    active: boolean;
    createdAt: string;
    roles: string[];
}

interface RegistrationRequest {
    name: string;
    password: string;
    employee_id: number;
}

interface RoleRequest {
    roleName: string;
}

// Список доступных ролей
const AVAILABLE_ROLES = [
    "ROLE_ADMIN",
    "ROLE_USER",
    "ROLE_MANAGEMENT_EMPLOYEE",
    "ROLE_MISSION_CONTROL_EMPLOYEE",
    "ROLE_SCANCOM_EMPLOYEE",
    "ROLE_RND_EMPLOYEE",
    "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE",
    "ROLE_LAUNCH_CONTROL_EMPLOYEE",
    "ROLE_MAINTENANCE_EMPLOYEE",
    "ROLE_MINER_EMPLOYEE"
];

// Человеко-читаемые названия ролей
const ROLE_NAMES: Record<string, string> = {
    "ROLE_ADMIN": "Администратор",
    "ROLE_USER": "Пользователь",
    "ROLE_MANAGEMENT_EMPLOYEE": "Management",
    "ROLE_MISSION_CONTROL_EMPLOYEE": "Mission Control",
    "ROLE_SCANCOM_EMPLOYEE": "ScanCom",
    "ROLE_RND_EMPLOYEE": "R&D",
    "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE": "Science Department",
    "ROLE_LAUNCH_CONTROL_EMPLOYEE": "Launch Control",
    "ROLE_MAINTENANCE_EMPLOYEE": "Maintenance",
    "ROLE_MINER_EMPLOYEE": "Шахтер"
};

// Цвета для ролей
const ROLE_COLORS: Record<string, string> = {
    "ROLE_ADMIN": "danger",
    "ROLE_USER": "default",
    "ROLE_MANAGEMENT_EMPLOYEE": "primary",
    "ROLE_MISSION_CONTROL_EMPLOYEE": "info",
    "ROLE_SCANCOM_EMPLOYEE": "warning",
    "ROLE_RND_EMPLOYEE": "success",
    "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE": "info",
    "ROLE_LAUNCH_CONTROL_EMPLOYEE": "warning",
    "ROLE_MAINTENANCE_EMPLOYEE": "primary",
    "ROLE_MINER_EMPLOYEE": "success"
};

export function UsersPage() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modals state
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showRolesModal, setShowRolesModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    // Forms state
    const [registerForm, setRegisterForm] = useState<RegistrationRequest>({
        name: "",
        password: "",
        employee_id: 0
    });

    const [selectedRole, setSelectedRole] = useState("");

    // Fetch employees
    const fetchEmployees = async () => {
        setLoadingEmployees(true);
        try {
            const response = await EmployeeService.getAll(0, 100);
            const employeesData = Array.isArray(response) ? response : (response.content || response.data || []);
            const activeEmployees = employeesData.filter((emp: Employee) => emp.status === "ACTIVE");
            setEmployees(activeEmployees);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
            toast.error("Ошибка загрузки списка сотрудников");
        } finally {
            setLoadingEmployees(false);
        }
    };

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await UserService.getAll();
            setUsers(Array.isArray(response) ? response : (response.data || response.content || []));
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Ошибка загрузки пользователей");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEmployees();
    }, []);

    // Handle registration
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registerForm.name || !registerForm.password || !registerForm.employee_id) {
            toast.error("Заполните все поля");
            return;
        }

        const selectedEmployee = employees.find(emp => emp.id === registerForm.employee_id);

        setIsSubmitting(true);
        try {
            await UserService.register(registerForm);
            toast.success(`Пользователь ${registerForm.name} зарегистрирован для сотрудника ${selectedEmployee?.name || registerForm.employee_id}`);
            setShowRegisterModal(false);
            setRegisterForm({ name: "", password: "", employee_id: 0 });
            fetchUsers();
        } catch (error) {
            console.error("Registration failed:", error);
            toast.error("Ошибка при регистрации");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle add role
    const handleAddRole = async () => {
        if (!selectedUser || !selectedRole) {
            toast.error("Выберите роль");
            return;
        }

        if (selectedUser.roles.includes(selectedRole)) {
            toast.error("Роль уже назначена пользователю");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedUser = await UserService.addRole(selectedUser.id, { roleName: selectedRole });
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setSelectedUser(updatedUser);
            setSelectedRole("");
            toast.success(`Роль ${ROLE_NAMES[selectedRole]} добавлена`);
        } catch (error) {
            console.error("Failed to add role:", error);
            toast.error("Ошибка при добавлении роли");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle remove role
    const handleRemoveRole = async (roleName: string) => {
        if (!selectedUser) return;

        // Нельзя удалить последнюю роль?
        if (selectedUser.roles.length <= 1) {
            toast.error("У пользователя должна быть хотя бы одна роль");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedUser = await UserService.removeRole(selectedUser.id, { roleName });
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setSelectedUser(updatedUser);
            toast.success(`Роль ${ROLE_NAMES[roleName]} удалена`);
        } catch (error) {
            console.error("Failed to remove role:", error);
            toast.error("Ошибка при удалении роли");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get available roles for user (roles they don't have yet)
    const getAvailableRolesForUser = () => {
        if (!selectedUser) return [];
        return AVAILABLE_ROLES.filter(role => !selectedUser.roles.includes(role));
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ru-RU", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Layout currentPage="/users">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#C9D1D9] flex items-center gap-3">
                            <Users className="text-[#FF6B35]" /> Управление пользователями
                        </h1>
                        <p className="text-[#8B949E] mt-1">
                            Регистрация новых сотрудников и управление их ролями
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={fetchUsers}
                            className="border border-[#30363D]"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Обновить
                        </Button>
                        <Button onClick={() => setShowRegisterModal(true)}>
                            <UserPlus size={18} className="mr-2" />
                            Регистрация
                        </Button>
                    </div>
                </div>

                {/* Users Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#FF6B35] mb-4" size={40} />
                        <p className="text-[#8B949E]">Загрузка пользователей...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[#30363D] rounded-xl bg-[#161B22]/50">
                        <Users size={48} className="text-[#30363D] mx-auto mb-4" />
                        <h3 className="text-[#C9D1D9] text-xl font-medium">Нет пользователей</h3>
                        <p className="text-[#8B949E] mt-2 mb-6">Зарегистрируйте первого сотрудника</p>
                        <Button variant="ghost" onClick={() => setShowRegisterModal(true)}>
                            <UserPlus size={18} className="mr-2" />
                            Зарегистрировать
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Card
                                key={user.id}
                                className="bg-[#161B22] border-[#30363D] hover:border-[#FF6B35]/50 transition-all group"
                            >
                                <CardHeader className="pb-2 border-b border-[#30363D]/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-[#C9D1D9] font-bold text-lg">
                                                    {user.username}
                                                </h3>
                                                {user.active ? (
                                                    <Badge variant="success" className="text-[10px] px-1.5">
                                                        Активен
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="danger" className="text-[10px] px-1.5">
                                                        Неактивен
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[#8B949E] text-xs">
                                                ID: {user.id} | Employee: #{user.employeeId}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-[#FF6B35]/10 rounded-full">
                                            <Shield size={16} className="text-[#FF6B35]" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    {/* Roles */}
                                    <div>
                                        <div className="text-[#8B949E] text-xs mb-2 flex items-center gap-1">
                                            <Key size={12} /> Роли:
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.roles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    variant={ROLE_COLORS[role] as any || "info"}
                                                    className="text-[10px] px-2 py-0.5"
                                                >
                                                    {ROLE_NAMES[role] || role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Created At */}
                                    <div className="flex items-center gap-2 text-xs text-[#8B949E] pt-2 border-t border-[#30363D]/50">
                                        <Calendar size={12} />
                                        Зарегистрирован: {formatDate(user.createdAt)}
                                    </div>

                                    {/* Actions */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-[#FF6B35] border-[#FF6B35]/20 hover:bg-[#FF6B35]/10 mt-2"
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setSelectedRole("");
                                            setShowRolesModal(true);
                                        }}
                                    >
                                        <Shield size={14} className="mr-2" />
                                        Управление ролями
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Register Modal */}
                <Modal
                    isOpen={showRegisterModal}
                    onClose={() => !isSubmitting && setShowRegisterModal(false)}
                    title="Регистрация нового пользователя"
                >
                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            label="Имя пользователя"
                            placeholder="Введите имя"
                            value={registerForm.name}
                            onChange={(e: any) => setRegisterForm({...registerForm, name: e.target.value})}
                            required
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            placeholder="Введите пароль"
                            value={registerForm.password}
                            onChange={(e: any) => setRegisterForm({...registerForm, password: e.target.value})}
                            required
                        />

                        <Select
                            label="Сотрудник"
                            value={registerForm.employee_id || ""}
                            onChange={(e: any) => setRegisterForm({...registerForm, employee_id: Number(e.target.value)})}
                            options={[
                                { value: "", label: "Выберите сотрудника..." },
                                ...employees.map(emp => ({
                                    value: String(emp.id),
                                    label: `${emp.name} ${emp.post ? `(${emp.post})` : ""} - ${emp.department || "Без отдела"}`
                                }))
                            ]}
                            required
                            disabled={loadingEmployees}
                        />

                        {loadingEmployees && (
                            <div className="text-xs text-[#8B949E] flex items-center gap-2">
                                <Loader2 size={12} className="animate-spin" />
                                Загрузка списка сотрудников...
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-[#30363D]">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                type="button"
                                onClick={() => setShowRegisterModal(false)}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </Button>
                            <Button className="flex-1" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Зарегистрировать
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Roles Management Modal */}
                <Modal
                    isOpen={showRolesModal}
                    onClose={() => !isSubmitting && setShowRolesModal(false)}
                    title={`Управление ролями: ${selectedUser?.username}`}
                    size="lg"
                >
                    {selectedUser && (
                        <div className="space-y-6">
                            {/* Current Roles */}
                            <div>
                                <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider mb-3">
                                    Текущие роли
                                </h4>
                                <div className="flex flex-wrap gap-2 p-4 bg-[#0D1117] border border-[#30363D] rounded-lg min-h-[100px]">
                                    {selectedUser.roles.length > 0 ? (
                                        selectedUser.roles.map((role) => (
                                            <div
                                                key={role}
                                                className="flex items-center gap-1 bg-[#161B22] border border-[#30363D] rounded-lg px-2 py-1 group/role"
                                            >
                                                <Badge
                                                    variant={ROLE_COLORS[role] as any || "info"}
                                                    className="text-xs px-2"
                                                >
                                                    {ROLE_NAMES[role] || role}
                                                </Badge>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRole(role)}
                                                    disabled={isSubmitting || selectedUser.roles.length <= 1}
                                                    className="text-[#8B949E] hover:text-[#F85149] transition-colors ml-1 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Удалить роль"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[#8B949E] text-sm w-full text-center py-2">
                                            У пользователя нет ролей
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Add Role */}
                            <div>
                                <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider mb-3">
                                    Добавить роль
                                </h4>
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <Select
                                            label="Выберите роль"
                                            value={selectedRole}
                                            onChange={(e: any) => setSelectedRole(e.target.value)}
                                            options={[
                                                { value: "", label: "Выберите роль..." },
                                                ...getAvailableRolesForUser().map(role => ({
                                                    value: role,
                                                    label: ROLE_NAMES[role] || role
                                                }))
                                            ]}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleAddRole}
                                        disabled={!selectedRole || isSubmitting}
                                        className="mb-4"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Добавить
                                    </Button>
                                </div>
                            </div>

                            {/* Info about user */}
                            <div className="p-4 bg-[#161B22]/50 border border-[#30363D] rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#8B949E]">ID пользователя:</span>
                                    <span className="text-[#C9D1D9] font-mono">{selectedUser.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#8B949E]">ID сотрудника:</span>
                                    <span className="text-[#C9D1D9] font-mono">#{selectedUser.employeeId}</span>
                                </div>
                                {employees.find(emp => emp.id === selectedUser.employeeId) && (
                                    <div className="flex justify-between text-sm pt-2 border-t border-[#30363D]/50">
                                        <span className="text-[#8B949E]">Сотрудник:</span>
                                        <span className="text-[#C9D1D9] text-right">
                                            {employees.find(emp => emp.id === selectedUser.employeeId)?.name}
                                                                        <br />
                                            <span className="text-xs text-[#8B949E]">
                                                {employees.find(emp => emp.id === selectedUser.employeeId)?.post} •
                                                {employees.find(emp => emp.id === selectedUser.employeeId)?.department}
                                            </span>
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#8B949E]">Статус:</span>
                                    <span className={selectedUser.active ? "text-green-500" : "text-red-500"}>
                                        {selectedUser.active ? "Активен" : "Неактивен"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-[#30363D]">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowRolesModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Закрыть
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
}