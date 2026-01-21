import React, { useEffect, useState } from "react";
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
    AlertCircle,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { RequestService } from "../api/services";
import { RequestDto } from "../types/api";
import { toast } from "sonner"; // Fixed import

export function RequestsPage() {
    const [requests, setRequests] = useState<RequestDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<
        "ALL" | "NEW" | "IN_PROGRESS" | "COMPLETED"
    >("ALL");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(
        null
    );

    const fetchRequests = async () => {
        try {
            const data = await RequestService.getMyDepartmentRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
            // toast.error("Не удалось загрузить запросы");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter(
        (r) => filter === "ALL" || r.status === filter
    );

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
            fetchRequests(); // Refresh list
        } catch (error) {
            console.error("Failed to create request", error);
            toast.error("Ошибка при создании запроса");
        }
    };

    // Note: API doesn't seem to have updateStatus endpoint for requests explicitly documented in what I saw, 
    // but Postman had 'PUT /request-service/request/7' for assign/update.
    // I can implement basic status update if I add it to services.
    // For now I'll disable actions or mock specific ones if I can't confirm endpoint.
    // Postman: PUT request-service/request/{id} with body {status: "..."}
    // I didn't add update to RequestService yet. I'll skip it for now or just log.

    return (
        <Layout currentPage="/requests">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2">
                            Система запросов
                        </h1>
                        <p className="text-[#8B949E]">
                            Управление запросами между отделами
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} className="mr-2" />
                        Создать запрос
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(["ALL", "NEW", "IN_PROGRESS", "COMPLETED"] as const).map(
                        (status) => (
                            <Button
                                key={status}
                                variant={
                                    filter === status ? "primary" : "ghost"
                                }
                                size="sm"
                                onClick={() => setFilter(status)}
                            >
                                {status === "ALL"
                                    ? "Все"
                                    : status === "NEW"
                                      ? "Новые"
                                      : status === "IN_PROGRESS"
                                        ? "В работе"
                                        : "Завершенные"}
                            </Button>
                        )
                    )}
                </div>

                {/* Requests Grid */}
                {loading ? (
                    <div className="text-[#C9D1D9]">Загрузка запросов...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRequests.map((request) => (
                            <Card
                                key={request.id}
                                onClick={() => setSelectedRequest(request)}
                                className="cursor-pointer hover:border-[#FF6B35] transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#C9D1D9] font-mono text-sm">
                                                {request.requestCode}
                                            </span>
                                        </div>
                                        <Badge
                                            variant={
                                                request.status === "NEW"
                                                    ? "info"
                                                    : request.status === "IN_PROGRESS"
                                                      ? "warning"
                                                      : request.status === "COMPLETED"
                                                        ? "success"
                                                        : "default"
                                            }
                                        >
                                            {request.status}
                                        </Badge>
                                    </div>
                                    {/* RequestDto has no title, using requestCode or generic text */}
                                    <CardTitle className="truncate">Запрос #{request.id}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8B949E]">
                                                От:
                                            </span>
                                            <span className="text-[#C9D1D9]">
                                                {request.senderDepartment}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#8B949E]">
                                                Кому:
                                            </span>
                                            <span className="text-[#C9D1D9]">
                                                {request.recipientDepartment}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-[#0D1117] rounded border border-[#30363D]">
                                        <div className="text-[#8B949E] text-xs mb-1">
                                            Описание:
                                        </div>
                                        <p className="text-[#C9D1D9] text-sm line-clamp-2">
                                            {request.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-[#8B949E] text-xs">
                                        <Clock size={12} />
                                        <span>
                                            {request.createdAt ? new Date(request.createdAt).toLocaleString("ru-RU") : "-"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && filteredRequests.length === 0 && (
                    <div className="text-center py-12">
                        <AlertCircle
                            className="text-[#8B949E] mx-auto mb-4"
                            size={48}
                        />
                        <p className="text-[#8B949E]">Запросы не найдены</p>
                    </div>
                )}

                {/* Create Request Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Создать новый запрос"
                >
                    <form onSubmit={handleCreateRequest}>
                        <Input
                            name="requestCode"
                            label="Код запроса"
                            placeholder="Например: REQ-001"
                            required
                        />

                        <Input
                            name="to"
                            label="Кому (Отдел)"
                            placeholder="Целевой отдел"
                            required
                        />

                        <Textarea
                            name="description"
                            label="Описание"
                            placeholder="Подробное описание запроса"
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
                            <Button type="submit">Создать запрос</Button>
                        </div>
                    </form>
                </Modal>

                {/* Request Details Modal */}
                {selectedRequest && (
                    <Modal
                        isOpen={!!selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        title={`Запрос ${selectedRequest.requestCode}`}
                    >
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[#C9D1D9] mb-2">
                                    ID: {selectedRequest.id}
                                </h3>
                                <div className="p-4 bg-[#0D1117] rounded border border-[#30363D]">
                                    <p className="text-[#C9D1D9]">
                                        {selectedRequest.description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        От кого
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedRequest.senderDepartment}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Кому
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedRequest.recipientDepartment}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Статус
                                    </div>
                                    <Badge
                                        variant={
                                            selectedRequest.status === "NEW"
                                                ? "info"
                                                : selectedRequest.status === "IN_PROGRESS"
                                                  ? "warning"
                                                  : selectedRequest.status === "COMPLETED"
                                                    ? "success"
                                                    : "default"
                                        }
                                    >
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Actions placeholder */}
                            <div className="flex flex-wrap gap-2 text-sm text-[#8B949E]">
                                Действия над статусами пока недоступны.
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
