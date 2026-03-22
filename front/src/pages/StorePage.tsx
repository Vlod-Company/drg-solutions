import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Input, Select } from "../components/ui/Input";
import {
    StationService,
    StoreService,
    GlossaryService, LogisticsService, EcosystemService
} from "../api/services";
import {
    Package,
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Building2,
    Boxes,
    Ship,
    Calendar,
    Import, TreePine
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

// Типы для отправки на бэкенд
interface SendItemEquipment {
    itemType: "EQUIPMENT";
    itemName: string;
    identificationNumber: string;
}

interface SendItemWeapon {
    itemType: "WEAPON";
    itemName: string;
    identificationNumber: string;
}

interface SendItemResource {
    itemType: "RESOURCE";
    itemName: string;
    quantity: number;
}

interface Logistic {
    id: number;
    sendTime: string;
    cargoId: number;
    spaceShipId?: number;
    status: string;
}

type SendItem = SendItemEquipment | SendItemWeapon | SendItemResource;

// Тип для предмета в списке добавления
interface StoreItem {
    id: string; // временный ID для key
    itemType: "EQUIPMENT" | "WEAPON" | "RESOURCE";
    itemName: string;
    identificationNumber?: string;
    quantity: number;
}

// Компонент для отображения карточки точки (станции или биома)
const PointCard = ({ point, type, onSelect }: { point: any; type: "STATION" | "BIOME"; onSelect: () => void }) => (
    <div
        className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#FF6B35]/50 transition-all cursor-pointer group"
        onClick={onSelect}
    >
        <div className="flex items-start justify-between mb-3">
            <Badge variant="info" className="group-hover:bg-[#FF6B35]/20 transition-colors">
                {type === "STATION" ? "Станция" : "Биом"}
            </Badge>
            <span className="text-xs text-[#8B949E] font-mono">
                DP: {point.deliveryPointId}
            </span>
        </div>
        <h3 className="text-[#C9D1D9] font-medium text-lg mb-1 group-hover:text-[#FF6B35] transition-colors">
            {point.name || `${type === "STATION" ? "Станция" : "Биом"} #${point.id}`}
        </h3>
        <p className="text-xs text-[#8B949E] line-clamp-2">
            {point.description || "Нет описания"}
        </p>
        <div className="mt-4 flex justify-end">
            <Button
                variant="ghost"
                size="sm"
                className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                Добавить предметы →
            </Button>
        </div>
    </div>
);

export function StorePage() {
    const [stations, setStations] = useState<any[]>([]);
    const [biomes, setBiomes] = useState<any[]>([]);
    const [equipmentGlossary, setEquipmentGlossary] = useState<any[]>([]);
    const [resourceGlossary, setResourceGlossary] = useState<any[]>([]);
    const [weaponGlossary, setWeaponGlossary] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [logistics, setLogistics] = useState<Logistic[]>([]);
    const [showImportModal, setShowImportModal] = useState(false);

    // Form state
    const [selectedPointType, setSelectedPointType] = useState<"STATION" | "BIOME">("STATION"); // <-- ДОБАВИТЬ
    const [selectedPointId, setSelectedPointId] = useState("");
    const [items, setItems] = useState<StoreItem[]>([]);

    // New item form
    const [newItem, setNewItem] = useState({
        itemType: "EQUIPMENT" as "EQUIPMENT" | "WEAPON" | "RESOURCE",
        itemName: "",
        identificationNumber: "",
        quantity: 1
    });

    // Fetch all necessary data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [stats, bios, equip, res, wep, logs] = await Promise.all([
                StationService.getAll(),
                EcosystemService.getAllBiomes(),
                GlossaryService.getEquipment(),
                GlossaryService.getResources(),
                GlossaryService.getWeapons(),
                LogisticsService.getAll()
            ]);

            setStations(Array.isArray(stats) ? stats : (stats.content || stats.data || []));
            setBiomes(Array.isArray(bios) ? bios : (bios.content || bios.data || []));
            setEquipmentGlossary(equip);
            setResourceGlossary(res);
            setWeaponGlossary(wep);
            setLogistics(Array.isArray(logs) ? logs : (logs.content || logs.data || []));
        } catch (error) {
            console.error("Failed to fetch store data:", error);
            toast.error("Ошибка загрузки данных");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Get deliveryPointId from selected station
    const getSelectedDeliveryPointId = (): number | null => {
        if (!selectedPointId) return null;

        if (selectedPointType === "STATION") {
            const station = stations.find(s => String(s.id) === String(selectedPointId));
            return station?.deliveryPointId || null;
        } else {
            const biome = biomes.find(b => String(b.id) === String(selectedPointId));
            return biome?.deliveryPointId || null;
        }
    };

    const getSelectedPointName = (): string => {
        if (!selectedPointId) return "";

        if (selectedPointType === "STATION") {
            return stations.find(s => String(s.id) === String(selectedPointId))?.name || `Станция #${selectedPointId}`;
        } else {
            return biomes.find(b => String(b.id) === String(selectedPointId))?.name || `Биом #${selectedPointId}`;
        }
    };

    // Filter glossary items based on selected type
    const getFilteredGlossaryItems = () => {
        const glossary = newItem.itemType === "EQUIPMENT" ? equipmentGlossary :
            newItem.itemType === "WEAPON" ? weaponGlossary :
                resourceGlossary;

        return glossary.map(item => ({
            value: item.name,
            label: item.name
        }));
    };


    const handleImportFromCargo = async (cargoId: number) => {
        if (!selectedPointId) {
            toast.error("Сначала выберите станцию");
            setShowImportModal(false);
            return;
        }

        setIsImporting(true);
        try {
            const cargoItems = await StoreService.getCargoItems(cargoId);

            if (!cargoItems || cargoItems.length === 0) {
                toast.info("В грузе нет предметов для импорта");
                return;
            }

            // Преобразуем полученные предметы в формат StoreItem
            const newItems: StoreItem[] = cargoItems.map((item: any, index: number) => {
                const baseItem = {
                    id: `import-${Date.now()}-${index}`,
                    itemType: item.itemType as "EQUIPMENT" | "WEAPON" | "RESOURCE",
                    itemName: item.itemName,
                };

                if (item.itemType === "RESOURCE") {
                    return {
                        ...baseItem,
                        quantity: item.quantity || 1
                    };
                } else {
                    return {
                        ...baseItem,
                        identificationNumber: item.identificationNumber,
                        quantity: 1
                    };
                }
            });

            setItems([...items, ...newItems]);
            toast.success(`Импортировано ${newItems.length} предметов из груза #${cargoId}`);
            setShowImportModal(false);
        } catch (error) {
            console.error("Failed to import cargo items:", error);
            toast.error("Ошибка при импорте предметов из груза");
        } finally {
            setIsImporting(false);
        }
    };
    // Handle adding new item to the list
    const handleAddItem = () => {
        if (!newItem.itemName) {
            toast.error("Выберите предмет");
            return;
        }

        // Validate identification number for equipment/weapons
        if ((newItem.itemType === "EQUIPMENT" || newItem.itemType === "WEAPON") && !newItem.identificationNumber) {
            toast.error("Выберите ID предмета");
            return;
        }

        // Validate quantity for resources
        if (newItem.itemType === "RESOURCE" && newItem.quantity < 1) {
            toast.error("Количество должно быть больше 0");
            return;
        }

        if (newItem.itemType !== "RESOURCE") {
            const isDuplicate = items.some(
                item => item.itemType === newItem.itemType &&
                    item.itemName === newItem.itemName &&
                    item.identificationNumber === newItem.identificationNumber
            );

            if (isDuplicate) {
                toast.error("Предмет с таким серийным номером уже есть в списке");
                return;
            }
        }

        const newStoreItem: StoreItem = {
            id: Date.now().toString() + Math.random(),
            itemType: newItem.itemType,
            itemName: newItem.itemName,
            ...(newItem.itemType === "RESOURCE"
                    ? { quantity: newItem.quantity }
                    : { identificationNumber: newItem.identificationNumber }
            )
        };

        setItems([...items, newStoreItem]);

        // Reset form
        setNewItem({
            itemType: newItem.itemType,
            itemName: "",
            identificationNumber: "",
            quantity: 1
        });
    };

    // Handle removing item from list
    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Handle form submission
    const handleAddItems = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPointId) {
            toast.error("Выберите станцию");
            return;
        }

        if (items.length === 0) {
            toast.error("Добавьте хотя бы один предмет");
            return;
        }

        const dpId = getSelectedDeliveryPointId();
        if (!dpId) {
            toast.error("Не удалось определить ID точки доставки");
            return;
        }

        setIsSubmitting(true);
        try {
            // Transform items to SendItemDTO format
            const sendItems: SendItem[] = items.map(item => {
                if (item.itemType === "RESOURCE") {
                    return {
                        itemType: "RESOURCE",
                        itemName: item.itemName,
                        quantity: item.quantity
                    };
                } else if (item.itemType === "EQUIPMENT") {
                    return {
                        itemType: "EQUIPMENT",
                        itemName: item.itemName,
                        identificationNumber: item.identificationNumber!
                    };
                } else {
                    return {
                        itemType: "WEAPON",
                        itemName: item.itemName,
                        identificationNumber: item.identificationNumber!
                    };
                }
            });

            await StoreService.addItemsToDeliveryPoint(dpId, sendItems);

            toast.success("Предметы успешно добавлены на станцию");
            setShowAddModal(false);
            setItems([]);
            setSelectedPointId("");

            // Refresh data if needed
            // fetchData();
        } catch (error) {
            console.error("Failed to add items:", error);
            toast.error("Ошибка при добавлении предметов");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal closes
    const handleModalClose = () => {
        setShowAddModal(false);
        setShowImportModal(false);  // <-- ДОБАВИТЬ
        setItems([]);
        setSelectedPointId("");
        setSelectedPointType("STATION");
        setNewItem({
            itemType: "EQUIPMENT",
            itemName: "",
            identificationNumber: "",
            quantity: 1
        });
    };

    return (
        <Layout currentPage="/store">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#C9D1D9] flex items-center gap-3">
                            <Building2 className="text-[#FF6B35]" /> Управление складом
                        </h1>
                        <p className="text-[#8B949E] mt-1">
                            Добавление предметов на станции и управление запасами
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <Plus size={20} /> Добавить предметы
                    </Button>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-[#FF6B35]" size={40} />
                        <span className="text-[#8B949E]">Загрузка станций...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="p-6 border-dashed border-[#30363D] bg-transparent">
                            <div className="flex items-center gap-3 mb-6">
                                <Building2 size={24} className="text-[#FF6B35]" />
                                <h2 className="text-xl font-semibold text-[#C9D1D9]">Точки доставки</h2>
                            </div>

                            {/* Tabs for Stations/Biomes */}
                            <div className="flex gap-2 mb-6 p-1 bg-[#0D1117] border border-[#30363D] rounded-lg w-fit">
                                <button
                                    onClick={() => setSelectedPointType("STATION")}
                                    className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                                        selectedPointType === "STATION"
                                            ? "bg-[#FF6B35] text-white"
                                            : "text-[#8B949E] hover:text-[#C9D1D9]"
                                    }`}
                                >
                                    <Building2 size={16} />
                                    Станции
                                </button>
                                <button
                                    onClick={() => setSelectedPointType("BIOME")}
                                    className={`px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                                        selectedPointType === "BIOME"
                                            ? "bg-[#FF6B35] text-white"
                                            : "text-[#8B949E] hover:text-[#C9D1D9]"
                                    }`}
                                >
                                    <TreePine size={16} />
                                    Биомы
                                </button>
                            </div>

                            {/* Stations Grid */}
                            {selectedPointType === "STATION" && (
                                <>
                                    {stations.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-[#30363D] rounded-lg">
                                            <Building2 size={32} className="mx-auto text-[#30363D] mb-3" />
                                            <p className="text-[#8B949E]">Станции не найдены</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {stations.map((station) => (
                                                <PointCard
                                                    key={station.id}
                                                    point={station}
                                                    type="STATION"
                                                    onSelect={() => {
                                                        setSelectedPointId(String(station.id));
                                                        setShowAddModal(true);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Biomes Grid */}
                            {selectedPointType === "BIOME" && (
                                <>
                                    {biomes.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-[#30363D] rounded-lg">
                                            <TreePine size={32} className="mx-auto text-[#30363D] mb-3" />
                                            <p className="text-[#8B949E]">Биомы не найдены</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {biomes.map((biome) => (
                                                <PointCard
                                                    key={biome.id}
                                                    point={biome}
                                                    type="BIOME"
                                                    onSelect={() => {
                                                        setSelectedPointId(String(biome.id));
                                                        setShowAddModal(true);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </div>
                )}

                {/* Add Items Modal */}
                <Modal
                    isOpen={showAddModal}
                    onClose={handleModalClose}
                    title="Добавление предметов на станцию"
                    size="lg"
                >
                    <form onSubmit={handleAddItems} className="space-y-6">
                        {/* Point Selection */}
                        <div className="p-4 bg-[#161B22]/50 border border-[#30363D] rounded-lg">
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <Select
                                        label="Тип точки"
                                        value={selectedPointType}
                                        onChange={(e: any) => {
                                            setSelectedPointType(e.target.value);
                                            setSelectedPointId("");
                                        }}
                                        options={[
                                            { value: "STATION", label: "Станция" },
                                            { value: "BIOME", label: "Биом" }
                                        ]}
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <Select
                                        label={selectedPointType === "STATION" ? "Выберите станцию" : "Выберите биом"}
                                        value={selectedPointId}
                                        onChange={(e: any) => setSelectedPointId(e.target.value)}
                                        options={[
                                            { value: "", label: `Выберите ${selectedPointType === "STATION" ? "станцию" : "биом"}...` },
                                            ...(selectedPointType === "STATION" ? stations : biomes).map(p => ({
                                                value: String(p.id),
                                                label: `${p.name || `${selectedPointType === "STATION" ? "Станция" : "Биом"} #${p.id}`} (DP: ${p.deliveryPointId})`
                                            }))
                                        ]}
                                        required
                                    />
                                </div>
                            </div>

                            {selectedPointId && (
                                <div className="mt-2 text-xs text-[#8B949E] flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-green-500"/>
                                    Выбрана: {getSelectedPointName()}
                                </div>
                            )}

                            {/* Import button - показываем только если есть активные грузы */}
                            {selectedPointId && logistics.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-[#30363D]">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full border border-dashed border-[#FF6B35]/30 hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 text-[#FF6B35]"
                                        onClick={() => setShowImportModal(true)}
                                    >
                                        <Import size={16} className="mr-2"/>
                                        Импортировать предметы из груза
                                    </Button>
                                </div>
                            )}
                        </div>


                        {/* Items List */}
                        <div className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg">
                            <h3 className="text-[#C9D1D9] font-medium mb-4 flex items-center gap-2">
                                <Package size={18} className="text-[#FF6B35]"/>
                                Предметы для добавления
                            </h3>

                            {/* Add Item Form */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 mb-4">
                                <div className="md:col-span-3">
                                    <Select
                                        label="Тип"
                                        value={newItem.itemType}
                                        onChange={(e: any) => {
                                            setNewItem({
                                                ...newItem,
                                                itemType: e.target.value,
                                                itemName: "",
                                                identificationNumber: ""
                                            });
                                        }}
                                        options={[
                                            { value: "EQUIPMENT", label: "Снаряжение" },
                                            { value: "WEAPON", label: "Оружие" },
                                            { value: "RESOURCE", label: "Ресурс" }
                                        ]}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <Select
                                        label="Предмет"
                                        value={newItem.itemName}
                                        onChange={(e: any) => {
                                            const name = e.target.value;
                                            setNewItem({
                                                ...newItem,
                                                itemName: name,
                                                identificationNumber: ""
                                            });
                                        }}
                                        options={[
                                            { value: "", label: "Выберите предмет..." },
                                            ...getFilteredGlossaryItems()
                                        ]}
                                        disabled={!selectedPointId}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    {newItem.itemType === "RESOURCE" ? (
                                        <Input
                                            label="Количество"
                                            type="number"
                                            min="1"
                                            value={newItem.quantity}
                                            onChange={(e: any) => setNewItem({
                                                ...newItem,
                                                quantity: Number(e.target.value)
                                            })}
                                            disabled={!newItem.itemName}
                                        />
                                    ) : (
                                        <Input
                                            label="Серийный номер (ID)"
                                            value={newItem.identificationNumber}
                                            onChange={(e: any) => setNewItem({
                                                ...newItem,
                                                identificationNumber: e.target.value
                                            })}
                                            placeholder="Введите ID предмета"
                                            disabled={!newItem.itemName}
                                            className="font-mono"
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-2 flex items-end pb-0.5">
                                    <Button
                                        type="button"
                                        onClick={handleAddItem}
                                        className="w-full h-10 mb-4"
                                        disabled={!selectedPointId || !newItem.itemName}
                                    >
                                        <Plus size={18} />
                                    </Button>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar border-t border-[#30363D] pt-4">
                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-2 bg-[#0D1117] border border-[#30363D] rounded group/item hover:border-[#FF6B35]/30 transition-colors"
                                        >
                                            <div className="flex-1 flex items-center gap-3">
                                                <Badge variant={
                                                    item.itemType === "WEAPON" ? "danger" :
                                                        item.itemType === "EQUIPMENT" ? "info" : "success"
                                                } className="text-[10px] px-1.5 py-0">
                                                    {item.itemType === "WEAPON" ? "ОРУЖИЕ" :
                                                        item.itemType === "EQUIPMENT" ? "СНАРЯЖЕНИЕ" : "РЕСУРС"}
                                                </Badge>
                                                <span className="text-sm text-[#C9D1D9]">
                                                    {item.itemName}
                                                </span>
                                                {item.itemType === "RESOURCE" ? (
                                                    <span className="text-xs text-[#8B949E]">
                                                        ×{item.quantity}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-mono text-[#58A6FF]">
                                                        SN: {item.identificationNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-[#8B949E] hover:text-[#D32F2F] p-1 transition-colors opacity-0 group-hover/item:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-[#8B949E] text-sm border border-dashed border-[#30363D] rounded">
                                        Список предметов пуст. Добавьте предметы для отправки на станцию.
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            {items.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-[#30363D] flex justify-between items-center text-sm">
                                    <span className="text-[#8B949E]">
                                        Всего предметов: <span className="text-[#C9D1D9] font-bold">{items.length}</span>
                                    </span>
                                    <span className="text-[#8B949E]">
                                        Ресурсов: <span className="text-[#C9D1D9]">
                                            {items.filter(i => i.itemType === "RESOURCE").length}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-[#30363D]">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                type="button"
                                onClick={handleModalClose}
                            >
                                Отмена
                            </Button>
                            <Button
                                className="flex-1"
                                type="submit"
                                disabled={isSubmitting || items.length === 0 || !selectedPointId}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                ) : null}
                                Добавить на станцию
                            </Button>
                        </div>
                    </form>
                    {/* Modal for Import Selection */}
                    <Modal
                        isOpen={showImportModal}
                        onClose={() => setShowImportModal(false)}
                        title="Выберите груз для импорта"
                        size="md"
                    >
                        <div className="space-y-4">
                            <p className="text-sm text-[#8B949E] mb-4">
                                Выберите груз, из которого нужно импортировать предметы на станцию{' '}
                                <span className="text-[#FF6B35] font-bold">
                {stations.find(s => String(s.id) === selectedPointId)?.name}
            </span>
                            </p>

                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {logistics
                                    .filter(log => log.status !== "COMPLETED" && log.status !== "CANCELLED")
                                    .map((log) => (
                                        <div
                                            key={log.id}
                                            className="p-4 bg-[#161B22] border border-[#30363D] rounded-lg hover:border-[#FF6B35] transition-all cursor-pointer group"
                                            onClick={() => handleImportFromCargo(log.cargoId)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge variant={
                                                    log.status === "IN_PROGRESS" ? "warning" :
                                                        log.status === "PLANNED" ? "info" : "success"
                                                }>
                                                    {log.status}
                                                </Badge>
                                                <span className="text-xs font-mono text-[#8B949E]">
                                ID: {log.id}
                            </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-[#C9D1D9]">
                                                    <Ship size={14} className="text-[#FF6B35]" />
                                                    Груз #{log.cargoId}
                                                </div>
                                                {log.spaceShipId && (
                                                    <div className="flex items-center gap-1.5 text-[#8B949E]">
                                                        <Package size={14} />
                                                        Корабль #{log.spaceShipId}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8B949E]">
                                                <Calendar size={12} />
                                                {new Date(log.sendTime).toLocaleString("ru-RU")}
                                            </div>

                                            <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs text-[#FF6B35]">Выбрать →</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {logistics.filter(log => log.status !== "COMPLETED" && log.status !== "CANCELLED").length === 0 && (
                                <div className="text-center py-8 border border-dashed border-[#30363D] rounded-lg">
                                    <Package size={32} className="mx-auto text-[#30363D] mb-3" />
                                    <p className="text-[#8B949E]">Нет активных грузов для импорта</p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-[#30363D]">
                                <Button variant="ghost" onClick={() => setShowImportModal(false)}>
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </Modal>
            </div>
        </Layout>
    );
}