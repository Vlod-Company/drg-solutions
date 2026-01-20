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
import { Modal } from "../components/ui/Modal";
import {
    Building2,
    Users,
    Package,
    AlertTriangle,
    Shield,
    Wrench,
} from "lucide-react";
import { mockStations } from "../data/mockData";
import { Station } from "../types";
import { toast } from "sonner@2.0.3";

export function StationsPage() {
    const [stations, setStations] = useState<Station[]>(mockStations);
    const [selectedStation, setSelectedStation] = useState<Station | null>(
        null,
    );

    const getStatusIcon = (status: Station["status"]) => {
        switch (status) {
            case "OPERATIONAL":
                return <Shield className="text-[#56C271]" size={18} />;
            case "UNDER_ATTACK":
                return <AlertTriangle className="text-[#D32F2F]" size={18} />;
            case "UNDER_CONSTRUCTION":
                return <Wrench className="text-[#FF6B35]" size={18} />;
            case "PLANNED":
                return <Building2 className="text-[#4FC3F7]" size={18} />;
            default:
                return <Building2 className="text-[#8B949E]" size={18} />;
        }
    };

    const handleEmergencyResponse = (stationId: string, action: string) => {
        toast.success(`Действие "${action}" выполнено для станции`);
        // В реальном приложении здесь был бы API вызов
    };

    return (
        <Layout currentPage="/stations">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[#C9D1D9] mb-2">
                        Управление станциями
                    </h1>
                    <p className="text-[#8B949E]">
                        Мониторинг и управление космическими станциями
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    {[
                        {
                            status: "OPERATIONAL",
                            label: "Рабочие",
                            count: stations.filter(
                                (s) => s.status === "OPERATIONAL",
                            ).length,
                            color: "bg-[#56C271]",
                        },
                        {
                            status: "UNDER_ATTACK",
                            label: "Под атакой",
                            count: stations.filter(
                                (s) => s.status === "UNDER_ATTACK",
                            ).length,
                            color: "bg-[#D32F2F]",
                        },
                        {
                            status: "UNDER_CONSTRUCTION",
                            label: "Строятся",
                            count: stations.filter(
                                (s) => s.status === "UNDER_CONSTRUCTION",
                            ).length,
                            color: "bg-[#FF6B35]",
                        },
                        {
                            status: "PLANNED",
                            label: "Запланированы",
                            count: stations.filter(
                                (s) => s.status === "PLANNED",
                            ).length,
                            color: "bg-[#4FC3F7]",
                        },
                        {
                            status: "DECOMMISSIONED",
                            label: "Выведены",
                            count: stations.filter(
                                (s) => s.status === "DECOMMISSIONED",
                            ).length,
                            color: "bg-[#8B949E]",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.status}
                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg"
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${stat.color} mb-2`}
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

                {/* Stations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stations.map((station) => (
                        <Card
                            key={station.id}
                            onClick={() => setSelectedStation(station)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(station.status)}
                                        <span className="text-[#C9D1D9] font-mono text-sm">
                                            {station.id}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={
                                            station.status === "OPERATIONAL"
                                                ? "success"
                                                : station.status ===
                                                    "UNDER_ATTACK"
                                                  ? "danger"
                                                  : station.status ===
                                                      "UNDER_CONSTRUCTION"
                                                    ? "warning"
                                                    : station.status ===
                                                        "PLANNED"
                                                      ? "info"
                                                      : "default"
                                        }
                                    >
                                        {station.status}
                                    </Badge>
                                </div>
                                <CardTitle>{station.name}</CardTitle>
                                <div className="text-[#8B949E] text-sm">
                                    {station.type}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Package
                                            size={14}
                                            className="text-[#8B949E]"
                                        />
                                        <span className="text-[#C9D1D9]">
                                            {station.planet}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users
                                            size={14}
                                            className="text-[#8B949E]"
                                        />
                                        <span className="text-[#C9D1D9]">
                                            Экипаж: {station.currentCrew}/
                                            {station.capacity}
                                        </span>
                                    </div>
                                    {station.resources.length > 0 && (
                                        <div className="mt-2">
                                            <div className="text-[#8B949E] text-xs mb-1">
                                                Ресурсы:
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {station.resources
                                                    .slice(0, 3)
                                                    .map((resource) => (
                                                        <Badge
                                                            key={resource}
                                                            variant="default"
                                                        >
                                                            {resource}
                                                        </Badge>
                                                    ))}
                                                {station.resources.length >
                                                    3 && (
                                                    <Badge variant="default">
                                                        +
                                                        {station.resources
                                                            .length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Station Details Modal */}
                {selectedStation && (
                    <Modal
                        isOpen={!!selectedStation}
                        onClose={() => setSelectedStation(null)}
                        title={selectedStation.name}
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Alert for stations under attack */}
                            {selectedStation.status === "UNDER_ATTACK" && (
                                <div className="p-4 bg-[#D32F2F] bg-opacity-10 border-2 border-[#D32F2F] rounded-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <AlertTriangle
                                            className="text-[#D32F2F]"
                                            size={24}
                                        />
                                        <div>
                                            <h3 className="text-[#D32F2F]">
                                                КРИТИЧЕСКАЯ СИТУАЦИЯ
                                            </h3>
                                            <p className="text-[#C9D1D9] text-sm">
                                                Станция подвергается атаке!
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                                handleEmergencyResponse(
                                                    selectedStation.id,
                                                    "Активация защиты",
                                                )
                                            }
                                        >
                                            Активировать защиту
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() =>
                                                handleEmergencyResponse(
                                                    selectedStation.id,
                                                    "Возврат команд",
                                                )
                                            }
                                        >
                                            Вернуть команды
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() =>
                                                handleEmergencyResponse(
                                                    selectedStation.id,
                                                    "Запрос помощи",
                                                )
                                            }
                                        >
                                            Запросить помощь
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Station Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        ID станции
                                    </div>
                                    <div className="text-[#C9D1D9] font-mono">
                                        {selectedStation.id}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Тип
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedStation.type}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Планета
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedStation.planet}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Статус
                                    </div>
                                    <Badge
                                        variant={
                                            selectedStation.status ===
                                            "OPERATIONAL"
                                                ? "success"
                                                : selectedStation.status ===
                                                    "UNDER_ATTACK"
                                                  ? "danger"
                                                  : selectedStation.status ===
                                                      "UNDER_CONSTRUCTION"
                                                    ? "warning"
                                                    : selectedStation.status ===
                                                        "PLANNED"
                                                      ? "info"
                                                      : "default"
                                        }
                                    >
                                        {selectedStation.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Crew Capacity */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-[#8B949E]">Экипаж</div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedStation.currentCrew}/
                                        {selectedStation.capacity}
                                    </div>
                                </div>
                                <div className="w-full bg-[#0D1117] rounded-full h-2">
                                    <div
                                        className="bg-[#FF6B35] h-2 rounded-full transition-all"
                                        style={{
                                            width: `${(selectedStation.currentCrew / selectedStation.capacity) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Resources */}
                            {selectedStation.resources.length > 0 && (
                                <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] mb-3">
                                        Добываемые ресурсы
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStation.resources.map(
                                            (resource) => (
                                                <Badge
                                                    key={resource}
                                                    variant="info"
                                                >
                                                    {resource}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Last Inspection */}
                            {selectedStation.lastInspection && (
                                <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] mb-1">
                                        Последняя инспекция
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {new Date(
                                            selectedStation.lastInspection,
                                        ).toLocaleDateString("ru-RU")}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Button variant="primary">Подробности</Button>
                                {selectedStation.status === "OPERATIONAL" && (
                                    <Button variant="secondary">
                                        <Wrench size={18} className="mr-2" />
                                        Плановое обслуживание
                                    </Button>
                                )}
                                {selectedStation.status ===
                                    "UNDER_CONSTRUCTION" && (
                                    <Button variant="success">
                                        Согласовать проект
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
