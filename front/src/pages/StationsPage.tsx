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
    Globe,
} from "lucide-react";
import { StationService, EcosystemService, StoreService } from "../api/services";
import { Station, PlanetDto, ItemResponseDTO, DeliveryPointResponseDTO } from "../types/api";
import { Input, Select } from "../components/ui/Input";
import { toast } from "sonner";

export function StationsPage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStation, setSelectedStation] = useState<Station | null>(
        null
    );
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        status: "ACTIVE"
    });
    const [planets, setPlanets] = useState<PlanetDto[]>([]);
    const [resourcesMap, setResourcesMap] = useState<Record<number, ItemResponseDTO[]>>({});

    const fetchStations = async () => {
        try {
            setLoading(true);
            const data = await StationService.getAll();
            setStations(data);

            // Fetch resources from store-service
            for (const station of data) {
                if (station.deliveryPointId) {
                    try {
                        const responses: DeliveryPointResponseDTO[] = await StoreService.findItemsInDeliveryPoint(station.deliveryPointId);
                        const allItems = responses.flatMap(r => r.data || []);
                        
                        if (allItems.length > 0) {
                            setResourcesMap((prev: Record<number, ItemResponseDTO[]>) => ({
                                ...prev,
                                [station.id!]: allItems
                            }));
                        }
                    } catch (err) {
                        console.error(`Failed to fetch resources for station ${station.id}`, err);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch stations", error);
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
            } catch (e: any) { console.error("Failed to fetch planets", e); }
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
        const s = status?.toUpperCase().trim();
        switch (s) {
            case "ACTIVE":
                return <Shield className="text-[#56C271]" size={18} />;
            case "UNDER_ATTACK":
                return <AlertTriangle className="text-[#D32F2F]" size={18} />;
            case "UNDER_CONSTRUCTION":
                return <Wrench className="text-[#FF6B35]" size={18} />;
            case "DESIGNED":
                return <Building2 className="text-[#4FC3F7]" size={18} />;
            case "CANCELED":
                return <AlertTriangle className="text-[#8B949E]" size={18} />;
            case "DECOMMISSIONED":
                return <Building2 className="text-[#8B949E]" size={18} />;
            default:
                return <Building2 className="text-[#8B949E]" size={18} />;
        }
    };

    const handleEmergencyResponse = async (stationId: number, action: string) => {
        try {
            if (action === "Активация защиты") {
                await StationService.setAttacked(stationId, { description: "Активация экстренных протоколов защиты" });
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

    const handleOpenEdit = (station: Station) => {
        setSelectedStation(station);
        setEditForm({
            status: station.status || "ACTIVE"
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStation?.id) return;
        
        try {
            await StationService.changeStatus(selectedStation.id, {
                status: editForm.status
            });
            
            toast.success("Статус станции обновлен");
            setShowEditModal(false);
            fetchStations();
            setSelectedStation(null);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Ошибка при обновлении статуса");
        }
    };
    
    // Helper to extract planet name
    const getPlanetName = (id?: number) => {
        if (!id) return "Неизвестно";
        const planet = planets.find((p: PlanetDto) => p.id === id);
        return planet?.name || `Планета ID: ${id}`;
    };

    const getStationResources = (stationId?: number) => 
        stationId ? resourcesMap[stationId] || [] : [];

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
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        {[
                            {
                                status: "ACTIVE",
                                label: "ACTIVE",
                                count: stations.filter(
                                    (s: Station) => s.status?.toUpperCase().trim() === "ACTIVE",
                                ).length,
                                color: "bg-[#56C271]",
                            },
                            {
                                status: "UNDER_ATTACK",
                                label: "UNDER_ATTACK",
                                count: stations.filter(
                                    (s: Station) => s.status?.toUpperCase().trim() === "UNDER_ATTACK",
                                ).length,
                                color: "bg-[#D32F2F]",
                            },
                            {
                                status: "UNDER_CONSTRUCTION",
                                label: "UNDER_CONSTRUCTION",
                                count: stations.filter(
                                    (s: Station) => s.status?.toUpperCase().trim() === "UNDER_CONSTRUCTION",
                                ).length,
                                color: "bg-[#FF6B35]",
                            },
                            {
                                status: "DESIGNED",
                                label: "DESIGNED",
                                count: stations.filter(
                                    (s: Station) => s.status?.toUpperCase().trim() === "DESIGNED",
                                ).length,
                                color: "bg-[#4FC3F7]",
                            },
                            {
                                status: "CANCELED",
                                label: "CANCELED",
                                count: stations.filter(
                                    (s: Station) => s.status?.toUpperCase().trim() === "CANCELED",
                                ).length,
                                color: "bg-[#8B949E]",
                            },
                            {
                                status: "DECOMMISSIONED",
                                label: "DECOMMISSIONED",
                                count: stations.filter(
                                    (s: Station) => s.status?.toUpperCase().trim() === "DECOMMISSIONED",
                                ).length,
                                color: "bg-[#161B22] border border-[#30363D]",
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
                        {stations.map((station: Station) => (
                            <Card
                                key={station.id}
                                onClick={() => setSelectedStation(station)}
                                className="group relative border-[#30363D] bg-[#161B22] hover:border-[#FF6B35]/50 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(station.status)}
                                            <span className="text-[#8B949E] font-mono text-[10px] uppercase tracking-wider">
                                                ID: {station.id}
                                            </span>
                                        </div>
                                        <Badge
                                            variant={
                                                station.status === "ACTIVE"
                                                    ? "success"
                                                    : station.status === "UNDER_ATTACK"
                                                      ? "danger"
                                                      : station.status === "UNDER_CONSTRUCTION"
                                                        ? "warning"
                                                        : station.status === "DESIGNED"
                                                          ? "info"
                                                          : "default"
                                            }
                                        >
                                            {station.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-[#C9D1D9] group-hover:text-[#FF6B35] transition-colors truncate">
                                        {station.name || `Station ${station.id}`}
                                    </CardTitle>
                                    <div className="text-[#8B949E] text-sm flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-[9px] uppercase font-mono border-[#30363D]">
                                            {station.type === "MINING" ? "Добывающая" : 
                                             station.type === "MILITARY" ? "Военная" : 
                                             station.type === "COMMUNICATION" ? "Связь" : station.type || "Стандартный"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-1.5 text-sm text-[#C9D1D9]">
                                            <Globe size={14} className="text-[#FF6B35]" />
                                            <span>{getPlanetName(station.planetId)}</span>
                                        </div>

                                        {getStationResources(station.id).length > 0 && (
                                            <div className="pt-3 border-t border-[#30363D]">
                                                <div className="flex flex-wrap gap-1">
                                                    {getStationResources(station.id).slice(0, 3).map((res: ItemResponseDTO, i: number) => (
                                                        <Badge key={i} variant="default" className="text-[9px] py-0 px-1.5 opacity-70">
                                                            {res.itemName}
                                                        </Badge>
                                                    ))}
                                                    {getStationResources(station.id).length > 3 && (
                                                        <span className="text-[9px] text-[#8B949E] ml-1">
                                                            +{getStationResources(station.id).length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
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
                                    { value: "MILITARY", label: "Военная" },
                                    { value: "COMMUNICATION", label: "Связь" },
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
                        title="Информация о станции"
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
                                    <div className="text-[#8B949E] text-sm mb-2 uppercase tracking-wider font-mono">
                                        Планета
                                    </div>
                                    <div className="text-[#C9D1D9] flex items-center gap-2">
                                        <Package size={14} className="text-[#FF6B35]" />
                                        {getPlanetName(selectedStation.planetId)}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2 uppercase tracking-wider font-mono">
                                        Тип станции
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {selectedStation.type === "MINING" ? "Добывающая" : 
                                         selectedStation.type === "MILITARY" ? "Военная" : 
                                         selectedStation.type === "COMMUNICATION" ? "Связь" : selectedStation.type || "Стандартный"}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2 uppercase tracking-wider font-mono">
                                        ID Системы
                                    </div>
                                    <div className="text-[#C9D1D9] font-mono">
                                        {selectedStation.id}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2 uppercase tracking-wider font-mono">
                                        Текущий статус
                                    </div>
                                    <Badge
                                        variant={
                                            selectedStation.status ===
                                            "ACTIVE"
                                                ? "success"
                                                : selectedStation.status ===
                                                    "UNDER_ATTACK"
                                                  ? "danger"
                                                  : selectedStation.status ===
                                                      "UNDER_CONSTRUCTION"
                                                    ? "warning"
                                                    : selectedStation.status ===
                                                        "DESIGNED"
                                                      ? "info"
                                                      : "default"
                                        }
                                    >
                                        {selectedStation.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Resources Section */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="text-[#FF6B35]" size={18} />
                                    <div className="text-[#C9D1D9] text-sm font-bold uppercase tracking-wider font-mono">
                                        Запасы станции
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getStationResources(selectedStation.id).length > 0 ? (
                                        getStationResources(selectedStation.id).map((res: ItemResponseDTO, i: number) => (
                                            <Badge key={i} variant="warning" className="font-mono">
                                                {res.itemName} {res.itemQuantity ? `x${res.itemQuantity}` : ""}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-[#8B949E] text-xs italic">Склад пуст или данные недоступны</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Button 
                                    variant="primary"
                                    onClick={() => handleOpenEdit(selectedStation)}
                                >
                                    Редактировать
                                </Button>
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

                {selectedStation && (
                    <Modal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        title="Изменение статуса станции"
                    >
                        <form onSubmit={handleSaveEdit}>
                            <div className="mb-4">
                                <h3 className="text-[#C9D1D9] font-mono mb-2">
                                    Станция: {selectedStation.name || `ID ${selectedStation.id}`}
                                </h3>
                                <p className="text-[#8B949E] text-sm">
                                    Вы можете изменить только текущий статус станции.
                                </p>
                            </div>

                            <Select
                                label="Новый статус"
                                value={editForm.status}
                                options={[
                                    { value: "ACTIVE", label: "ACTIVE" },
                                    { value: "UNDER_ATTACK", label: "UNDER_ATTACK" },
                                    { value: "UNDER_CONSTRUCTION", label: "UNDER_CONSTRUCTION" },
                                    { value: "DESIGNED", label: "DESIGNED" },
                                    { value: "CANCELED", label: "CANCELED" },
                                    { value: "DECOMMISSIONED", label: "DECOMMISSIONED" },
                                ]}
                                onChange={(e) => setEditForm({ status: e.target.value })}
                                required
                            />

                            <div className="flex gap-2 justify-end mt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Отмена
                                </Button>
                                <Button type="submit">Применить</Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
