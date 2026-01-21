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
    Target,
    Users,
    AlertTriangle,
    MapPin,
    Calendar,
    Rocket,
    Plus,
} from "lucide-react";
import { MissionService, EcosystemService, TeamService } from "../api/services";
import { MissionDto, BiomeDto, TeamDto } from "../types/api";
import { Input, Select, Textarea } from "../components/ui/Input";
import { toast } from "sonner";

export function MissionsPage() {
    const [missions, setMissions] = useState<MissionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMission, setSelectedMission] = useState<MissionDto | null>(
        null
    );
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [biomes, setBiomes] = useState<BiomeDto[]>([]);
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [filter, setFilter] = useState<
        "ALL" | "PLANNED" | "ACTIVE" | "COMPLETED"
    >("ALL");

    const fetchMissions = async () => {
        try {
            const response = await MissionService.getAll(0, 50);
            if (response.data) {
                setMissions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch missions:", error);
            // toast.error("Не удалось загрузить миссии");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
        
        const fetchBiomes = async () => {
             try {
                const biomesData = await EcosystemService.getAllBiomes();
                setBiomes(biomesData);
             } catch (e) {
                 console.error("Failed to fetch biomes", e);
             }
        };

        const fetchTeams = async () => {
             try {
                const teamsData = await TeamService.getAll();
                setTeams(teamsData);
             } catch (e) {
                 console.error("Failed to fetch teams", e);
             }
        };

        fetchBiomes();
        fetchTeams();
    }, []);

    const handleCreateMission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            await MissionService.create({
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                biomeId: Number(formData.get("biomeId")),
                teamId: Number(formData.get("teamId")),
                requiredExperience: Number(formData.get("requiredExperience")),
                missionStart: formData.get("missionStart") ? new Date(formData.get("missionStart") as string).toISOString() : undefined,
            });
            toast.success("Миссия создана");
            setShowCreateModal(false);
            fetchMissions();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при создании миссии");
        }
    };

    const filteredMissions = missions.filter((m) => {
        if (filter === "ALL") return true;
        const s = m.status?.toUpperCase().trim();
        if (filter === "PLANNED") return s === "PLANNED" || s === "CREATED" || s === "NEW";
        if (filter === "ACTIVE") return s === "ACTIVE" || s === "IN_PROGRESS" || s === "STARTED";
        if (filter === "COMPLETED") return s === "COMPLETED" || s === "FINISHED" || s === "SUCCESS";
        return s === filter;
    });

    const getDangerStars = (xp: number) => {
        // Map required XP to danger stars (dummy logic)
        const level = Math.min(5, Math.ceil((xp || 0) / 10));
        return "⚠️".repeat(level || 1);
    };

    return (
        <Layout currentPage="/missions">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2">Управление миссиями</h1>
                        <p className="text-[#8B949E]">
                            Планирование и мониторинг операций на Hoxxes IV
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} className="mr-2" />
                        Создать миссию
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(["ALL", "PLANNED", "ACTIVE", "COMPLETED"] as const).map(
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
                                    : status === "PLANNED"
                                      ? "Запланированные"
                                      : status === "ACTIVE"
                                        ? "Активные"
                                        : "Завершенные"}
                            </Button>
                        )
                    )}
                </div>

                {/* Missions Grid */}
                {loading ? (
                    <div className="text-[#C9D1D9]">Загрузка миссий...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredMissions.map((mission) => (
                            <Card
                                key={mission.id}
                                onClick={() => setSelectedMission(mission)}
                                className="cursor-pointer hover:border-[#FF6B35] transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">
                                                🎯
                                            </span>
                                            <span className="text-[#C9D1D9] font-mono text-sm">
                                                ID: {mission.id}
                                            </span>
                                        </div>
                                        <Badge
                                            variant={
                                                ["ACTIVE", "IN_PROGRESS", "STARTED"].includes(mission.status?.toUpperCase() || "")
                                                    ? "warning"
                                                    : ["COMPLETED", "FINISHED", "SUCCESS"].includes(mission.status?.toUpperCase() || "")
                                                      ? "success"
                                                      : "info"
                                            }
                                        >
                                            {mission.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="truncate">{mission.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin
                                                size={14}
                                                className="text-[#8B949E]"
                                            />
                                            <span className="text-[#C9D1D9]">
                                                Биом ID: {mission.biomeId}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users
                                                size={14}
                                                className="text-[#8B949E]"
                                            />
                                            <span className="text-[#C9D1D9]">
                                                Команда ID: {mission.teamId}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <AlertTriangle
                                                size={14}
                                                className="text-[#8B949E]"
                                            />
                                            <span className="text-[#C9D1D9]">
                                                Опыт:{" "}
                                                {mission.requiredExperience}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-[#0D1117] rounded border border-[#30363D]">
                                        <div className="text-[#8B949E] text-xs mb-1">
                                            Описание:
                                        </div>
                                        <div className="text-[#C9D1D9] text-sm line-clamp-2">
                                            {mission.description}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Mission Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Создание новой миссии"
                >
                    <form onSubmit={handleCreateMission}>
                        <Input
                            name="name"
                            label="Название миссии"
                            placeholder="Операция 'Глубокое погружение'"
                            required
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                name="biomeId"
                                label="Биом"
                                options={biomes.map(b => ({ value: String(b.id), label: b.name || `Биом ${b.id}` }))}
                                required
                            />
                            <Select
                                name="teamId"
                                label="Команда"
                                options={teams.map(t => ({ value: String(t.id), label: t.name || `Команда ${t.id}` }))}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="requiredExperience"
                                type="number"
                                label="Треб. опыт"
                                placeholder="0"
                            />
                             <Input
                                name="missionStart"
                                type="datetime-local"
                                label="Начало миссии"
                            />
                        </div>

                        <Textarea
                            name="description"
                            label="Описание"
                            placeholder="Цели и задачи миссии..."
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
                            <Button type="submit">Создать</Button>
                        </div>
                    </form>
                </Modal>

                {/* Mission Details Modal */}
                {selectedMission && (
                    <Modal
                        isOpen={!!selectedMission}
                        onClose={() => setSelectedMission(null)}
                        title={`Миссия ${selectedMission.id}`}
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Mission Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-4xl">
                                        🎯
                                    </span>
                                    <div>
                                        <h3 className="text-[#C9D1D9] text-xl">
                                            {selectedMission.name}
                                        </h3>
                                        <p className="text-[#8B949E]">
                                            ID: {selectedMission.id}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            selectedMission.status === "ACTIVE"
                                                ? "warning"
                                                : selectedMission.status ===
                                                    "COMPLETED"
                                                  ? "success"
                                                  : "info"
                                        }
                                        className="ml-auto"
                                    >
                                        {selectedMission.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Mission Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Локация
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        Биом ID: {selectedMission.biomeId}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Сложность (Опыт)
                                    </div>
                                    <div className="text-2xl">
                                        {getDangerStars(
                                            selectedMission.requiredExperience || 0
                                        )}
                                    </div>
                                    <div className="text-[#8B949E] text-sm mt-1">
                                        {selectedMission.requiredExperience} XP
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Команда
                                    </div>
                                    <div className="text-[#C9D1D9] text-xl">
                                        ID: {selectedMission.teamId}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Статус
                                    </div>
                                    <Badge
                                        variant={
                                            ["ACTIVE", "IN_PROGRESS", "STARTED"].includes(selectedMission.status?.toUpperCase() || "")
                                                ? "warning"
                                                : ["COMPLETED", "FINISHED", "SUCCESS"].includes(selectedMission.status?.toUpperCase() || "")
                                                  ? "success"
                                                  : "info"
                                        }
                                    >
                                        {selectedMission.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Objective */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="text-[#8B949E] mb-2">
                                    Описание миссии
                                </div>
                                <div className="text-[#C9D1D9]">
                                    {selectedMission.description}
                                </div>
                            </div>

                            {/* Timeline */}
                            {(selectedMission.missionStart ||
                                selectedMission.missionEnd) && (
                                <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] mb-3">
                                        Временная шкала
                                    </div>
                                    <div className="space-y-2">
                                        {selectedMission.missionStart && (
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-[#56C271]"
                                                />
                                                <span className="text-[#C9D1D9] text-sm">
                                                    Начало:{" "}
                                                    {new Date(
                                                        selectedMission.missionStart
                                                    ).toLocaleString("ru-RU")}
                                                </span>
                                            </div>
                                        )}
                                        {selectedMission.missionEnd && (
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-[#D32F2F]"
                                                />
                                                <span className="text-[#C9D1D9] text-sm">
                                                    Завершение:{" "}
                                                    {new Date(
                                                        selectedMission.missionEnd
                                                    ).toLocaleString("ru-RU")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="danger"
                                    onClick={async () => {
                                        if (confirm("Вы уверены, что хотите удалить миссию?")) {
                                            try {
                                                await MissionService.delete(selectedMission.id as number);
                                                toast.success("Миссия удалена");
                                                setSelectedMission(null);
                                                fetchMissions();
                                            } catch (e) {
                                                toast.error("Ошибка при удалении миссии");
                                            }
                                        }
                                    }}
                                >
                                    Удалить миссию
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
