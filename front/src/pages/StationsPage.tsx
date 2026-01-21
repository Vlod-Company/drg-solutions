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
import { Modal } from "../components/ui/Modal";
import {
    Building2,
    Users,
    Package,
    AlertTriangle,
    Shield,
    Wrench,
    Plus,
} from "lucide-react";
import { StationService, EcosystemService } from "../api/services";
import { Station, PlanetDto } from "../types/api";
import { Input, Select } from "../components/ui/Input";
import { toast } from "sonner";

export function StationsPage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStation, setSelectedStation] = useState<Station | null>(
        null
    );
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [planets, setPlanets] = useState<PlanetDto[]>([]);

    const fetchStations = async () => {
        try {
            const data = await StationService.getAll();
            setStations(data);
        } catch (error) {
            console.error("Failed to fetch stations", error);
            // toast.error("Не удалось загрузить станции");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
        
        const fetchPlanets = async () => {
            try {
                 const data = await EcosystemService.getAllPlanets();
                 setPlanets(data);
            } catch (e) { console.error("Failed to fetch planets", e); }
        };
        fetchPlanets();
    }, []);

    const handleCreateStation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await StationService.create({
                name: formData.get("name") as string,
                type: formData.get("type") as string,
                planetId: Number(formData.get("planetId")),
            });
            toast.success("Станция создана");
            setShowCreateModal(false);
            fetchStations();
        } catch (e) {
            console.error(e);
            toast.error("Ошибка при создании станции");
        }
    };

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

    const handleEmergencyResponse = async (stationId: number, action: string) => {
        try {
            if (action === "Активация защиты") {
                await StationService.setAttacked(stationId, { isAttacked: true });
                toast.success(`Статус атаки обновлен для станции ${stationId}`);
                fetchStations();
            } else {
                toast.info(`Действие "${action}" пока не реализовано API`);
            }
        } catch (error) {
            console.error("Error executing action", error);
            toast.error("Ошибка при выполнении действия");
        }
    };
    
    // Helper to extract planet/resources if they exist or show placeholders
    // Since we don't know exact Station fields from API completely (view failed), 
    // we use optional chaining and defaults.
    const getPlanet = (s: Station) => (s as any).planet || "Неизвестно";
    const getResources = (s: Station) => (s as any).resources || [];
    const getCrew = (s: Station) => (s as any).currentCrew || 0;
    const getCapacity = (s: Station) => (s as any).capacity || 100;

    return (
        <Layout currentPage="/stations">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2">
                            Управление станциями
                        </h1>
                        <p className="text-[#8B949E]">
                            Мониторинг и управление космическими станциями
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                         <Plus size={18} className="mr-2" />
                         Создать станцию
                    </Button>
                </div>

                {/* Stats */}
                {!loading && (
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
                )}

                {/* Stations Grid */}
                {loading ? (
                    <div className="text-[#C9D1D9]">Загрузка станций...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stations.map((station) => (
                            <Card
                                key={station.id}
                                onClick={() => setSelectedStation(station)}
                                className="cursor-pointer hover:border-[#FF6B35] transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(station.status)}
                                            <span className="text-[#C9D1D9] font-mono text-sm">
                                                ID: {station.id}
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
                                    <CardTitle className="truncate">{station.name || `Station ${station.id}`}</CardTitle>
                                    <div className="text-[#8B949E] text-sm">
                                        {/* Type might not exist on API Station */ }
                                        Тип: {(station as any).type || "Стандартный"}
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
                                                {(station as any).planet || `Планета ID: ${station.planetId || "?"}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users
                                                size={14}
                                                className="text-[#8B949E]"
                                            />
                                            <span className="text-[#C9D1D9]">
                                                Экипаж: {getCrew(station)}/
                                                {getCapacity(station)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && stations.length === 0 && (
                     <div className="text-center py-12 text-[#8B949E]">
                         Станции не найдены
                     </div>
                )}

                {/* Create Station Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Создание новой станции"
                >
                    <form onSubmit={handleCreateStation}>
                        <Input
                            name="name"
                            label="Название станции"
                            placeholder="Станция 'Alpha'"
                            required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                name="planetId"
                                label="Планета"
                                options={planets.map(p => ({ value: String(p.id), label: p.name || `Планета ${p.id}` }))}
                                required
                            />
                            <Select
                                name="type"
                                label="Тип"
                                options={[
                                    { value: "MINING", label: "Добывающая" },
                                    { value: "RESEARCH", label: "Исследовательская" },
                                    { value: "DEFENSE", label: "Оборонительная" },
                                ]}
                                required
                            />
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Отмена
                            </Button>
                            <Button type="submit">Создать</Button>
                        </div>
                    </form>
                </Modal>

                {/* Station Details Modal */}
                {selectedStation && (
                    <Modal
                        isOpen={!!selectedStation}
                        onClose={() => setSelectedStation(null)}
                        title={selectedStation.name || `Station ${selectedStation.id}`}
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
                                                    selectedStation.id as number,
                                                    "Активация защиты",
                                                )
                                            }
                                        >
                                            Активировать защиту
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

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Button variant="primary">Подробности</Button>
                                {selectedStation.status === "OPERATIONAL" && (
                                    <Button variant="secondary">
                                        <Wrench size={18} className="mr-2" />
                                        Плановое обслуживание
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
