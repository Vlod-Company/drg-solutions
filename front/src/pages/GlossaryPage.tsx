import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import {Input, Select} from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import {BookOpen, Search, Loader2, Edit3, ExternalLink, Info, Crosshair, Trash2, Badge, Plus} from "lucide-react";
import {
    EcosystemService,
    GlossaryService,
    AuthService,
    ImpactTypeService,
    EquipmentInfoService,
    WeaponInfoService, ResourceInfoService
} from "../api/services";
import { toast } from "sonner";
import { WeaponInfoDTO } from "../types/api";

interface ImpactTypeShortDto {
    id: number;
    name: string;
}

interface ResourceInfoDto {
    id: number;
    name: string;
    description: string;
    weightPerUnit: number;
}

interface EquipmentInfoDto {
    id: number;
    name: string;
    description: string;
    weight: number;
}

interface GlossaryTerm {
    id: string;
    originalId?: number;
    term: string;
    category: string;
    definition: string;
    raw?: any;
}

interface MonsterDto {
    id: number;
    name: string;
    description: string;
    dangerLevel: number;
    heritage: string;
    monsterType: string;
    biomeId: number;
    armorType: string;
    weaknesses: ImpactTypeShortDto[];
    strengths: ImpactTypeShortDto[];
}

export function GlossaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Планеты");
    const [selectedItem, setSelectedItem] = useState<GlossaryTerm | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [editForm, setEditForm] = useState({ term: "", definition: "" });
    const [userRoles, setUserRoles] = useState<string[]>([]);

    const [impactTypes, setImpactTypes] = useState<ImpactTypeShortDto[]>([]);
    const [monsterForm, setMonsterForm] = useState<Partial<MonsterDto>>({
        name: "",
        description: "",
        dangerLevel: 1,
        heritage: "",
        monsterType: "",
        biomeId: undefined,
        armorType: "",
        weaknesses: [],
        strengths: []
    });
    const [resourceForm, setResourceForm] = useState<Partial<ResourceInfoDto>>({
        name: "",
        description: "",
        weightPerUnit: 0
    });
    const [weaponForm, setWeaponForm] = useState<Partial<WeaponInfoDTO>>({
        name: "",
        description: "",
        weight: 0,
        impactTypeId: undefined
    });
    const [equipmentForm, setEquipmentForm] = useState<Partial<EquipmentInfoDto>>({
        name: "",
        description: "",
        weight: 0
    });
    const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);
    const [selectedWeaknesses, setSelectedWeaknesses] = useState<number[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const fetchUserRoles = async () => {
        try {
            const me = await AuthService.getMe();
            setUserRoles(me.roles || []);
        } catch (error) {
            console.error("Failed to fetch user roles", error);
        }
    };

    const fetchTerms = async () => {
        try {
            setLoading(true);
            const [planets, resources, monsters, biomes, equipment, weapons] = await Promise.all([
                EcosystemService.getAllPlanets(),
                ResourceInfoService.getAll(),
                EcosystemService.getAllMonsters(),
                GlossaryService.getBiomes(),
                EquipmentInfoService.getAll(),
                WeaponInfoService.getAll(),
            ]);

            const allTerms: GlossaryTerm[] = [
                ...planets.map((p: any) => ({
                    id: `${p.id}`,
                    originalId: p.id,
                    term: p.name || `Планета ${p.id}`,
                    category: "Планеты",
                    definition: p.description || "Исследованная планета в данном секторе. Дополнительные данные засекречены или отсутствуют.",
                    raw: p,
                })),
                ...resources.map((r: any, i: number) => ({
                    id: `${r.id}`,
                    originalId: r.id,
                    term: r.name || "Ресурс",
                    category: "Ресурсы",
                    definition: r.description || "Минеральное сырье Hoxxes IV. Используется в промышленных и военных целях.",
                    raw: r,
                })),
                ...monsters.map((m: any) => ({
                    id: `${m.id}`,
                    originalId: m.id,
                    term: m.name || "Неопознанный объект",
                    category: "Фауна",
                    definition: m.description || `Биологическая форма жизни. Рекомендуется соблюдать безопасную дистанцию.`,
                    raw: m,
                })),
                ...biomes.map((b: any) => ({
                    id: `${b.id}`,
                    originalId: b.id,
                    term: b.name || "Биом",
                    category: "Биомы",
                    definition: b.description || "Специфическая природная зона с уникальными условиями.",
                    raw: b,
                })),
                ...equipment.map((e: any, i: number) => ({
                    id: `${e.id}`,
                    originalId: e.id,
                    term: e.name || "Оборудование",
                    category: "Оборудование",
                    definition: e.description || "Инженерное решение для операций в экстремальных условиях.",
                    raw: e,
                })),
                ...weapons.map((w: WeaponInfoDTO, i: number) => ({
                    id: `${w.id}`,
                    originalId: w.id,
                    term: w.name || "Вооружение",
                    category: "Оружие",
                    definition: w.description || "Средство нейтрализации биологических угроз.",
                    raw: w,
                })),
            ];

            setTerms(allTerms);
        } catch (error) {
            console.error("Failed to fetch glossary terms:", error);
            toast.error("Не удалось загрузить данные глоссария");
        } finally {
            setLoading(false);
        }
    };

    const fetchImpactTypes = async () => {
        try {
            const types = await ImpactTypeService.getAll();
            setImpactTypes(Array.isArray(types) ? types : []);
        } catch (error) {
            console.error("Failed to fetch impact types:", error);
        }
    };

    useEffect(() => {
        fetchTerms();
        fetchUserRoles();
        fetchImpactTypes();

        return () => {
            resetForms();
        };
    }, []);

    const canEdit = userRoles.some(r =>
        ["ROLE_ADMIN", "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE"].includes(r)
    );

    const canCreate = canEdit;
    const canDelete = canEdit;

    // Функции для монстров
    const handleCreateMonster = async () => {
        try {
            const newMonster = await EcosystemService.createMonster({
                name: monsterForm.name!,
                description: monsterForm.description!,
                dangerLevel: monsterForm.dangerLevel!,
                heritage: monsterForm.heritage!,
                monsterType: monsterForm.monsterType!,
                biomeId: monsterForm.biomeId!,
                armorType: monsterForm.armorType!,
                weaknesses: selectedWeaknesses,
                strengths: selectedStrengths
            });
            toast.success("Монстр успешно создан");
            setIsCreateMode(false);
            resetForms();
            fetchTerms();
        } catch (error) {
            console.error("Failed to create monster:", error);
            toast.error("Ошибка при создании монстра");
        }
    };

    const handleUpdateMonster = async (id: number) => {
        try {
            await EcosystemService.updateMonster(id, {
                name: monsterForm.name!,
                description: monsterForm.description!,
                dangerLevel: monsterForm.dangerLevel!,
                heritage: monsterForm.heritage!,
                monsterType: monsterForm.monsterType!,
                biomeId: monsterForm.biomeId!,
                armorType: monsterForm.armorType!,
                weaknesses: selectedWeaknesses,
                strengths: selectedStrengths
            });
            toast.success("Монстр обновлен");
            setIsEditMode(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to update monster:", error);
            toast.error("Ошибка при обновлении монстра");
        }
    };

    const handleDeleteMonster = async (id: number) => {
        try {
            await EcosystemService.deleteMonster(id);
            toast.success("Монстр удален");
            setDeleteConfirm(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to delete monster:", error);
            toast.error("Ошибка при удалении монстра");
        }
    };

// Функции для ресурсов
    const handleCreateResource = async () => {
        try {
            await ResourceInfoService.create({
                name: resourceForm.name!,
                description: resourceForm.description!,
                weightPerUnit: resourceForm.weightPerUnit!
            });
            toast.success("Ресурс успешно создан");
            setIsCreateMode(false);
            resetForms();
            fetchTerms();
        } catch (error) {
            console.error("Failed to create resource:", error);
            toast.error("Ошибка при создании ресурса");
        }
    };

    const handleUpdateResource = async (id: number) => {
        try {
            await ResourceInfoService.update(id, {
                name: resourceForm.name!,
                description: resourceForm.description!,
                weightPerUnit: resourceForm.weightPerUnit!
            });
            toast.success("Ресурс обновлен");
            setIsEditMode(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to update resource:", error);
            toast.error("Ошибка при обновлении ресурса");
        }
    };

    const handleDeleteResource = async (id: number) => {
        try {
            await ResourceInfoService.delete(id);
            toast.success("Ресурс удален");
            setDeleteConfirm(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to delete resource:", error);
            toast.error("Ошибка при удалении ресурса");
        }
    };

// Функции для оружия
    const handleCreateWeapon = async () => {
        try {
            await WeaponInfoService.create({
                name: weaponForm.name!,
                description: weaponForm.description!,
                weight: weaponForm.weight!,
                impactTypeId: weaponForm.impactTypeId!
            });
            toast.success("Оружие успешно создано");
            setIsCreateMode(false);
            resetForms();
            fetchTerms();
        } catch (error) {
            console.error("Failed to create weapon:", error);
            toast.error("Ошибка при создании оружия");
        }
    };

    const handleUpdateWeapon = async (id: number) => {
        try {
            await WeaponInfoService.update(id, {
                name: weaponForm.name!,
                description: weaponForm.description!,
                weight: weaponForm.weight!,
                impactTypeId: weaponForm.impactTypeId!
            });
            toast.success("Оружие обновлено");
            setIsEditMode(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to update weapon:", error);
            toast.error("Ошибка при обновлении оружия");
        }
    };

    const handleDeleteWeapon = async (id: number) => {
        try {
            await WeaponInfoService.delete(id);
            toast.success("Оружие удалено");
            setDeleteConfirm(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to delete weapon:", error);
            toast.error("Ошибка при удалении оружия");
        }
    };

// Функции для снаряжения
    const handleCreateEquipment = async () => {
        try {
            await EquipmentInfoService.create({
                name: equipmentForm.name!,
                description: equipmentForm.description!,
                weight: equipmentForm.weight!
            });
            toast.success("Снаряжение успешно создано");
            setIsCreateMode(false);
            resetForms();
            fetchTerms();
        } catch (error) {
            console.error("Failed to create equipment:", error);
            toast.error("Ошибка при создании снаряжения");
        }
    };

    const handleUpdateEquipment = async (id: number) => {
        try {
            await EquipmentInfoService.update(id, {
                name: equipmentForm.name!,
                description: equipmentForm.description!,
                weight: equipmentForm.weight!
            });
            toast.success("Снаряжение обновлено");
            setIsEditMode(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to update equipment:", error);
            toast.error("Ошибка при обновлении снаряжения");
        }
    };

    const handleDeleteEquipment = async (id: number) => {
        try {
            await EquipmentInfoService.delete(id);
            toast.success("Снаряжение удалено");
            setDeleteConfirm(false);
            setSelectedItem(null);
            fetchTerms();
        } catch (error) {
            console.error("Failed to delete equipment:", error);
            toast.error("Ошибка при удалении снаряжения");
        }
    };

    // Функция сброса форм
    const resetForms = () => {
        setMonsterForm({
            name: "",
            description: "",
            dangerLevel: 1,
            heritage: "",
            monsterType: "",
            biomeId: undefined,
            armorType: "",
            weaknesses: [],
            strengths: []
        });
        setResourceForm({ name: "", description: "", weightPerUnit: 0 });
        setWeaponForm({ name: "", description: "", weight: 0, impactTypeId: undefined });
        setEquipmentForm({ name: "", description: "", weight: 0 });
        setSelectedStrengths([]);
        setSelectedWeaknesses([]);
        setEditForm({ term: "", definition: "" });
    };

    const handleOpenDetails = (item: GlossaryTerm) => {
        setSelectedItem(item);
        setEditForm({ term: item.term, definition: item.definition });

        resetForms();

        // Заполнить формы в зависимости от категории
        if (item.category === "Фауна" && item.raw) {
            setMonsterForm({
                name: item.raw.name || "",
                description: item.raw.description || "",
                dangerLevel: item.raw.dangerLevel || 1,
                heritage: item.raw.heritage || "",
                monsterType: item.raw.monsterType || "",
                biomeId: item.raw.biomeId,
                armorType: item.raw.armorType || "",
            });
            setSelectedStrengths(item.raw.strengths?.map((s: any) => s.id) || []);
            setSelectedWeaknesses(item.raw.weaknesses?.map((w: any) => w.id) || []);
        } else if (item.category === "Ресурсы" && item.raw) {
            setResourceForm({
                name: item.raw.name || "",
                description: item.raw.description || "",
                weightPerUnit: item.raw.weightPerUnit || 0
            });
        } else if (item.category === "Оружие" && item.raw) {
            setWeaponForm({
                name: item.raw.name || "",
                description: item.raw.description || "",
                weight: item.raw.weight || 0,
                impactTypeId: item.raw.impactType?.id
            });
        } else if (item.category === "Оборудование" && item.raw) {
            setEquipmentForm({
                name: item.raw.name || "",
                description: item.raw.description || "",
                weight: item.raw.weight || 0
            });
        }

        setIsEditMode(false);
        setIsCreateMode(false);
        setDeleteConfirm(false);
    };

    const handleSave = async () => {
        if (!selectedItem || !selectedItem.originalId) return;

        try {
            if (selectedItem.category === "Планеты") {
                await EcosystemService.updatePlanet(selectedItem.originalId, {
                    name: editForm.term,
                });
            } else if (selectedItem.category === "Биомы") {
                await EcosystemService.updateBiome(selectedItem.originalId, {
                    name: editForm.term,
                    description: editForm.definition,
                    planetId: selectedItem.raw.planetId,
                });
            }
            toast.success("Изменения сохранены");
            setIsEditMode(false);
            fetchTerms();
        } catch (error) {
            console.error("Failed to save changes", error);
            toast.error("Ошибка при сохранении");
        }
    };

    const categories = ["Планеты", "Ресурсы", "Фауна", "Биомы", "Оборудование", "Оружие"];

    const filteredTerms = terms.filter(
        (term: GlossaryTerm) =>
            term.category === activeTab &&
            (term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            term.definition.toLowerCase().includes(searchTerm.toLowerCase())),
    );

    const renderEditForm = () => {
        if (!selectedItem) return null;

        switch (selectedItem.category) {
            case "Фауна":
                return renderMonsterForm(true);
            case "Ресурсы":
                return renderResourceForm(true);
            case "Оружие":
                return renderWeaponForm(true);
            case "Оборудование":
                return renderEquipmentForm(true);
            default:
                return (
                    <div className="space-y-4">
                        <Input
                            label="Наименование"
                            value={editForm.term}
                            onChange={(e) => setEditForm({...editForm, term: e.target.value})}
                        />
                        <Textarea
                            label="Описание"
                            value={editForm.definition}
                            onChange={(e) => setEditForm({...editForm, definition: e.target.value})}
                            rows={6}
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="ghost" onClick={() => setIsEditMode(false)}>
                                Отмена
                            </Button>
                            <Button onClick={handleSave} className="bg-[#FF6B35] text-white">
                                Сохранить
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    const renderCreateForm = () => {
        switch (activeTab) {
            case "Фауна":
                return renderMonsterForm(false);
            case "Ресурсы":
                return renderResourceForm(false);
            case "Оружие":
                return renderWeaponForm(false);
            case "Оборудование":
                return renderEquipmentForm(false);
            default:
                return null;
        }
    };

    const renderMonsterForm = (isEdit: boolean) => (
        <div className="space-y-4">
            <Input
                label="Название"
                value={monsterForm.name}
                onChange={(e) => setMonsterForm({...monsterForm, name: e.target.value})}
                required
            />

            <Textarea
                label="Описание"
                value={monsterForm.description}
                onChange={(e) => setMonsterForm({...monsterForm, description: e.target.value})}
                rows={3}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Уровень опасности (1-5)"
                    type="number"
                    min="1"
                    max="5"
                    value={monsterForm.dangerLevel}
                    onChange={(e) => setMonsterForm({...monsterForm, dangerLevel: Number(e.target.value)})}
                    required
                />

                <Input
                    label="Тип брони"
                    value={monsterForm.armorType}
                    onChange={(e) => setMonsterForm({...monsterForm, armorType: e.target.value})}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Происхождение"
                    value={monsterForm.heritage}
                    onChange={(e) => setMonsterForm({...monsterForm, heritage: e.target.value})}
                    required
                />

                <Input
                    label="Тип монстра"
                    value={monsterForm.monsterType}
                    onChange={(e) => setMonsterForm({...monsterForm, monsterType: e.target.value})}
                    required
                />
            </div>

            <Input
                label="ID биома"
                type="number"
                value={monsterForm.biomeId}
                onChange={(e) => setMonsterForm({...monsterForm, biomeId: Number(e.target.value)})}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-mono text-[#8B949E] mb-2">
                        Сильные стороны (устойчивость)
                    </label>
                    <Select
                        multiple
                        value={selectedStrengths}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                            setSelectedStrengths(values);
                        }}
                        options={impactTypes.map(it => ({
                            value: String(it.id),
                            label: it.name
                        }))}
                        className="h-32"
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono text-[#8B949E] mb-2">
                        Слабые стороны (уязвимости)
                    </label>
                    <Select
                        multiple
                        value={selectedWeaknesses}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
                            setSelectedWeaknesses(values);
                        }}
                        options={impactTypes.map(it => ({
                            value: String(it.id),
                            label: it.name
                        }))}
                        className="h-32"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => isEdit ? setIsEditMode(false) : setIsCreateMode(false)}>
                    Отмена
                </Button>
                {canDelete && isEdit && (
                    <Button
                        variant="danger"
                        onClick={() => setDeleteConfirm(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Удалить
                    </Button>
                )}
                <Button
                    onClick={() => {
                        if (isEdit && selectedItem?.originalId) {
                            handleUpdateMonster(selectedItem.originalId);
                        } else {
                            handleCreateMonster();
                        }
                    }}
                    className="bg-[#FF6B35] text-white"
                >
                    {isEdit ? "Сохранить" : "Создать"}
                </Button>
            </div>
        </div>
    );

    const renderResourceForm = (isEdit: boolean) => (
        <div className="space-y-4">
            <Input
                label="Название ресурса"
                value={resourceForm.name}
                onChange={(e) => setResourceForm({...resourceForm, name: e.target.value})}
                required
            />

            <Textarea
                label="Описание"
                value={resourceForm.description}
                onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                rows={4}
                required
            />

            <Input
                label="Вес за единицу (кг)"
                type="number"
                step="0.1"
                value={resourceForm.weightPerUnit}
                onChange={(e) => setResourceForm({...resourceForm, weightPerUnit: Number(e.target.value)})}
                required
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => isEdit ? setIsEditMode(false) : setIsCreateMode(false)}>
                    Отмена
                </Button>
                {canDelete && isEdit && (
                    <Button
                        variant="danger"
                        onClick={() => setDeleteConfirm(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Удалить
                    </Button>
                )}
                <Button
                    onClick={() => {
                        if (isEdit && selectedItem?.originalId) {
                            handleUpdateResource(selectedItem.originalId);
                        } else {
                            handleCreateResource();
                        }
                    }}
                    className="bg-[#FF6B35] text-white"
                >
                    {isEdit ? "Сохранить" : "Создать"}
                </Button>
            </div>
        </div>
    );

    const renderWeaponForm = (isEdit: boolean) => (
        <div className="space-y-4">
            <Input
                label="Название оружия"
                value={weaponForm.name}
                onChange={(e) => setWeaponForm({...weaponForm, name: e.target.value})}
                required
            />

            <Textarea
                label="Описание"
                value={weaponForm.description}
                onChange={(e) => setWeaponForm({...weaponForm, description: e.target.value})}
                rows={4}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Вес (кг)"
                    type="number"
                    step="0.1"
                    value={weaponForm.weight}
                    onChange={(e) => setWeaponForm({...weaponForm, weight: Number(e.target.value)})}
                    required
                />

                <Select
                    label="Тип урона"
                    value={weaponForm.impactTypeId}
                    onChange={(e) => setWeaponForm({...weaponForm, impactTypeId: Number(e.target.value)})}
                    options={[
                        { value: "", label: "Выберите тип урона..." },
                        ...impactTypes.map(it => ({
                            value: String(it.id),
                            label: it.name
                        }))
                    ]}
                    required
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => isEdit ? setIsEditMode(false) : setIsCreateMode(false)}>
                    Отмена
                </Button>
                {canDelete && isEdit && (
                    <Button
                        variant="danger"
                        onClick={() => setDeleteConfirm(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Удалить
                    </Button>
                )}
                <Button
                    onClick={() => {
                        if (isEdit && selectedItem?.originalId) {
                            handleUpdateWeapon(selectedItem.originalId);
                        } else {
                            handleCreateWeapon();
                        }
                    }}
                    className="bg-[#FF6B35] text-white"
                >
                    {isEdit ? "Сохранить" : "Создать"}
                </Button>
            </div>
        </div>
    );

    const renderEquipmentForm = (isEdit: boolean) => (
        <div className="space-y-4">
            <Input
                label="Название снаряжения"
                value={equipmentForm.name}
                onChange={(e) => setEquipmentForm({...equipmentForm, name: e.target.value})}
                required
            />

            <Textarea
                label="Описание"
                value={equipmentForm.description}
                onChange={(e) => setEquipmentForm({...equipmentForm, description: e.target.value})}
                rows={4}
                required
            />

            <Input
                label="Вес (кг)"
                type="number"
                step="0.1"
                value={equipmentForm.weight}
                onChange={(e) => setEquipmentForm({...equipmentForm, weight: Number(e.target.value)})}
                required
            />

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => isEdit ? setIsEditMode(false) : setIsCreateMode(false)}>
                    Отмена
                </Button>
                {canDelete && isEdit && (
                    <Button
                        variant="danger"
                        onClick={() => setDeleteConfirm(true)}
                    >
                        <Trash2 size={16} className="mr-2" />
                        Удалить
                    </Button>
                )}
                <Button
                    onClick={() => {
                        if (isEdit && selectedItem?.originalId) {
                            handleUpdateEquipment(selectedItem.originalId);
                        } else {
                            handleCreateEquipment();
                        }
                    }}
                    className="bg-[#FF6B35] text-white"
                >
                    {isEdit ? "Сохранить" : "Создать"}
                </Button>
            </div>
        </div>
    );

    const renderViewMode = () => {
        if (!selectedItem) return null;

        return (
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-[#FF6B35]/10 rounded-lg border border-[#FF6B35]/20 text-[#FF6B35]">
                        {selectedItem.category === "Оружие" ? <Crosshair size={28} /> : <BookOpen size={28} />}
                    </div>
                    <div>
                        <h2 className="text-[#C9D1D9] font-mono text-2xl font-bold">{selectedItem.term}</h2>
                        <span className="text-xs font-mono text-[#FF6B35] uppercase tracking-widest bg-[#FF6B35]/10 px-2 py-0.5 rounded">
                        {selectedItem.category}
                    </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-lg">
                        <p className="text-[#C9D1D9] leading-relaxed">
                            {selectedItem.definition}
                        </p>
                    </div>

                    {/* Deep Info based on Category */}
                    {selectedItem.category === "Фауна" && selectedItem.raw && (
                        <>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-2">
                                    Опасность
                                </span>
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-3 h-3 rounded-full ${i < (selectedItem.raw.dangerLevel || 1) ? "bg-[#F85149]" : "bg-[#30363D]"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                    Броня
                                </span>
                                    <p className="text-[#C9D1D9] font-mono text-xs">{selectedItem.raw.armorType || "Стандартная"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                    Происхождение
                                </span>
                                    <p className="text-[#C9D1D9] text-sm">{selectedItem.raw.heritage || "Неизвестно"}</p>
                                </div>
                                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                    Тип
                                </span>
                                    <p className="text-[#C9D1D9] text-sm">{selectedItem.raw.monsterType || "Неизвестно"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                    Сильные стороны
                                </span>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedItem.raw.strengths?.map((s: any) => (
                                            <Badge key={s.id} variant="success" className="text-[10px]">
                                                {s.name}
                                            </Badge>
                                        )) || <span className="text-[#8B949E] text-xs">Нет</span>}
                                    </div>
                                </div>
                                <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                                <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                    Слабые стороны
                                </span>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedItem.raw.weaknesses?.map((w: any) => (
                                            <Badge key={w.id} variant="danger" className="text-[10px]">
                                                {w.name}
                                            </Badge>
                                        )) || <span className="text-[#8B949E] text-xs">Нет</span>}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {selectedItem.category === "Оборудование" && selectedItem.raw && (
                        <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                        <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                            Вес модуля
                        </span>
                            <p className="text-[#C9D1D9] font-mono">{selectedItem.raw.weight || "—"} кг</p>
                        </div>
                    )}

                    {selectedItem.category === "Оружие" && selectedItem.raw && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                            <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                Вес инструмента
                            </span>
                                <p className="text-[#C9D1D9] font-mono">{selectedItem.raw.weight || "—"} кг</p>
                            </div>
                            <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                            <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                                Тип урона
                            </span>
                                <p className="text-[#FF6B35] font-mono text-sm uppercase">
                                    {selectedItem.raw.impactType?.name || "Кинетический"}
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedItem.category === "Ресурсы" && selectedItem.raw && (
                        <div className="p-3 bg-[#161B22] border border-[#30363D] rounded-lg">
                        <span className="block text-[10px] font-mono text-[#8B949E] uppercase tracking-widest mb-1">
                            Вес за единицу
                        </span>
                            <p className="text-[#C9D1D9] font-mono">{selectedItem.raw.weightPerUnit || "—"} кг</p>
                        </div>
                    )}
                </div>

                {canEdit && ["Фауна", "Ресурсы", "Оружие", "Оборудование"].includes(selectedItem.category) && (
                    <div className="mt-8 pt-6 border-t border-[#30363D] flex gap-2">
                        <Button
                            onClick={() => setIsEditMode(true)}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border-[#30363D]"
                        >
                            <Edit3 size={16} /> Редактировать
                        </Button>
                        {canDelete && (
                            <Button
                                variant="danger"
                                className="flex-1"
                                onClick={() => setDeleteConfirm(true)}
                            >
                                <Trash2 size={16} className="mr-2" />
                                Удалить
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        switch (selectedItem.category) {
            case "Фауна":
                if (selectedItem.originalId) handleDeleteMonster(selectedItem.originalId);
                break;
            case "Ресурсы":
                if (selectedItem.originalId) handleDeleteResource(selectedItem.originalId);
                break;
            case "Оружие":
                if (selectedItem.originalId) handleDeleteWeapon(selectedItem.originalId);
                break;
            case "Оборудование":
                if (selectedItem.originalId) handleDeleteEquipment(selectedItem.originalId);
                break;
        }
    };

    return (
        <Layout currentPage="/glossary">
            <div className="max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2 font-mono">Глоссарий DRG</h1>
                        <p className="text-[#8B949E]">
                            Центральный справочник объектов и субъектов Hoxxes IV
                        </p>
                    </div>

                    {canCreate && ["Фауна", "Ресурсы", "Оружие", "Оборудование"].includes(activeTab) && (
                        <Button
                            onClick={() => {
                                setIsCreateMode(true);
                                resetForms();
                                setSelectedItem(null);
                            }}
                            className="bg-[#FF6B35] text-white whitespace-nowrap"
                        >
                            <Plus size={16} className="mr-2" />
                            Создать
                        </Button>
                    )}

                    <div className="flex items-center gap-2">
                         <div className="p-1 bg-[#161B22] border border-[#30363D] rounded flex overflow-x-auto no-scrollbar max-w-full">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`px-3 py-1.5 rounded text-sm transition-all whitespace-nowrap ${
                                        activeTab === cat
                                            ? "bg-[#FF6B35] text-white font-bold"
                                            : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#21262D]"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B949E]"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder={`Поиск в категории ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#161B22] border border-[#30363D] rounded px-10 py-3 text-[#C9D1D9] focus:outline-none focus:border-[#FF6B35] transition-colors font-mono"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-[#8B949E]">
                        <Loader2 className="animate-spin mb-4 text-[#FF6B35]" size={48} />
                        <p className="font-mono text-center">Синхронизация с орбитальной базой...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTerms.map((term: GlossaryTerm) => (
                            <Card
                                key={term.id}
                                onClick={() => handleOpenDetails(term)}
                                className="group relative overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[#8B949E] text-[10px] font-mono uppercase tracking-wider">
                                            {term.category}
                                        </span>
                                        <Info size={14} className="text-[#30363D] group-hover:text-[#FF6B35] transition-colors" />
                                    </div>
                                    <CardTitle className="group-hover:text-[#FF6B35] transition-colors">
                                        {term.term}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="line-clamp-3 text-sm leading-relaxed text-[#C9D1D9]">
                                        {term.definition}
                                    </p>
                                </CardContent>
                                <div className="mt-4 pt-4 border-t border-[#30363D] flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-mono text-[#FF6B35] flex items-center gap-1">
                                        ПОДРОБНЕЕ <ExternalLink size={10} />
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredTerms.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-[#30363D] rounded-xl font-mono">
                        <BookOpen
                            className="text-[#30363D] mx-auto mb-4"
                            size={64}
                        />
                        <p className="text-[#C9D1D9]">Архивы пусты</p>
                        <p className="text-[#8B949E] text-sm mt-2">
                            Нет совпадений для "{searchTerm}" в категории {activeTab}
                        </p>
                    </div>
                )}
            </div>

            {/* Detailed View Modal */}
            {selectedItem && (
                <Modal
                    isOpen={!!selectedItem && !isCreateMode}
                    onClose={() => {
                        setSelectedItem(null);
                        setIsEditMode(false);
                        setDeleteConfirm(false);
                    }}
                    title={isEditMode ? "Редактирование" : "Справочная информация"}
                    size="lg"
                >
                    <div className="space-y-6">
                        {isEditMode ? renderEditForm() : renderViewMode()}

                        {/* Delete Confirmation */}
                        {deleteConfirm && (
                            <div className="mt-4 p-4 bg-[#F85149]/10 border border-[#F85149] rounded-lg">
                                <p className="text-[#F85149] text-sm mb-3">
                                    Вы уверены, что хотите удалить эту запись? Это действие необратимо.
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete()}
                                    >
                                        Удалить
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteConfirm(false)}
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Create Modal */}
            {isCreateMode && (
                <Modal
                    isOpen={isCreateMode}
                    onClose={() => setIsCreateMode(false)}
                    title={`Создание новой записи: ${activeTab}`}
                    size="lg"
                >
                    <div className="space-y-6">
                        {renderCreateForm()}
                    </div>
                </Modal>
            )}
        </Layout>
    );
}
