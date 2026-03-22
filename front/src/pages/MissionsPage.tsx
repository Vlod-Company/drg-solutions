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
    CheckCircle2,
    Clock,
    History,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Rocket,
    Plus,
    Loader2
} from "lucide-react";
import { MissionService, EcosystemService, TeamService, GlossaryService } from "../api/services";
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
    const [equipmentGlossary, setEquipmentGlossary] = useState<any[]>([]);
    const [weaponGlossary, setWeaponGlossary] = useState<any[]>([]);
    const [filter, setFilter] = useState<
        "ALL" | "PLANNED" | "ACTIVE" | "COMPLETED"
    >("ALL");

    // Multi-step form state
    const [createStep, setCreateStep] = useState(1);
    const [missionFormData, setMissionFormData] = useState<any>({});
    const [sendItems, setSendItems] = useState<any[]>([]);
    const [newItem, setNewItem] = useState<any>({
        itemType: "EQUIPMENT",
        itemName: "",
        quantity: 1,
        teamId: undefined
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentMissionId, setCurrentMissionId] = useState<number | null>(null);

    const fetchMissions = async () => {
        setLoading(true);
        try {
            // Fetch with a large pageSize to simulate "loading all at once" 
            // since the API requires these parameters.
            const response = await MissionService.getAll(0, 100);
            
            let data: any[] = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (response && typeof response === 'object') {
                data = response.data || response.content || [];
            }
            setMissions(data);
        } catch (error) {
            console.error("Failed to fetch missions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    useEffect(() => {
        
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
                const response = await TeamService.getAll(0, 100);
                if (Array.isArray(response)) {
                    setTeams(response);
                } else if (response && typeof response === 'object') {
                    setTeams(response.data || response.content || []);
                }
             } catch (e) {
                 console.error("Failed to fetch teams", e);
             }
        };

        const fetchGlossary = async () => {
            try {
                const [eq, wp] = await Promise.all([
                    GlossaryService.getEquipment(),
                    GlossaryService.getWeapons()
                ]);
                setEquipmentGlossary(eq);
                setWeaponGlossary(wp);
            } catch (e) {
                console.error("Failed to fetch glossary items", e);
            }
        };

        fetchBiomes();
        fetchTeams();
        fetchGlossary();
    }, []);

    const handleNextStep = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            biomeId: Number(formData.get("biomeId")),
            teamId: Number(formData.get("teamId")),
            requiredExperience: Number(formData.get("requiredExperience")),
            missionStart: formData.get("missionStart") ? new Date(formData.get("missionStart") as string).toISOString() : undefined,
        };
        
        setIsSubmitting(true);
        try {
            let mission;
            if (currentMissionId) {
                mission = await MissionService.update(currentMissionId, data);
            } else {
                mission = await MissionService.create(data);
            }
            
            if (!mission.id) throw new Error("ID миссии не получен");
            
            setCurrentMissionId(mission.id);
            setMissionFormData(data);
            setSendItems([]); // Clear items for the second step
            
            setCreateStep(2);
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при инициализации миссии");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddItem = () => {
        if (newItem.itemType === "TEAM") {
            toast.error("Вы не можете добавить еще одну команду");
            return;
        }
        if (!newItem.itemName) {
            toast.error("Введите название предмета");
            return;
        }
        setSendItems([...sendItems, { ...newItem }]);
        setNewItem({
            itemType: "EQUIPMENT",
            itemName: "",
            quantity: 1,
            teamId: undefined
        });
    };

    const handleFetchRecommended = async () => {
        if (!currentMissionId) return;
        setIsSubmitting(true);
        try {
            const recommended = await MissionService.getRecommendedWeapons(currentMissionId);
            if (recommended && recommended.length > 0) {
                const newWeapons = recommended.map(w => ({
                    itemType: "WEAPON" as const,
                    itemName: w.weaponName,
                    quantity: 1,
                    weaponId: w.weaponId
                }));
                
                // Avoid adding duplicates by name
                const existingNames = new Set(sendItems.map((i: any) => i.itemName));
                const itemsToAdd = newWeapons.filter((w: any) => !existingNames.has(w.itemName));
                
                if (itemsToAdd.length > 0) {
                    setSendItems([...sendItems, ...itemsToAdd]);
                    toast.success(`Добавлено ${itemsToAdd.length} рек. предметов`);
                } else {
                    toast.info("Все рекомендованные предметы уже в списке");
                }
            } else {
                toast.info("Для данной миссии нет рекомендаций");
            }
        } catch (error) {
            console.error(error);
            toast.error("Не удалось получить рекомендации");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveItem = (index: number) => {
        setSendItems(sendItems.filter((_: any, i: number) => i !== index));
    };

    const handleFinalSubmit = async () => {
        if (!currentMissionId) return;
        setIsSubmitting(true);
        try {
            // Mission is already created, just create Equipment Request
            if (sendItems.length > 0) {
                await MissionService.createSendMissionRequest(currentMissionId, sendItems);
            }

            toast.success("Запрос оборудования успешно отправлен");
            setShowCreateModal(false);
            setCreateStep(1);
            setCurrentMissionId(null);
            setSendItems([]);
            fetchMissions();
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при отправке запроса оборудования");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMissions = missions.filter((m: MissionDto) => {
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
                    <Button onClick={() => {
                        setCreateStep(1);
                        setSendItems([]);
                        setMissionFormData({});
                        setCurrentMissionId(null);
                        setShowCreateModal(true);
                    }}>
                        <Plus size={18} className="mr-2" />
                        Создать миссию
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(["ALL", "PLANNED", "ACTIVE", "COMPLETED"] as const).map(
                        (status: "ALL" | "PLANNED" | "ACTIVE" | "COMPLETED") => (
                            <Button
                                key={status}
                                variant={
                                    filter === status ? "primary" : "ghost"
                                }
                                size="sm"
                                onClick={() => {
                                    setFilter(status);
                                }}
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
                        {filteredMissions.length > 0 ? (
                            filteredMissions.map((mission: MissionDto) => (
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
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center border-2 border-dashed border-[#30363D] rounded-xl bg-[#161B22]/50">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#161B22] border border-[#30363D] mb-4">
                                    <Plus size={24} className="text-[#8B949E] rotate-45" />
                                </div>
                                <p className="text-[#C9D1D9] font-medium">Миссии не найдены</p>
                                <p className="text-[#8B949E] text-sm mt-1">На текущей странице нет миссий с этим статусом.</p>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="mt-4 text-[#FF6B35] hover:text-[#FF7A47]"
                                    onClick={() => setFilter("ALL")}
                                >
                                    Сбросить фильтр
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {!loading && missions.length === 0 && (
                     <div className="text-center py-12 text-[#8B949E]">
                         Миссии не найдены
                     </div>
                )}

                {/* Create Mission Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => !isSubmitting && setShowCreateModal(false)}
                    title={createStep === 1 ? "Создание новой миссии" : "Запрос снаряжения и оружия"}
                >
                    {createStep === 1 ? (
                        <form onSubmit={handleNextStep}>
                            <Input
                                name="name"
                                label="Название миссии"
                                defaultValue={missionFormData.name}
                                placeholder="Операция 'Глубокое погружение'"
                                required
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    name="biomeId"
                                    label="Биом"
                                    defaultValue={missionFormData.biomeId}
                                    options={biomes.map(b => ({ value: String(b.id), label: b.name || `Биом ${b.id}` }))}
                                    required
                                />
                                <Select
                                    name="teamId"
                                    label="Команда"
                                    defaultValue={missionFormData.teamId}
                                    options={teams.map(t => ({ value: String(t.id), label: t.name || `Команда ${t.id}` }))}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    name="requiredExperience"
                                    type="number"
                                    label="Треб. опыт"
                                    defaultValue={missionFormData.requiredExperience}
                                    placeholder="0"
                                />
                                 <Input
                                    name="missionStart"
                                    type="datetime-local"
                                    label="Начало миссии"
                                    defaultValue={missionFormData.missionStart ? new Date(missionFormData.missionStart).toISOString().slice(0, 16) : ""}
                                />
                            </div>

                            <Textarea
                                name="description"
                                label="Описание"
                                defaultValue={missionFormData.description}
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
                                <Button type="submit">
                                    Далее
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <h4 className="text-[#C9D1D9] text-sm font-bold mb-4 uppercase tracking-wider">Добавить предмет запроса</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                    <Select
                                        label="Тип"
                                        value={newItem.itemType}
                                        onChange={(e: any) => {
                                            const type = e.target.value;
                                            setNewItem({ 
                                                ...newItem, 
                                                itemType: type,
                                                itemName: "", // Will be selected via placeholder or manual choice
                                                teamId: undefined
                                            });
                                        }}
                                        options={[
                                            { value: "EQUIPMENT", label: "Снаряжение" },
                                            { value: "WEAPON", label: "Оружие" },
                                            // Team removed per requirement: "другие добавить нельзя"
                                        ]}
                                    />
                                    <div className="md:col-span-2">
                                        {newItem.itemType === "EQUIPMENT" ? (
                                            <Select
                                                label="Выбор снаряжения"
                                                value={newItem.itemName}
                                                onChange={(e: any) => setNewItem({ ...newItem, itemName: e.target.value })}
                                                options={[
                                                    { value: "", label: "Выберите снаряжение..." },
                                                    ...equipmentGlossary.map((e: any) => ({ value: e.name, label: e.name }))
                                                ]}
                                                className="mb-0"
                                            />
                                        ) : newItem.itemType === "WEAPON" ? (
                                            <Select
                                                label="Выбор оружия"
                                                value={newItem.itemName}
                                                onChange={(e: any) => setNewItem({ ...newItem, itemName: e.target.value })}
                                                options={[
                                                    { value: "", label: "Выберите оружие..." },
                                                    ...weaponGlossary.map((w: any) => ({ value: w.name, label: w.name }))
                                                ]}
                                                className="mb-0"
                                            />
                                        ) : (
                                            <Input
                                                label="Название предмета"
                                                value={newItem.itemName}
                                                onChange={(e: any) => setNewItem({ ...newItem, itemName: e.target.value })}
                                                placeholder="Введите название..."
                                                className="mb-0"
                                            />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {newItem.itemType !== "TEAM" && (
                                            <div className="w-20">
                                                <Input
                                                    label="Кол-во"
                                                    type="number"
                                                    min="1"
                                                    value={newItem.quantity}
                                                    onChange={(e: any) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                                    className="mb-0"
                                                />
                                            </div>
                                        )}
                                        <Button onClick={handleAddItem} className="h-10">
                                            <Plus size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    className="text-[#FF6B35] border-[#FF6B35] hover:bg-[#FF6B35]/10 w-full"
                                    onClick={handleFetchRecommended}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : "🚀"} Рекомендованное оружие
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-[#8B949E] text-xs font-bold uppercase">Список оборудования к отправке</h4>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {sendItems.length > 0 ? sendItems.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-[#0D1117] border border-[#30363D] rounded-lg group">
                                            <div className="flex items-center gap-3">
                                                <Badge variant={item.itemType === "WEAPON" ? "danger" : item.itemType === "TEAM" ? "primary" : "info"}>
                                                    {item.itemType}
                                                </Badge>
                                                <span className="text-[#C9D1D9] font-medium">{item.itemName}</span>
                                                <span className="text-[#8B949E] text-sm">× {item.quantity}</span>
                                            </div>
                                            {item.itemType !== "TEAM" && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="opacity-0 group-hover:opacity-100 text-[#D32F2F] hover:bg-[#D32F2F]/10"
                                                >
                                                    Удалить
                                                </Button>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 border border-dashed border-[#30363D] rounded-lg text-[#8B949E]">
                                            Ничего не добавлено. Вы можете создать миссию без запроса оборудования.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-between mt-6 pt-4 border-t border-[#30363D]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setCreateStep(1)}
                                    disabled={isSubmitting}
                                >
                                    Назад
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={isSubmitting}
                                    >
                                        Отмена
                                    </Button>
                                    <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                        Сформировать миссию
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Mission Details Modal */}
                {selectedMission && (
                    <Modal
                        isOpen={!!selectedMission}
                        onClose={() => setSelectedMission(null)}
                        title={`Миссия ${selectedMission.id}`}
                        size="md"
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
