import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Input, Select } from "../components/ui/Input";
import {
    LogisticsService,
    SpaceShipService,
    StationService,
    GlossaryService,
    RequestService,
    MissionService,
    TeamService,
    CargoService
} from "../api/services";
import { 
    Truck, 
    Ship, 
    MapPin, 
    Calendar, 
    Plus, 
    Package, 
    Search,
    Edit2,
    CheckCircle2,
    XCircle,
    Info,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

export function LogisticsPage() {
    const [logistics, setLogistics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLogistic, setSelectedLogistic] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [requests, setRequests] = useState<any[]>([]);
    const [missions, setMissions] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedRequestId, setSelectedRequestId] = useState("");
    const [selectedMissionId, setSelectedMissionId] = useState("");
    const [cargoDetails, setCargoDetails] = useState<Record<number, any>>({});
    const [loadingCargo, setLoadingCargo] = useState<Record<number, boolean>>({});

    const [stations, setStations] = useState<any[]>([]);
    const [ships, setShips] = useState<any[]>([]);
    const [equipmentGlossary, setEquipmentGlossary] = useState<any[]>([]);
    const [resourceGlossary, setResourceGlossary] = useState<any[]>([]);
    const [weaponGlossary, setWeaponGlossary] = useState<any[]>([]);

    const [shipmentForm, setShipmentForm] = useState({
        spaceShipId: "",
        shipToDate: "",
        shipToPoint: "",
    });

    const [items, setItems] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({
        itemType: "EQUIPMENT",
        itemName: "",
        quantity: 1,
    });

    const [editForm, setEditForm] = useState({
        newStatus: "",
        newDate: "",
    });

    const fetchLogistics = async () => {
        try {
            setLoading(true);
            const response = await LogisticsService.getAll();
            if (Array.isArray(response)) {
                setLogistics(response);
            } else if (response && typeof response === 'object') {
                setLogistics(response.data || response.content || []);
            }
        } catch (error) {
            console.error("Failed to fetch logistics:", error);
            setLogistics([]); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) {
            fetchLogistics();
            return;
        }

        try {
            setLoading(true);
            const response = await LogisticsService.getById(Number(searchId));
            if (response) {
                setLogistics([response]);
            } else {
                setLogistics([]);
            }
        } catch (error) {
            console.error("Search failed:", error);
            toast.error("Запись не найдена");
            setLogistics([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCargoDetails = async (cargoId: number) => {
        if (!cargoId || cargoDetails[cargoId]) return; // Уже загружено

        setLoadingCargo(prev => ({ ...prev, [cargoId]: true }));
        try {
            const cargo = await CargoService.getById(cargoId);
            setCargoDetails(prev => ({ ...prev, [cargoId]: cargo }));
        } catch (error) {
            console.error(`Failed to fetch cargo #${cargoId}:`, error);
            // Не показываем toast, чтобы не спамить, просто логируем
        } finally {
            setLoadingCargo(prev => ({ ...prev, [cargoId]: false }));
        }
    };

    // Загружаем детали грузов для всех логистик
    useEffect(() => {
        if (logistics.length > 0) {
            logistics.forEach(log => {
                if (log.cargoId) {
                    fetchCargoDetails(log.cargoId);
                }
            });
        }
    }, [logistics]);

    const fetchData = async () => {
        try {
            const [stationsData, shipsData, equipment, resources, weapons, requestsData, missionsData, teamsData] = await Promise.all([
                StationService.getAll(),
                SpaceShipService.getAll(),
                GlossaryService.getEquipment(),
                GlossaryService.getResources(),
                GlossaryService.getWeapons(),
                RequestService.getFiltered(0, 100, { code: "REQ-LG" }),
                MissionService.getAll(0, 100),
                TeamService.getAll(0, 100)
            ]);

            setStations(Array.isArray(stationsData) ? stationsData : (stationsData.data || stationsData.content || []));
            setShips(shipsData);
            setEquipmentGlossary(equipment);
            setResourceGlossary(resources);
            setWeaponGlossary(weapons);
            
            setRequests(Array.isArray(requestsData) ? requestsData : (requestsData.data || requestsData.content || []));
            setMissions(Array.isArray(missionsData) ? missionsData : (missionsData.data || missionsData.content || []));
            setTeams(Array.isArray(teamsData) ? teamsData : (teamsData.data || teamsData.content || []));
        } catch (error) {
            console.error("Failed to fetch reference data:", error);
        }
    };

    useEffect(() => {
        fetchLogistics();
        fetchData();
    }, []);

    const handleAddItem = () => {
        if (!newItem.itemName) {
            toast.error("Выберите предмет");
            return;
        }
        setItems([...items, { ...newItem }]);
        setNewItem({ ...newItem, itemName: "", quantity: 1 });
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleFillFromRequest = () => {
        const request = requests.find(r => String(r.id) === selectedRequestId);
        if (!request) {
            toast.error("Выберите запрос из списка");
            return;
        }

        let addedItems: any[] = [];
        
        // 1. Try to parse JSON from description
        try {
            const descriptionJson = request.description || "";
            // Find JSON array in text if it's mixed
            const jsonPart = descriptionJson.substring(descriptionJson.indexOf("["), descriptionJson.lastIndexOf("]") + 1);
            if (jsonPart) {
                const data = JSON.parse(jsonPart);
                if (Array.isArray(data)) {
                    addedItems = data.map(item => {
                        const type = (item.itemType || item.type || "").toUpperCase();
                        const isTeam = type === "TEAM" || type === "КОМАНДА" || !!item.teamId;
                        return {
                            itemType: isTeam ? "TEAM" : (type || "EQUIPMENT"),
                            itemName: (isTeam ? String(item.teamId || item.itemName) : item.itemName) || "",
                            quantity: item.quantity || 1
                        };
                    });
                }
            }
        } catch (e) {
            console.log("Could not parse items from request description");
        }

        // 2. Try to find Mission ID in description and add its team
        const missionIdMatch = request.description?.match(/ID миссии: (\d+)/) || 
                             request.description?.match(/Mission ID: (\d+)/) ||
                             request.description?.match(/#(\d+)/);
                             
        if (missionIdMatch) {
            const mId = Number(missionIdMatch[1]);
            const mission = missions.find(m => m.id === mId);
            if (mission && mission.teamId) {
                const teamAlreadyAdded = addedItems.some(i => i.itemType === "TEAM");
                if (!teamAlreadyAdded) {
                    addedItems.push({
                        itemType: "TEAM",
                        itemName: String(mission.teamId),
                        quantity: 1
                    });
                }
            }
        }

        if (addedItems.length > 0) {
            setItems(prev => [...prev, ...addedItems]);
            toast.success(`Добавлено ${addedItems.length} позиций`);
            setSelectedRequestId(""); // Reset
        } else {
            toast.warning("Не удалось автоматически заполнить данные из описания запроса");
        }
    };

    const handleFillFromMission = () => {
        const mission = missions.find(m => String(m.id) === selectedMissionId);
        if (!mission) {
             toast.error("Выберите миссию из списка");
             return;
        }
        if (mission.teamId) {
             setItems(prev => [...prev, {
                 itemType: "TEAM",
                 itemName: String(mission.teamId),
                 quantity: 1
             }]);
             toast.success("Команда миссии добавлена");
             setSelectedMissionId("");
        } else {
             toast.warning("У этой миссии не назначена команда");
        }
    };

    const handleCreateShipment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error("Добавьте хотя бы один предмет");
            return;
        }

        setIsSubmitting(true);
        try {
            const formattedData = items.map(item => {
                if (item.itemType === "TEAM") {
                    return { 
                        itemType: "TEAM", 
                        teamId: Number(item.itemName) 
                    };
                }
                
                // WEAPON, EQUIPMENT and RESOURCE
                return {
                    itemType: item.itemType,
                    itemName: item.itemName,
                    quantity: Number(item.quantity)
                };
            });

            await LogisticsService.createShipment({
                spaceShipId: Number(shipmentForm.spaceShipId),
                shipToDate: shipmentForm.shipToDate,
                shipToPoint: Number(shipmentForm.shipToPoint),
                data: formattedData
            });
            toast.success("Шипмент создан");
            setShowCreateModal(false);
            setItems([]);
            setShipmentForm({ spaceShipId: "", shipToDate: "", shipToPoint: "" });
            fetchLogistics();
        } catch (error) {
            toast.error("Ошибка при создании шипмента");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateLogistic = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await LogisticsService.update(selectedLogistic.id, {
                newStatus: editForm.newStatus,
                newDate: editForm.newDate
            });
            toast.success("Статус обновлен");
            setShowEditModal(false);
            fetchLogistics();
        } catch (error) {
            toast.error("Ошибка при обновлении статуса");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status?.toUpperCase()) {
            case "SHIPPED": return "success";
            case "SHIPPING": return "warning";
            case "CANCELED": return "danger";
            case "CREATED":
            case "READY": return "info";
            default: return "info";
        }
    };

    return (
        <Layout currentPage="/logistics">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2 font-bold text-3xl">Логистика и Шипменты</h1>
                        <p className="text-[#8B949E]">
                            Управление поставками и отслеживание грузов
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} className="mr-2" />
                        Создать шипмент
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end bg-[#161B22] p-4 rounded-lg border border-[#30363D]">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2 items-end">
                        <div className="flex-1">
                            <Input 
                                label="Поиск по ID"
                                placeholder="Введите ID логистики..."
                                value={searchId}
                                onChange={(e: any) => setSearchId(e.target.value)}
                                className="mb-0"
                            />
                        </div>
                        <Button type="submit" variant="ghost" className="border border-[#30363D]">
                            <Search size={18} className="mr-2" />
                            Найти
                        </Button>
                        {searchId && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => {
                                    setSearchId("");
                                    fetchLogistics();
                                }}
                            >
                                Сбросить
                            </Button>
                        )}
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#8B949E]">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p>Загрузка данных логистики...</p>
                    </div>
                ) : logistics.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[#30363D] rounded-xl bg-[#161B22]/50">
                        <Package size={48} className="text-[#30363D] mx-auto mb-4" />
                        <h3 className="text-[#C9D1D9] text-xl font-medium">Нет активных шипментов</h3>
                        <p className="text-[#8B949E] mt-2 mb-6">Создайте первый шипмент, чтобы начать отслеживание</p>
                        <Button variant="ghost" onClick={() => setShowCreateModal(true)}>
                            Создать сейчас
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {logistics.map((item) => (
                            <Card key={item.id} className="bg-[#161B22] border-[#30363D] hover:border-[#FF6B35]/50 transition-all group overflow-hidden">
                                <CardHeader className="pb-2 border-b border-[#30363D]/50 mb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-[#FF6B35]/10 rounded text-[#FF6B35]">
                                                <Truck size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-[#C9D1D9] font-bold">Карго #{item.cargoId}</h3>
                                                <p className="text-[#8B949E] text-xs">ID: {item.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusVariant(item.status)}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {loadingCargo[item.cargoId] ? (
                                        <div className="flex items-center justify-center py-2 text-[#8B949E]">
                                            <Loader2 size={14} className="animate-spin mr-2" />
                                            <span className="text-xs">Загрузка данных груза...</span>
                                        </div>
                                    ) : cargoDetails[item.cargoId] && (
                                        <div className="p-3 bg-[#0D1117] rounded border border-[#30363D] mb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2 text-[#8B949E] text-xs">
                                                    <Package size={14} className="text-[#FF6B35]" />
                                                    <span>Информация о грузе</span>
                                                </div>
                                                <Badge variant="info" className="text-[10px]">
                                                    Вес: {cargoDetails[item.cargoId].weight} кг
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <div className="text-[#8B949E] text-[10px] uppercase mb-1">
                                                        Плановая дата доставки
                                                    </div>
                                                    <div className="text-[#C9D1D9] font-medium flex items-center gap-1">
                                                        <Calendar size={12} className="text-[#FF6B35]" />
                                                        {new Date(cargoDetails[item.cargoId].shipToDate).toLocaleDateString("ru-RU")}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[#8B949E] text-[10px] uppercase mb-1">
                                                        Пункт назначения
                                                    </div>
                                                    <div className="text-[#C9D1D9] font-medium flex items-center gap-1">
                                                        <MapPin size={12} className="text-[#FF6B35]" />
                                                        {stations.find(s => s.id === cargoDetails[item.cargoId].shipToPoint)?.name ||
                                                            `Станция #${cargoDetails[item.cargoId].shipToPoint}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-[#0D1117] rounded border border-[#30363D]">
                                            <div className="flex items-center gap-2 text-[#8B949E] text-xs mb-1">
                                                <Ship size={14} /> Корабль
                                            </div>
                                            <div className="text-[#C9D1D9] text-sm font-medium">
                                                {ships.find(s => s.id === item.spaceShipId)?.name || `ID ${item.spaceShipId}`}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-[#0D1117] rounded border border-[#30363D]">
                                            <div className="flex items-center gap-2 text-[#8B949E] text-xs mb-1">
                                                <Calendar size={14} /> Время отправки
                                            </div>
                                            <div className="text-[#C9D1D9] text-sm font-medium">
                                                {item.sendTime ? new Date(item.sendTime).toLocaleString("ru-RU") : "—"}
                                            </div>
                                        </div>
                                    </div>

                                    {cargoDetails[item.cargoId] && item.sendTime && (
                                    <div className="flex items-center gap-2 p-2 bg-[#0D1117]/50 rounded border border-[#30363D]/50">
                                        <Info size={14} className="text-[#8B949E]" />
                                        <span className="text-xs text-[#8B949E]">
                                            {new Date(item.sendTime) > new Date(cargoDetails[item.cargoId].shipToDate) ? (
                                                <span className="text-[#F85149]">Отправка позже плановой даты</span>
                                            ) : (
                                                <span className="text-[#3FB950]">В соответствии с графиком</span>
                                            )}
                                        </span>
                                    </div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-[#FF6B35] border-[#FF6B35]/20 hover:bg-[#FF6B35]/10"
                                        onClick={() => {
                                            setSelectedLogistic(item);
                                            setEditForm({
                                                newStatus: item.status,
                                                newDate: item.sendTime ? item.sendTime.substring(0, 16) : ""
                                            });
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <Edit2 size={14} className="mr-2" /> Изменить статус
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                <Modal 
                    isOpen={showCreateModal} 
                    onClose={() => !isSubmitting && setShowCreateModal(false)}
                    title="Создание нового шипмента"
                >
                    <form onSubmit={handleCreateShipment} className="space-y-6">
                        <div className="p-4 bg-[#161B22]/50 border border-[#30363D] rounded-lg space-y-4">
                            <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider">Подставить данные из запроса</h4>
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Select 
                                        label="Активный REQ-LG запрос"
                                        value={selectedRequestId}
                                        onChange={(e: any) => setSelectedRequestId(e.target.value)}
                                        options={[
                                            { value: "", label: "Выберите запрос..." },
                                            ...requests.map(r => ({ 
                                                value: String(r.id), 
                                                label: `${r.requestCode} (ID: ${r.id}) - ${r.description?.substring(0, 30)}...` 
                                            }))
                                        ]}
                                    />
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="border border-[#30363D] h-10"
                                    onClick={handleFillFromRequest}
                                >
                                    Заполнить
                                </Button>
                            </div>
                            
                            <div className="flex gap-3 items-end pt-2 border-t border-[#30363D]/30">
                                <div className="flex-1">
                                    <Select 
                                        label="Или добавить команду из миссии"
                                        value={selectedMissionId}
                                        onChange={(e: any) => setSelectedMissionId(e.target.value)}
                                        options={[
                                            { value: "", label: "Выберите миссию..." },
                                            ...missions.map(m => ({ value: String(m.id), label: `${m.name} (ID: ${m.id})` }))
                                        ]}
                                    />
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="border border-[#30363D] h-10"
                                    onClick={handleFillFromMission}
                                >
                                    Добавить
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Select 
                                label="Корабль" 
                                value={shipmentForm.spaceShipId}
                                onChange={(e: any) => setShipmentForm({...shipmentForm, spaceShipId: e.target.value})}
                                options={[
                                    { value: "", label: "Выберите корабль..." },
                                    ...ships.map(s => ({ value: String(s.id), label: s.name }))
                                ]}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Дата доставки" 
                                    type="date"
                                    value={shipmentForm.shipToDate}
                                    onChange={(e: any) => setShipmentForm({...shipmentForm, shipToDate: e.target.value})}
                                    required
                                />
                                <Select 
                                    label="Точка назначения" 
                                    value={shipmentForm.shipToPoint}
                                    onChange={(e: any) => setShipmentForm({...shipmentForm, shipToPoint: e.target.value})}
                                    options={[
                                        { value: "", label: "Выберите станцию..." },
                                        ...stations.map(s => ({ value: String(s.id), label: s.name }))
                                    ]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                            <h3 className="text-[#C9D1D9] font-medium mb-4 flex items-center gap-2">
                                <Package size={18} className="text-[#FF6B35]" /> Состав груза
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="flex-1 min-w-[200px]">
                                    <Select 
                                        className="mb-0"
                                        value={newItem.itemType}
                                        onChange={(e: any) => setNewItem({...newItem, itemType: e.target.value, itemName: ""})}
                                        options={[
                                            { value: "EQUIPMENT", label: "Снаряжение" },
                                            { value: "WEAPON", label: "Оружие" },
                                            { value: "RESOURCE", label: "Ресурс" },
                                            { value: "TEAM", label: "Команда" },
                                        ]}
                                    />
                                </div>
                                <div className="flex-[2] min-w-[200px]">
                                    {newItem.itemType === "EQUIPMENT" ? (
                                        <Select 
                                            className="mb-0"
                                            value={newItem.itemName}
                                            onChange={(e: any) => setNewItem({...newItem, itemName: e.target.value})}
                                            options={[
                                                { value: "", label: "Предмет..." },
                                                ...equipmentGlossary.map(e => ({ value: e.name, label: e.name }))
                                            ]}
                                        />
                                    ) : newItem.itemType === "WEAPON" ? (
                                        <Select 
                                            className="mb-0"
                                            value={newItem.itemName}
                                            onChange={(e: any) => setNewItem({...newItem, itemName: e.target.value})}
                                            options={[
                                                { value: "", label: "Оружие..." },
                                                ...weaponGlossary.map(w => ({ value: w.name, label: w.name }))
                                            ]}
                                        />
                                    ) : newItem.itemType === "RESOURCE" ? (
                                        <Select 
                                            className="mb-0"
                                            value={newItem.itemName}
                                            onChange={(e: any) => setNewItem({...newItem, itemName: e.target.value})}
                                            options={[
                                                { value: "", label: "Ресурс..." },
                                                ...resourceGlossary.map(r => ({ value: r.name, label: r.name }))
                                            ]}
                                        />
                                    ) : (
                                        <Select 
                                            className="mb-0"
                                            value={newItem.itemName}
                                            onChange={(e: any) => setNewItem({...newItem, itemName: e.target.value})}
                                            options={[
                                                { value: "", label: "Команда..." },
                                                ...teams.map(t => ({ value: String(t.id), label: t.name || `Команда ${t.id}` }))
                                            ]}
                                        />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input 
                                        type="number" 
                                        className="w-20 mb-0" 
                                        min="1"
                                        value={newItem.quantity}
                                        onChange={(e: any) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                                    />
                                    <Button type="button" onClick={handleAddItem}>
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {items.length > 0 ? items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-[#0D1117] border border-[#30363D] rounded">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                item.itemType === "WEAPON" ? "danger" : 
                                                item.itemType === "TEAM" ? "primary" : "info"
                                            }>
                                                {item.itemType === "TEAM" ? "КОМАНДА" : 
                                                 item.itemType === "WEAPON" ? "ОРУЖИЕ" : "СНАРЯЖЕНИЕ"}
                                            </Badge>
                                            <span className="text-[#C9D1D9] text-sm">
                                                {item.itemType === "TEAM" 
                                                    ? (teams.find(t => String(t.id) === String(item.itemName))?.name || `ID: ${item.itemName}`)
                                                    : item.itemName
                                                }
                                            </span>
                                            <span className="text-[#8B949E] text-xs">×{item.quantity}</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveItem(idx)}
                                            className="text-[#8B949E] hover:text-[#D32F2F] p-1"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 text-[#8B949E] text-sm border border-dashed border-[#30363D] rounded">
                                        Список пуст
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-[#30363D]">
                            <Button variant="ghost" className="flex-1" type="button" onClick={() => setShowCreateModal(false)}>
                                Отмена
                            </Button>
                            <Button className="flex-1" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Создать отправление
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    isOpen={showEditModal}
                    onClose={() => !isSubmitting && setShowEditModal(false)}
                    title={`Обновление статуса #${selectedLogistic?.id}`}
                >
                    <form onSubmit={handleUpdateLogistic} className="space-y-6">
                        <Select 
                            label="Новый статус"
                            value={editForm.newStatus}
                            onChange={(e: any) => setEditForm({...editForm, newStatus: e.target.value})}
                            options={[
                                { value: "CREATED", label: "Создан (CREATED)" },
                                { value: "READY", label: "Готов (READY)" },
                                { value: "SHIPPING", label: "В процессе (SHIPPING)" },
                                { value: "SHIPPED", label: "Доставлен (SHIPPED)" },
                                { value: "CANCELED", label: "Отменен (CANCELED)" },
                            ]}
                        />

                        <Input 
                            label="Новая дата (опционально)"
                            type="datetime-local"
                            value={editForm.newDate}
                            onChange={(e: any) => setEditForm({...editForm, newDate: e.target.value})}
                        />

                        <div className="flex gap-4 pt-4 border-t border-[#30363D]">
                            <Button variant="ghost" className="flex-1" type="button" onClick={() => setShowEditModal(false)}>
                                Отмена
                            </Button>
                            <Button className="flex-1" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Сохранить
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
}
