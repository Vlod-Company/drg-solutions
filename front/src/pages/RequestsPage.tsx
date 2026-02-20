import React, { useEffect, useState, useCallback } from "react";
import { Layout } from "../components/Layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import {
    Plus,
    Clock,
    User,
    ArrowRight,
    Search,
    Edit2,
    Loader2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { RequestService, EmployeeService, RequestFilter } from "../api/services";
import { RequestDto, EmployeeResponseDto } from "../types/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function RequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [employees, setEmployees] = useState<Record<number, string>>({});
    const [rawEmployees, setRawEmployees] = useState<EmployeeResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<
        "ALL" | "CREATED" | "IN_PROGRESS" | "SOLVED"
    >("ALL");
    const [subFilter, setSubFilter] = useState<"ALL" | "MY">("ALL");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(
        null
    );
    const [requestMode, setRequestMode] = useState<"TO_ME" | "FROM_ME">(
        "TO_ME"
    );
    const [editForm, setEditForm] = useState({
        description: "",
        requestCode: "",
        status: "",
        recipientEmployeeId: null as number | null,
        response: "",
    });
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 9;

    const fetchEmployees = async () => {
        try {
            const employeesData = await EmployeeService.getAll();
            setRawEmployees(employeesData);
            const activePersonnelCount = (employeesData || []).filter(
                (e: EmployeeResponseDto) => e.status === "ACTIVE"
            ).length;
            const map: Record<number, string> = {};
            employeesData.forEach((emp: EmployeeResponseDto) => {
                if (emp.id) map[emp.id] = emp.name || "Unknown";
            });
            setEmployees(map);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        }
    };

    const fetchRequests = useCallback(async (pageNumber = 0) => {
        setLoading(true);
        try {
            const apiFilter: RequestFilter = {};

            // Фильтр по направлению (входящие/исходящие)
            if (requestMode === "TO_ME" && user?.department) {
                apiFilter.recipientDepartment = user.department;
            } else if (requestMode === "FROM_ME" && user?.department) {
                apiFilter.senderDepartment = user.department;
            }

            // Фильтр по статусу
            if (filter !== "ALL") {
                apiFilter.status = filter;
            }

            // Фильтр "Мои запросы" - используем isMine на бэкенде
            if (subFilter === "MY" && user?.employeeId) {
                apiFilter.isMine = true;
            }

            const response = await RequestService.getFiltered(pageNumber, pageSize, apiFilter);

            if (Array.isArray(response)) {
                setRequests(response);
                setTotalItems(response.length);
            } else if (response && typeof response === 'object') {
                const data = response.data || response.content || [];
                setRequests(data);
                // Пробуем различные названия поля для общего количества
                setTotalItems(response.totalElements ?? response.total ?? response.totalCount ?? data.length);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
            toast.error("Не удалось загрузить запросы");
        } finally {
            setLoading(false);
        }
    }, [requestMode, filter, subFilter, user?.department, user?.employeeId]);

    useEffect(() => {
        fetchRequests(page);
    }, [fetchRequests, page]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    // const requests = Array.isArray(requests)
    //     ? requests.filter((r) => {
    //         // Sub-filter (My)
    //         if (subFilter === "MY" && user?.employeeId) {
    //             if (requestMode === "TO_ME") {
    //                 return r.recipientEmployeeId === user.employeeId;
    //             } else {
    //                 return r.senderEmployeeId === user.employeeId;
    //             }
    //         }
    //         return true;
    //     })
    //     : [];

    const handleCreateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            await RequestService.create({
                recipientDepartment: formData.get("to") as string,
                requestCode: formData.get("requestCode") as string,
                description: formData.get("description") as string,
            });
            setShowCreateModal(false);
            toast.success("Запрос успешно создан");
            fetchRequests();
        } catch (error) {
            console.error("Failed to create request", error);
            toast.error("Ошибка при создании запроса");
        }
    };

    const handleSetSelfAsRecipient = async (requestId: number) => {
        if (!user?.employeeId) {
            toast.error("Ошибка: ваш ID сотрудника не найден");
            return;
        }
        try {
            await RequestService.update(requestId, {
                recipientEmployeeId: user.employeeId,
                status: "IN_PROGRESS"
            });
            toast.success("Вы назначены исполнителем");
            fetchRequests();
            if (selectedRequest?.id === requestId) {
                setSelectedRequest((prev: RequestDto | null) => prev ? { ...prev, recipientEmployeeId: user.employeeId, status: "IN_PROGRESS" } : null);
            }
        } catch (error) {
            console.error("Failed to assign recipient", error);
            toast.error("Ошибка при назначении исполнителя");
        }
    };



    const handleOpenEdit = (req: RequestDto) => {
        setSelectedRequest(req);
        setEditForm({
            description: req.description || "",
            requestCode: req.requestCode || "",
            status: req.status || "CREATED",
            recipientEmployeeId: req.recipientEmployeeId || null,
            response: req.response || "",
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedRequest?.id) return;
        try {
            await RequestService.update(selectedRequest.id, {
                description: editForm.description,
                requestCode: editForm.requestCode,
                status: editForm.status,
                recipientEmployeeId: editForm.recipientEmployeeId,
                response: editForm.response,
            });
            toast.success("Запрос обновлен");
            setShowEditModal(false);
            fetchRequests();
        } catch (error) {
            console.error("Failed to update request", error);
            toast.error("Ошибка при обновлении запроса");
        }
    };

    const getStatusColor = (status?: string) => {
        const s = status?.toUpperCase() || "";
        if (["CREATED", "NEW", "OPEN"].includes(s)) return "info";
        if (["IN_PROGRESS", "PENDING", "ACTIVE"].includes(s)) return "warning";
        if (["SOLVED", "COMPLETED", "CLOSED", "DONE", "RESOLVED"].includes(s)) return "success";
        if (s === "CANCELED" || s === "CANCELLED") return "danger";
        return "default";
    };

    return (
        <Layout currentPage="/requests">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2 font-mono text-2xl">
                            Центр управления запросами
                        </h1>
                        <p className="text-[#8B949E]">
                            Межотраслевая координация и логистика Hoxxes IV
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-[#161B22] p-1 border border-[#30363D] rounded flex gap-1">
                            <button
                                onClick={() => setRequestMode("TO_ME")}
                                className={`px-4 py-1.5 rounded text-sm transition-all ${
                                    requestMode === "TO_ME"
                                        ? "bg-[#FF6B35] text-white font-bold"
                                        : "text-[#8B949E] hover:text-[#C9D1D9]"
                                }`}
                            >
                                Входящие
                            </button>
                            <button
                                onClick={() => setRequestMode("FROM_ME")}
                                className={`px-4 py-1.5 rounded text-sm transition-all ${
                                    requestMode === "FROM_ME"
                                        ? "bg-[#FF6B35] text-white font-bold"
                                        : "text-[#8B949E] hover:text-[#C9D1D9]"
                                }`}
                            >
                                Исходящие
                            </button>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#FF6B35] text-white hover:bg-[#ff8554]"
                    >
                        <Plus size={18} className="mr-2" />
                        Создать
                    </Button>
                </div>

                {/* Filters & Sub-filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {(["ALL", "CREATED", "IN_PROGRESS", "SOLVED"] as const).map(
                            (status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
                                        filter === status 
                                            ? "bg-[#21262D] border-[#FF6B35] text-[#FF6B35]" 
                                            : "bg-transparent border-[#30363D] text-[#8B949E] hover:border-[#8B949E]"
                                    }`}
                                >
                                    {status === "ALL" ? "ВСЕ" : status === "CREATED" ? "НОВЫЕ" : status === "IN_PROGRESS" ? "В РАБОТЕ" : "РЕШЕНО"}
                                </button>
                            )
                        )}
                    </div>

                    <div className="flex gap-2 p-1 bg-[#0D1117] border border-[#30363D] rounded-lg">
                        <button
                            onClick={() => setSubFilter("ALL")}
                            className={`px-3 py-1 rounded text-xs transition-all ${
                                subFilter === "ALL" 
                                    ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20" 
                                    : "text-[#8B949E] hover:text-[#C9D1D9]"
                            }`}
                        >
                            Все отделы
                        </button>
                        <button
                            onClick={() => setSubFilter("MY")}
                            className={`px-3 py-1 rounded text-xs transition-all ${
                                subFilter === "MY" 
                                    ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20" 
                                    : "text-[#8B949E] hover:text-[#C9D1D9]"
                            }`}
                        >
                            Мои запросы
                        </button>
                    </div>
                </div>

                {/* Requests Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="animate-spin text-[#FF6B35] mb-4" size={40} />
                        <p className="text-[#8B949E] font-mono">Синхронизация данных...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requests.map((request) => (
                                <Card
                                    key={request.id}
                                    onClick={() => setSelectedRequest(request)}
                                    className="group relative border-[#30363D] bg-[#161B22] hover:border-[#FF6B35]/50 transition-all overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 ${
                                        request.status?.toUpperCase() === 'SOLVED' || request.status?.toUpperCase() === 'COMPLETED' ? 'bg-[#238636]' : 
                                        request.status?.toUpperCase() === 'IN_PROGRESS' ? 'bg-[#D29922]' : 'bg-[#1F6FEB]'
                                    } opacity-50`} />
                                    
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-mono text-[#8B949E] uppercase tracking-widest">
                                                #{request.requestCode}
                                            </span>
                                            <Badge variant={getStatusColor(request.status)}>
                                                {request.status}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-[#C9D1D9] text-base group-hover:text-[#FF6B35] transition-colors">
                                            Запрос #{request.id}
                                        </CardTitle>
                                    </CardHeader>
                                
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 py-2 px-3 bg-[#0D1117] rounded-lg border border-[#30363D]">
                                            <div className="flex-1">
                                                <div className="text-[10px] text-[#8B949E] uppercase mb-0.5">Откуда</div>
                                                <div className="text-xs text-[#C9D1D9] font-medium truncate">{request.senderDepartment}</div>
                                            </div>
                                            <ArrowRight size={14} className="text-[#30363D]" />
                                            <div className="flex-1 text-right">
                                                <div className="text-[10px] text-[#8B949E] uppercase mb-0.5">Куда</div>
                                                <div className="text-xs text-[#C9D1D9] font-medium truncate">{request.recipientDepartment}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-[#8B949E]">Отправитель:</span>
                                                <span className="text-[#C9D1D9]">{employees[request.senderEmployeeId || 0] || "Система"}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-[#8B949E]">Исполнитель:</span>
                                                <span className={`${request.recipientEmployeeId ? "text-[#FF6B35]" : "text-[#8B949E] italic"}`}>
                                                    {employees[request.recipientEmployeeId || 0] || "Не назначен"}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-[#8B949E] line-clamp-2 italic">
                                            "{request.description}"
                                        </p>

                                        {request.response && (
                                            <div className="mt-2 pt-2 border-t border-[#30363D]/50">
                                                <div className="text-[10px] text-[#8B949E] uppercase mb-1">Ответ:</div>
                                                <p className="text-xs text-[#C9D1D9] line-clamp-2">
                                                    {request.response}
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-[#30363D] flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[10px] text-[#8B949E]">
                                                <Clock size={12} />
                                                {request.createdAt ? new Date(request.createdAt).toLocaleDateString("ru-RU") : "-"}
                                            </div>

                                            {request.response && (
                                                <div className="flex items-center gap-1 text-[10px] text-[#238636]">
                                                    <span className="w-1 h-1 rounded-full bg-[#238636]"></span>
                                                    Есть ответ
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRequest(request);
                                                    }}
                                                    className="p-1.5 rounded bg-[#21262D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
                                                    title="Просмотр"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                {requestMode === "TO_ME" && request.recipientEmployeeId !== user?.employeeId && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSetSelfAsRecipient(request.id!);
                                                        }}
                                                        className="p-1.5 rounded bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20 transition-colors"
                                                        title="Назначить себя исполнителем"
                                                    >
                                                        <User size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenEdit(request);
                                                    }}
                                                    className="p-1.5 rounded bg-[#21262D] text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
                                                    title="Редактировать"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
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

                {/* Empty State */}
                {!loading && requests.length === 0 && (
                    <div className="text-center py-32 border border-dashed border-[#30363D] rounded-xl bg-[#0D1117]/50">
                        <Search className="text-[#30363D] mx-auto mb-4" size={48} />
                        <h3 className="text-[#C9D1D9] font-mono mb-1">Запросы не найдены</h3>
                        <p className="text-[#8B949E] text-sm">Попробуйте изменить параметры фильтрации</p>
                    </div>
                )}

                {/* Create Request Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Создание нового канала связи"
                >
                    <form onSubmit={handleCreateRequest} className="space-y-4 pt-2">
                        <Input
                            name="requestCode"
                            label="Идентификатор (ID)"
                            placeholder="Например: CORE-LOG-01"
                            className="bg-[#0D1117] border-[#30363D] font-mono"
                            required
                        />

                        <Input
                            name="to"
                            label="Департамент-адресат"
                            placeholder="Целевой отдел (ЛОГИСТИКА, R&D и т.д.)"
                            className="bg-[#0D1117] border-[#30363D]"
                            required
                        />

                        <Textarea
                            name="description"
                            label="Содержание запроса"
                            placeholder="Опишите суть требуемой операции..."
                            rows={5}
                            className="bg-[#0D1117] border-[#30363D] text-sm"
                            required
                        />

                        <div className="flex gap-2 justify-end mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowCreateModal(false)}
                                className="text-[#8B949E]"
                            >
                                Отмена
                            </Button>
                            <Button type="submit" className="bg-[#FF6B35] text-white">
                                Отправить в очередь
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Request Modal */}
                <Modal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title="Корректировка параметров запроса"
                >
                    <div className="space-y-4 pt-2">
                        <Input
                            label="Код запроса"
                            value={editForm.requestCode}
                            onChange={(e) => setEditForm({...editForm, requestCode: e.target.value})}
                            className="bg-[#0D1117] border-[#30363D] font-mono"
                        />

                        <div>
                            <label className="block text-xs font-mono text-[#8B949E] mb-1.5 uppercase tracking-wider">
                                Исполнитель
                            </label>
                            <select 
                                value={editForm.recipientEmployeeId || ""}
                                onChange={(e) => setEditForm({...editForm, recipientEmployeeId: e.target.value ? Number(e.target.value) : null})}
                                className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors"
                            >
                                <option value="">Не назначен</option>
                                {rawEmployees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-[#8B949E] mb-1.5 uppercase tracking-wider">
                                Статус выполнения
                            </label>
                            <select 
                                value={editForm.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                className="w-full bg-[#0D1117] border border-[#30363D] rounded px-3 py-2 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors"
                            >
                                <option value="CREATED">CREATED (Создан)</option>
                                <option value="IN_PROGRESS">IN_PROGRESS (В работе)</option>
                                <option value="SOLVED">SOLVED (Решен)</option>
                                <option value="CANCELED">CANCELED (Отклонен)</option>
                            </select>
                        </div>

                        <Textarea
                            label="Описание задачи"
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            rows={5}
                            className="bg-[#0D1117] border-[#30363D] text-sm"
                        />

                        <Textarea
                            label="Ответ на запрос"
                            value={editForm.response}
                            onChange={(e) => setEditForm({...editForm, response: e.target.value})}
                            rows={4}
                            placeholder="Введите ответ на запрос..."
                            className="bg-[#0D1117] border-[#30363D] text-sm"
                        />

                        <div className="flex gap-2 justify-end mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setShowEditModal(false)}
                                className="text-[#8B949E]"
                            >
                                Закрыть
                            </Button>
                            <Button 
                                onClick={handleSaveEdit}
                                className="bg-[#FF6B35] text-white"
                            >
                                Сохранить изменения
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Info Display Modal */}
                {selectedRequest && !showEditModal && (
                    <Modal
                        isOpen={!!selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        title={`Досье запроса #${selectedRequest.id}`}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Badge variant={getStatusColor(selectedRequest.status)}>
                                    {selectedRequest.status}
                                </Badge>
                                <span className="text-xs font-mono text-[#8B949E]">
                                    {selectedRequest.requestCode}
                                </span>
                            </div>

                            <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-lg">
                                <p className="text-[#C9D1D9] text-sm leading-relaxed">
                                    {selectedRequest.description}
                                </p>
                            </div>

                            {selectedRequest.response && (
                                <div>
                                    <div className="text-[10px] text-[#8B949E] uppercase mb-2">Ответ на запрос</div>
                                    <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                                        <p className="text-[#C9D1D9] text-sm leading-relaxed whitespace-pre-wrap">
                                            {selectedRequest.response}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-[#8B949E] uppercase mb-1">Маршрут</div>
                                        <div className="text-xs text-[#C9D1D9] flex items-center gap-2">
                                            {selectedRequest.senderDepartment} <ArrowRight size={10} /> {selectedRequest.recipientDepartment}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[#8B949E] uppercase mb-1">Дата создания</div>
                                        <div className="text-xs text-[#C9D1D9]">
                                            {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString("ru-RU") : "-"}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-[#8B949E] uppercase mb-1">Отправитель</div>
                                        <div className="text-xs text-[#C9D1D9]">
                                            {employees[selectedRequest.senderEmployeeId || 0] || "Система"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-[#8B949E] uppercase mb-1">Исполнитель</div>
                                        <div className="text-xs text-[#C9D1D9]">
                                            {employees[selectedRequest.recipientEmployeeId || 0] || "Не назначен"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                {requestMode === "TO_ME" && selectedRequest.recipientEmployeeId !== user?.employeeId && (
                                    <Button 
                                        className="flex-1 bg-[#FF6B35] text-white" 
                                        onClick={() => handleSetSelfAsRecipient(selectedRequest.id!)}
                                    >
                                        Назначить себя исполнителем
                                    </Button>
                                )}
                                 <Button 
                                     variant="secondary" 
                                     className="flex-1 border-[#30363D] text-[#C9D1D9]"
                                     onClick={() => handleOpenEdit(selectedRequest)}
                                 >
                                     Редактировать
                                 </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
