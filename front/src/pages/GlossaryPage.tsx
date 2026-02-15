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
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { BookOpen, Search, Loader2, Edit3, ExternalLink, Info, Crosshair } from "lucide-react";
import { EcosystemService, GlossaryService, AuthService } from "../api/services";
import { toast } from "sonner";
import { WeaponInfoDTO } from "../types/api";

interface GlossaryTerm {
    id: string;
    originalId?: number;
    term: string;
    category: string;
    definition: string;
    raw?: any; 
}

export function GlossaryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Планеты");
    const [selectedItem, setSelectedItem] = useState<GlossaryTerm | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ term: "", definition: "" });
    const [userRoles, setUserRoles] = useState<string[]>([]);

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
                GlossaryService.getResources(),
                EcosystemService.getAllMonsters(),
                GlossaryService.getBiomes(),
                GlossaryService.getEquipment(),
                GlossaryService.getWeapons(),
            ]);

            const allTerms: GlossaryTerm[] = [
                ...planets.map((p: any) => ({
                    id: `planet-${p.id}`,
                    originalId: p.id,
                    term: p.name || `Планета ${p.id}`,
                    category: "Планеты",
                    definition: p.description || "Исследованная планета в данном секторе. Дополнительные данные засекречены или отсутствуют.",
                    raw: p,
                })),
                ...resources.map((r: any, i: number) => ({
                    id: `resource-${i}`,
                    term: r.name || "Ресурс",
                    category: "Ресурсы",
                    definition: r.description || "Минеральное сырье Hoxxes IV. Используется в промышленных и военных целях.",
                    raw: r,
                })),
                ...monsters.map((m: any) => ({
                    id: `monster-${m.id}`,
                    term: m.name || "Неопознанный объект",
                    category: "Фауна",
                    definition: m.description || `Биологическая форма жизни. Рекомендуется соблюдать безопасную дистанцию.`,
                    raw: m,
                })),
                ...biomes.map((b: any) => ({
                    id: `biome-${b.id}`,
                    originalId: b.id,
                    term: b.name || "Биом",
                    category: "Биомы",
                    definition: b.description || "Специфическая природная зона с уникальными условиями.",
                    raw: b,
                })),
                ...equipment.map((e: any, i: number) => ({
                    id: `equip-${i}`,
                    term: e.name || "Оборудование",
                    category: "Оборудование",
                    definition: e.description || "Инженерное решение для операций в экстремальных условиях.",
                    raw: e,
                })),
                ...weapons.map((w: WeaponInfoDTO, i: number) => ({
                    id: `weapon-${i}`,
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

    useEffect(() => {
        fetchTerms();
        fetchUserRoles();
    }, []);

    const canEdit = userRoles.some(r => ["ADMIN", "MANAGER", "DIRECTOR"].includes(r.toUpperCase()));

    const handleOpenDetails = (item: GlossaryTerm) => {
        setSelectedItem(item);
        setEditForm({ term: item.term, definition: item.definition });
        setIsEditMode(false);
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
                    isOpen={!!selectedItem}
                    onClose={() => {
                        setSelectedItem(null);
                        setIsEditMode(false);
                    }}
                    title={isEditMode ? "Редактирование терминологии" : "Справочная информация"}
                >
                    <div className="space-y-6">
                        {isEditMode ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono text-[#8B949E] mb-1 uppercase tracking-wider">
                                        Наименование
                                    </label>
                                    <Input
                                        value={editForm.term}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, term: e.target.value})}
                                        className="font-mono bg-[#0D1117] border-[#30363D]"
                                    />
                                </div>
                                {(selectedItem.category === "Биомы" || selectedItem.category === "Ресурсы") && (
                                    <div>
                                        <label className="block text-xs font-mono text-[#8B949E] mb-1 uppercase tracking-wider">
                                            Описание / Определение
                                        </label>
                                        <Textarea
                                            value={editForm.definition}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({...editForm, definition: e.target.value})}
                                            rows={6}
                                            className="font-mono text-sm bg-[#0D1117] border-[#30363D]"
                                        />
                                    </div>
                                )}
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditMode(false)}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="bg-[#FF6B35] text-white font-bold"
                                    >
                                        Сохранить изменения
                                    </Button>
                                </div>
                            </div>
                        ) : (
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
                                </div>

                                {(selectedItem.category === "Планеты" || selectedItem.category === "Биомы") && canEdit && (
                                    <div className="mt-8 pt-6 border-t border-[#30363D]">
                                        <Button
                                            onClick={() => setIsEditMode(true)}
                                            className="w-full flex items-center justify-center gap-2 bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] border-[#30363D]"
                                        >
                                            <Edit3 size={16} /> Редактировать данные
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </Layout>
    );
}
