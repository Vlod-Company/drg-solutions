import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Input, Select } from "../components/ui/Input";
import { 
    RequestService, 
    StationService, 
    TeamService, 
    StoreService, 
    GlossaryService,
    MissionService,
    EcosystemService
} from "../api/services";
import { 
    Package, 
    Plus, 
    Trash2, 
    Ship, 
    Search, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    XCircle,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import {useAuth} from "../context/AuthContext";

export function CargoPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [stations, setStations] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [biomes, setBiomes] = useState<any[]>([]);
    const [equipmentGlossary, setEquipmentGlossary] = useState<any[]>([]);
    const [resourceGlossary, setResourceGlossary] = useState<any[]>([]);
    const [weaponGlossary, setWeaponGlossary] = useState<any[]>([]);
    const [missions, setMissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [selectedRequestId, setSelectedRequestId] = useState("");
    const [deliveryPointType, setDeliveryPointType] = useState("STATION");
    const [cargoForm, setCargoForm] = useState({
        cargoId: String(Date.now()),
        locatedAt: "",
    });
    
    const [items, setItems] = useState<any[]>([]);
    const [availableItemsAtPoint, setAvailableItemsAtPoint] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({
        itemType: "EQUIPMENT",
        itemName: "",
        identificationNumber: "",
        quantity: 1
    });

    const [availableIds, setAvailableIds] = useState<string[]>([]);
    const [idLoading, setIdLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [reqs, stats, tms, equip, res, wep, miss, bms] = await Promise.all([
                RequestService.getFiltered(0, 100, { code: "REQ-TR", isRecipient: true, status: "IN_PROGRESS" }),
                StationService.getAll(),
                TeamService.getAll(0, 100),
                GlossaryService.getEquipment(),
                GlossaryService.getResources(),
                GlossaryService.getWeapons(),
                MissionService.getAll(0, 100),
                EcosystemService.getAllBiomes()
            ]);

            setRequests(Array.isArray(reqs) ? reqs : (reqs.content || reqs.data || []));
            setStations(Array.isArray(stats) ? stats : (stats.content || stats.data || []));
            setTeams(Array.isArray(tms) ? tms : (tms.content || tms.data || []));
            setEquipmentGlossary(equip);
            setResourceGlossary(res);
            setWeaponGlossary(wep);
            setMissions(Array.isArray(miss) ? miss : (miss.content || miss.data || []));
            setBiomes(Array.isArray(bms) ? bms : (bms.content || bms.data || []));
        } catch (error) {
            console.error("Failed to fetch cargo data:", error);
            toast.error("Ошибка загрузки данных");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSelectedDeliveryPointId = () => {
        if (!cargoForm.locatedAt) return null;
        const list = deliveryPointType === "STATION" ? stations : biomes;
        const found = list.find((s: any) => String(s.id) === String(cargoForm.locatedAt));
        return found ? found.deliveryPointId : null;
    };

    const fetchItemsAtPoint = async (pointId: number) => {
        if (!pointId) {
            setAvailableItemsAtPoint([]);
            return;
        }
        try {
            const response = await StoreService.findItemsInDeliveryPoint(pointId);
            const pointData = Array.isArray(response) ? response[0] : response;
            setAvailableItemsAtPoint(pointData?.data || []);
        } catch (error) {
            console.error("Failed to fetch items at point:", error);
            setAvailableItemsAtPoint([]);
        }
    };

    useEffect(() => {
        const dpId = getSelectedDeliveryPointId();
        if (dpId) {
            fetchItemsAtPoint(dpId);
        } else {
            setAvailableItemsAtPoint([]);
        }
    }, [cargoForm.locatedAt, deliveryPointType]);

    useEffect(() => {
        const teamItem = items.find((i: any) => i.itemType === "TEAM");
        if (teamItem && !cargoForm.locatedAt) {
            const team = teams.find((t: any) => String(t.id) === String(teamItem.itemName));
            if (team && team.locatedAtId) {
                const stationMatch = stations.find(s => s.deliveryPointId === team.locatedAtId);
                const biomeMatch = biomes.find(b => b.deliveryPointId === team.locatedAtId);

                if (stationMatch) {
                    setDeliveryPointType("STATION");
                    setCargoForm((prev: any) => ({ ...prev, locatedAt: String(stationMatch.id) }));
                } else if (biomeMatch) {
                    setDeliveryPointType("BIOME");
                    setCargoForm((prev: any) => ({ ...prev, locatedAt: String(biomeMatch.id) }));
                }
            }
        }
    }, [items, teams, stations, biomes, cargoForm.locatedAt]);

    const fetchAvailableIds = async (type: string, name: string) => {
        const dpId = getSelectedDeliveryPointId();
        if (!name || !dpId) return [];
        setIdLoading(true);
        try {
            let ids: string[] = [];
            if (type === "WEAPON") {
                ids = await StoreService.getWeaponIds(Number(dpId), name);
            } else if (type === "EQUIPMENT") {
                ids = await StoreService.getEquipmentIds(Number(dpId), name);
            }
            setAvailableIds(ids);
            return ids;
        } catch (error) {
            console.error("Failed to fetch available IDs:", error);
            setAvailableIds([]);
            return [];
        } finally {
            setIdLoading(false);
        }
    };

    const handleFillFromRequest = () => {
        const request = requests.find(r => String(r.id) === selectedRequestId);
        if (!request) {
            toast.error("Выберите запрос");
            return;
        }

        const cargoIdMatch = request.description?.match(/Cargo ID: (\d+)/i) || 
                            request.description?.match(/ID груза: (\d+)/i) ||
                            request.description?.match(/cargo id\s*=\s*(\d+)/i);
        if (cargoIdMatch) {
            setCargoForm(prev => ({ ...prev, cargoId: cargoIdMatch[1] }));
        }

        let addedItems: any[] = [];
        let detectedTeamId = null;

        // 1. Parse JSON items
        try {
            const description = request.description || "";
            const jsonPart = description.substring(description.indexOf("["), description.lastIndexOf("]") + 1);
            if (jsonPart) {
                const data = JSON.parse(jsonPart);
                if (Array.isArray(data)) {
                    const parsed = data.map(item => {
                        const type = (item.itemType || item.type || "").toUpperCase();
                        const isTeam = type === "TEAM" || type === "КОМАНДА" || !!item.teamId;
                        if (isTeam && !detectedTeamId) detectedTeamId = item.teamId || item.itemName;
                        return {
                            itemType: isTeam ? "TEAM" : (type || "EQUIPMENT"),
                            itemName: (isTeam ? String(item.teamId || item.itemName) : item.itemName) || "",
                            quantity: item.quantity || 1,
                            identificationNumber: item.identificationNumber || ""
                        };
                    });

                    // Split WEAPON and EQUIPMENT with quantity > 1
                    parsed.forEach(item => {
                        if ((item.itemType === "WEAPON" || item.itemType === "EQUIPMENT") && item.quantity > 1) {
                            for (let i = 0; i < item.quantity; i++) {
                                addedItems.push({ ...item, quantity: 1, identificationNumber: "" });
                            }
                        } else {
                            addedItems.push(item);
                        }
                    });
                }
            }
        } catch (e) {
            console.log("JSON parse failed");
        }

        // 2. Detect Team from Mission ID in description
        const missionIdMatch = request.description?.match(/ID миссии: (\d+)/) || 
                             request.description?.match(/Mission ID: (\d+)/) ||
                             request.description?.match(/#(\d+)/);
                             
        if (missionIdMatch) {
            const mId = Number(missionIdMatch[1]);
            const mission = missions.find(m => m.id === mId);
            if (mission && mission.teamId) {
                detectedTeamId = mission.teamId;
                if (!addedItems.some(i => i.itemType === "TEAM")) {
                    addedItems.push({
                        itemType: "TEAM",
                        itemName: String(mission.teamId),
                        quantity: 1
                    });
                }
            }
        }

        // 3. Auto-set locatedAt if team detected
        if (detectedTeamId) {
            const team = teams.find(t => String(t.id) === String(detectedTeamId));
            if (team && team.locatedAtId) {
                const stationMatch = stations.find(s => s.deliveryPointId === team.locatedAtId);
                const biomeMatch = biomes.find(b => b.deliveryPointId === team.locatedAtId);

                if (stationMatch) {
                    setDeliveryPointType("STATION");
                    setCargoForm(prev => ({ ...prev, locatedAt: String(stationMatch.id) }));
                    toast.info(`Автоматически выбрана станция: ${stationMatch.name}`);
                } else if (biomeMatch) {
                    setDeliveryPointType("BIOME");
                    setCargoForm(prev => ({ ...prev, locatedAt: String(biomeMatch.id) }));
                    toast.info(`Автоматически выбран биом: ${biomeMatch.name}`);
                }
            }
        }

        if (addedItems.length > 0) {
            setItems(addedItems);
            toast.success(`Загружено ${addedItems.length} позиций из запроса`);
        } else {
            toast.warning("Не удалось автоматически заполнить предметы из описания");
        }
    };

    const handleAddItem = () => {
        if (!newItem.itemName) {
            toast.error("Выберите предмет");
            return;
        }

        if (newItem.itemType === "RESOURCE") {
            const available = availableItemsAtPoint.find(i => 
                i.itemType === "RESOURCE" && i.itemName === newItem.itemName
            );
            const stock = available?.itemQuantity || 0;
            if (newItem.quantity > stock) {
                toast.error(`Недостаточно ресурса. В наличии: ${stock}`);
                return;
            }
        }

        if ((newItem.itemType === "WEAPON" || newItem.itemType === "EQUIPMENT") && newItem.quantity > 1) {
            const splitItems = [];
            for (let i = 0; i < newItem.quantity; i++) {
                splitItems.push({ 
                    ...newItem, 
                    quantity: 1, 
                    // Clear SN for split items unless they are added one by one
                    identificationNumber: i === 0 ? newItem.identificationNumber : "" 
                });
            }
            setItems([...items, ...splitItems]);
        } else {
            setItems([...items, { ...newItem }]);
        }

        setNewItem({
            ...newItem,
            itemName: "",
            identificationNumber: "",
            quantity: 1
        });
        setAvailableIds([]);
    };

    const handleCreateCargo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            toast.error("Добавьте хотя бы один предмет");
            return;
        }
        if (!cargoForm.locatedAt) {
            toast.error("Выберите точку нахождения");
            return;
        }

        const invalidItems = items.filter((i: any) => (i.itemType === "WEAPON" || i.itemType === "EQUIPMENT") && !i.identificationNumber);
        if (invalidItems.length > 0) {
            toast.error(`У ${invalidItems.length} позиций не выбраны ID`);
            return;
        }

        const unavailableItems = items.filter((i: any) => !isItemAvailable(i));
        if (unavailableItems.length > 0) {
            toast.error("В составе груза есть отсутствующие в данной локации предметы");
            return;
        }

        setIsSubmitting(true);
        try {
            const formattedData = items.map((item: any) => {
                if (item.itemType === "TEAM") return { itemType: "TEAM", teamId: Number(item.itemName) };
                if (item.itemType === "RESOURCE") return { itemType: "RESOURCE", itemName: item.itemName, quantity: item.quantity };
                return {
                    itemType: item.itemType,
                    itemName: item.itemName,
                    identificationNumber: item.identificationNumber
                };
            });

            const dpId = getSelectedDeliveryPointId();
            if (!dpId) {
                toast.error("Не удалось определить ID точки доставки");
                setIsSubmitting(false);
                return;
            }

            await StoreService.reserveForCargo({
                cargoId: Number(cargoForm.cargoId),
                locatedAt: Number(dpId),
                data: formattedData
            });

            toast.success("Груз успешно зарезервирован");
            setShowCreateModal(false);
            setItems([]);
            fetchData();
        } catch (error) {
            console.error("Reserve cargo failed:", error);
            toast.error("Ошибка при резервировании груза");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isItemAvailable = (item: any) => {
        if (!cargoForm.locatedAt || isLoading) return true;
        
        if (item.itemType === "TEAM") {
            const team = teams.find(t => String(t.id) === String(item.itemName));
            const dpId = getSelectedDeliveryPointId();
            return team && String(team.locatedAtId) === String(dpId);
        }

        const found = availableItemsAtPoint.find(ai => 
            ai.itemType === item.itemType && ai.itemName === item.itemName
        );
        
        if (!found) return false;
        if (item.itemType === "RESOURCE" && item.quantity > (found.itemQuantity || 0)) return false;
        
        return true;
    };

    const updateItemIdentification = async (idx: number, id: string) => {
        const newItems = [...items];
        newItems[idx].identificationNumber = id;
        setItems(newItems);
    };

    const filteredItemNames = () => {
        const availableItems = availableItemsAtPoint.filter(i => i.itemType === newItem.itemType);
        const availableNames = availableItems.map(i => i.itemName);
        
        const glossary = newItem.itemType === "EQUIPMENT" ? equipmentGlossary : 
                         newItem.itemType === "WEAPON" ? weaponGlossary : 
                         resourceGlossary;
        
        return glossary
            .filter(i => availableNames.includes(i.name))
            .map(i => {
                const stock = availableItems.find(ai => ai.itemName === i.name)?.itemQuantity || 0;
                return { ...i, stock };
            });
    };

    const getFilteredIds = (type: string, name: string, currentIdx: number, currentId: string) => {
        // Get IDs used by other items of the same type and name
        const usedIds = items
            .filter((it, idx) => it.itemType === type && it.itemName === name && idx !== currentIdx)
            .map(it => it.identificationNumber)
            .filter(id => !!id);
            
        // Combine availableIds (from global state) and currentId (to keep it in list)
        const allPossible = Array.from(new Set([...availableIds, currentId])).filter(id => !!id);
        
        return allPossible.filter(id => !usedIds.includes(id));
    };

    const filteredTeams = () => {
        const dpId = getSelectedDeliveryPointId();
        if (!dpId) return [];
        return teams.filter((t: any) => String(t.locatedAtId) === String(dpId));
    };
    return (
        <Layout currentPage="/logistics/cargo">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#C9D1D9] flex items-center gap-3">
                            <Package className="text-[#FF6B35]" /> Управление грузами
                        </h1>
                        <p className="text-[#8B949E] mt-1">Резервирование и отслеживание грузов по запросам REQ-TR</p>
                    </div>
                    <Button onClick={() => {
                        setSelectedRequestId("");
                        setCargoForm({ cargoId: String(Date.now()), locatedAt: "" });
                        setItems([]);
                        setShowCreateModal(true);
                    }} className="flex items-center gap-2">
                        <Plus size={20} /> Зарезервировать груз
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-[#FF6B35]" size={40} />
                        <span className="text-[#8B949E]">Загрузка данных...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="p-6 border-dashed border-[#30363D] bg-transparent text-center">
                            <Package size={40} className="mx-auto text-[#30363D] mb-4" />
                            <h3 className="text-[#C9D1D9] font-medium">Активные запросы на перевозку</h3>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {requests.map((req) => (
                                    <div key={req.id} className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg text-left hover:border-[#FF6B35]/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="info">{req.requestCode}</Badge>
                                            <span className="text-xs text-[#8B949E]">ID: {req.id}</span>
                                        </div>
                                        <p className="text-sm text-[#C9D1D9] line-clamp-2 mb-3">{req.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs px-2 py-0.5 rounded ${
                                                req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                                {req.status}
                                            </span>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-7 text-xs"
                                                onClick={() => {
                                                    setSelectedRequestId(String(req.id));
                                                    setShowCreateModal(true);
                                                }}
                                            >
                                                Использовать
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Резервирование груза (Cargo)"
                    size="lg"
                >
                    <form onSubmit={handleCreateCargo} className="space-y-6">
                        <div className="p-4 bg-[#161B22]/50 border border-[#30363D] rounded-lg space-y-4">
                            <h4 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider">Импорт из запроса REQ-TR</h4>
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Select 
                                        label="Активный REQ-TR запрос"
                                        value={selectedRequestId}
                                        onChange={(e: any) => setSelectedRequestId(e.target.value)}
                                        options={[
                                            { value: "", label: "Выберите запрос..." },
                                            ...requests.map(r => ({ 
                                                value: String(r.id), 
                                                label: `${r.requestCode} (ID: ${r.id}, Статус: ${r.status}) ${r.description.substring(0, r.description.indexOf("\n"))}`
                                            }))
                                        ]}
                                    />
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="border border-[#30363D] h-10 mb-4"
                                    onClick={handleFillFromRequest}
                                >
                                    Заполнить
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <Input 
                                label="ID Груза"
                                value={cargoForm.cargoId}
                                onChange={(e: any) => setCargoForm({...cargoForm, cargoId: e.target.value})}
                            />
                            <Select 
                                label="Тип точки"
                                value={deliveryPointType}
                                onChange={(e: any) => {
                                    setDeliveryPointType(e.target.value);
                                    setCargoForm(prev => ({ ...prev, locatedAt: "" }));
                                    setAvailableItemsAtPoint([]);
                                }}
                                options={[
                                    { value: "STATION", label: "Станция" },
                                    { value: "BIOME", label: "Биом" },
                                ]}
                            />
                            <Select 
                                label="Локация (Point)"
                                value={cargoForm.locatedAt}
                                onChange={(e: any) => setCargoForm({...cargoForm, locatedAt: e.target.value})}
                                options={[
                                    { value: "", label: "Выберите локацию..." },
                                    ...(deliveryPointType === "STATION" ? stations : biomes).map(s => ({ 
                                        value: String(s.id), 
                                        label: s.name || `Точка #${s.deliveryPointId || s.id}` 
                                    }))
                                ]}
                                required
                            />
                        </div>

                        <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                            <h3 className="text-[#C9D1D9] font-medium mb-4 flex items-center gap-2">
                                <Package size={18} className="text-[#FF6B35]" /> Состав груза для резерва
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
                                <div className="md:col-span-3">
                                    <Select 
                                        className="mb-0"
                                        label="Тип"
                                        value={newItem.itemType}
                                        onChange={(e: any) => {
                                            setNewItem({...newItem, itemType: e.target.value, itemName: "", identificationNumber: ""});
                                            setAvailableIds([]);
                                        }}
                                        options={[
                                            { value: "EQUIPMENT", label: "Снаряжение" },
                                            { value: "WEAPON", label: "Оружие" },
                                            { value: "RESOURCE", label: "Ресурс" },
                                            { value: "TEAM", label: "Команда" },
                                        ]}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    {newItem.itemType === "TEAM" ? (
                                        <Select 
                                            label="Команда"
                                            className="mb-0"
                                            value={newItem.itemName}
                                            onChange={(e: any) => setNewItem({...newItem, itemName: e.target.value})}
                                            options={[
                                                { value: "", label: "Выберите..." },
                                                ...filteredTeams().map(t => ({ value: String(t.id), label: t.name || `ID: ${t.id}` }))
                                            ]}
                                            disabled={!cargoForm.locatedAt}
                                        />
                                    ) : (
                                        <Select 
                                            label="Предмет"
                                            className="mb-0"
                                            value={newItem.itemName}
                                            onChange={(e: any) => {
                                                const name = e.target.value;
                                                setNewItem({...newItem, itemName: name, identificationNumber: ""});
                                                if ((newItem.itemType === "WEAPON" || newItem.itemType === "EQUIPMENT")) {
                                                    fetchAvailableIds(newItem.itemType, name);
                                                }
                                            }}
                                            options={[
                                                { value: "", label: cargoForm.locatedAt ? "Выберите..." : "Сначала выберите локацию" },
                                                ...filteredItemNames().map(i => ({ 
                                                    value: i.name, 
                                                    label: newItem.itemType === "RESOURCE" ? `${i.name} (В наличии: ${i.stock})` : i.name 
                                                }))
                                            ]}
                                            disabled={!cargoForm.locatedAt}
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-3">
                                    {newItem.itemType === "RESOURCE" ? (
                                        <Input 
                                            label="Кол-во"
                                            type="number"
                                            min="1"
                                            value={newItem.quantity}
                                            onChange={(e: any) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                                            className="mb-0"
                                        />
                                    ) : (newItem.itemType === "WEAPON" || newItem.itemType === "EQUIPMENT") ? (
                                        <Select 
                                            label="ID в наличии"
                                            className="mb-0"
                                            value={newItem.identificationNumber}
                                            disabled={!newItem.itemName || idLoading}
                                            onChange={(e: any) => setNewItem({...newItem, identificationNumber: e.target.value})}
                                            options={[
                                                { value: "", label: idLoading ? "Загрузка..." : "Выберите ID..." },
                                                ...availableIds.map(id => ({ value: id, label: id }))
                                            ]}
                                        />
                                    ) : <div className="h-full flex items-end pb-2 text-xs text-[#8B949E]">N/A</div>}
                                </div>
                                <div className="md:col-span-2 flex items-end pb-0.5">
                                    <Button type="button" onClick={handleAddItem} className="w-full h-10 mb-4">
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-t border-[#30363D] pt-4">
                                {items.length > 0 ? items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-[#0D1117] border border-[#30363D] rounded">
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={
                                                        item.itemType === "WEAPON" ? "danger" : 
                                                        item.itemType === "TEAM" ? "primary" : "info"
                                                    } className="text-[10px] px-1.5 py-0">
                                                        {item.itemType === "TEAM" ? "КОМАНДА" : 
                                                         item.itemType === "WEAPON" ? "ОРУЖИЕ" : 
                                                         item.itemType === "RESOURCE" ? "РЕСУРС" : "СНАРЯЖЕНИЕ"}
                                                    </Badge>
                                                    <span className={`text-sm font-medium ${!isItemAvailable(item) ? "text-[#F85149]" : "text-[#C9D1D9]"}`}>
                                                        {item.itemType === "TEAM" 
                                                            ? (teams.find(t => String(t.id) === String(item.itemName))?.name || `Команда ${item.itemName}`)
                                                            : item.itemName
                                                        }
                                                    </span>
                                                    {!isItemAvailable(item) && (
                                                        <div className="flex items-center gap-1 text-[10px] text-[#F85149] bg-[#F85149]/10 px-1.5 py-0.5 rounded border border-[#F85149]/20 animate-pulse">
                                                            <AlertCircle size={10} />
                                                            Нет в наличии
                                                        </div>
                                                    )}
                                                </div>
                                                {(item.itemType === "WEAPON" || item.itemType === "EQUIPMENT") && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-[#8B949E] uppercase font-bold">SN:</span>
                                                        <div className="relative group/sn">
                                                            <select 
                                                                className="appearance-none bg-[#161B22] text-[#58A6FF] text-[11px] border border-[#30363D] rounded-md px-2 py-0.5 pr-6 focus:ring-1 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35] outline-none cursor-pointer hover:bg-[#1c2128] transition-all font-mono"
                                                                value={item.identificationNumber}
                                                                onChange={(e) => updateItemIdentification(idx, e.target.value)}
                                                                onFocus={() => {
                                                                    fetchAvailableIds(item.itemType, item.itemName);
                                                                }}
                                                            >
                                                                <option value="" className="bg-[#0D1117] text-[#8B949E]">Выберите ID...</option>
                                                                {getFilteredIds(item.itemType, item.itemName, idx, item.identificationNumber).map(id => (
                                                                    <option key={id} value={id} className="bg-[#0D1117] text-[#C9D1D9]">{id}</option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#30363D] group-hover/sn:text-[#FF6B35] transition-colors">
                                                                <Plus size={10} />
                                                            </div>
                                                        </div>
                                                        {item.identificationNumber && (
                                                            <Badge variant="success" className="text-[9px] py-0 px-1.5 opacity-80 border-none bg-green-500/10 text-green-400">
                                                                OK
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[#8B949E] text-xs px-2">×{item.quantity}</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setItems(items.filter((_, i) => i !== idx))}
                                            className="text-[#8B949E] hover:text-[#D32F2F] p-1 ml-2 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center py-6 text-[#8B949E] text-sm border border-dashed border-[#30363D] rounded">
                                        Список груза пуст.
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
                                Создать Cargo и зарезервировать
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
}
