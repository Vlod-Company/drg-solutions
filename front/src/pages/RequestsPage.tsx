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
import { Input, Select, Textarea } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import {
    AlertCircle,
    Plus,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { mockRequests } from "../data/mockData";
import { Request } from "../types";
import { toast } from "sonner@2.0.3";

export function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>(mockRequests);
    const [filter, setFilter] = useState<
        "ALL" | "NEW" | "IN_PROGRESS" | "COMPLETED"
    >("ALL");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(
        null,
    );

    const filteredRequests = requests.filter(
        (r) => filter === "ALL" || r.status === filter,
    );

    const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newRequest: Request = {
            id: `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            type: formData.get("type") as string,
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            from: formData.get("from") as string,
            to: formData.get("to") as string,
            status: "NEW",
            priority: formData.get("priority") as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setRequests([newRequest, ...requests]);
        setShowCreateModal(false);
        toast.success("Запрос успешно создан");
    };

    const handleUpdateStatus = (id: string, newStatus: Request["status"]) => {
        setRequests(
            requests.map((r) =>
                r.id === id
                    ? {
                          ...r,
                          status: newStatus,
                          updatedAt: new Date().toISOString(),
                      }
                    : r,
            ),
        );
        toast.success("Статус запроса обновлен");
    };

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
                        ),
                    )}
                </div>

                {/* Requests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRequests.map((request) => (
                        <Card
                            key={request.id}
                            onClick={() => setSelectedRequest(request)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {request.priority === "CRITICAL" && (
                                            <AlertCircle
                                                className="text-[#D32F2F]"
                                                size={18}
                                            />
                                        )}
                                        <span className="text-[#C9D1D9] font-mono text-sm">
                                            {request.id}
                                        </span>
                                    </div>
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
                                <CardTitle>{request.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8B949E]">
                                            От:
                                        </span>
                                        <span className="text-[#C9D1D9]">
                                            {request.from}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8B949E]">
                                            Кому:
                                        </span>
                                        <span className="text-[#C9D1D9]">
                                            {request.to}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#8B949E]">
                                            Приоритет:
                                        </span>
                                        <Badge
                                            variant={
                                                request.priority === "CRITICAL"
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
                                </div>
                                <p className="text-[#8B949E] text-sm line-clamp-2">
                                    {request.description}
                                </p>
                                <div className="flex items-center gap-2 mt-3 text-[#8B949E] text-xs">
                                    <Clock size={12} />
                                    <span>
                                        {new Date(
                                            request.createdAt,
                                        ).toLocaleString("ru-RU")}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredRequests.length === 0 && (
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
                        <Select
                            name="type"
                            label="Тип запроса"
                            options={[
                                { value: "SABOTAGE", label: "Саботаж" },
                                { value: "RESEARCH", label: "Исследование" },
                                { value: "STATION", label: "Станция" },
                                { value: "EQUIPMENT", label: "Оборудование" },
                                { value: "OTHER", label: "Другое" },
                            ]}
                            required
                        />

                        <Input
                            name="title"
                            label="Название"
                            placeholder="Краткое описание запроса"
                            required
                        />

                        <Textarea
                            name="description"
                            label="Описание"
                            placeholder="Подробное описание запроса"
                            required
                        />

                        <Input
                            name="from"
                            label="От кого"
                            placeholder="Отдел или станция"
                            required
                        />

                        <Input
                            name="to"
                            label="Кому"
                            placeholder="Целевой отдел"
                            required
                        />

                        <Select
                            name="priority"
                            label="Приоритет"
                            options={[
                                { value: "LOW", label: "Низкий" },
                                { value: "MEDIUM", label: "Средний" },
                                { value: "HIGH", label: "Высокий" },
                                { value: "CRITICAL", label: "Критический" },
                            ]}
                            required
                        />

                        <div className="flex gap-2 justify-end">
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
                        title={`Запрос ${selectedRequest.id}`}
                    >
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[#C9D1D9] mb-2">
                                    {selectedRequest.title}
                                </h3>
                                <p className="text-[#8B949E]">
                                    {selectedRequest.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        От кого
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedRequest.from}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Кому
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedRequest.to}
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
                                                : selectedRequest.status ===
                                                    "IN_PROGRESS"
                                                  ? "warning"
                                                  : selectedRequest.status ===
                                                      "COMPLETED"
                                                    ? "success"
                                                    : "default"
                                        }
                                    >
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="text-[#8B949E] text-sm mb-1">
                                        Приоритет
                                    </div>
                                    <Badge
                                        variant={
                                            selectedRequest.priority ===
                                            "CRITICAL"
                                                ? "danger"
                                                : selectedRequest.priority ===
                                                    "HIGH"
                                                  ? "warning"
                                                  : "default"
                                        }
                                    >
                                        {selectedRequest.priority}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {selectedRequest.status === "NEW" && (
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            handleUpdateStatus(
                                                selectedRequest.id,
                                                "IN_PROGRESS",
                                            );
                                            setSelectedRequest(null);
                                        }}
                                    >
                                        <Clock size={18} className="mr-2" />
                                        Начать работу
                                    </Button>
                                )}
                                {selectedRequest.status === "IN_PROGRESS" && (
                                    <Button
                                        variant="success"
                                        onClick={() => {
                                            handleUpdateStatus(
                                                selectedRequest.id,
                                                "COMPLETED",
                                            );
                                            setSelectedRequest(null);
                                        }}
                                    >
                                        <CheckCircle2
                                            size={18}
                                            className="mr-2"
                                        />
                                        Завершить
                                    </Button>
                                )}
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        handleUpdateStatus(
                                            selectedRequest.id,
                                            "CANCELLED",
                                        );
                                        setSelectedRequest(null);
                                    }}
                                >
                                    <XCircle size={18} className="mr-2" />
                                    Отменить
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
