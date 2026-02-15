import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Input";
import { Globe, Bug, Package, Info, Plus } from "lucide-react";
import { EcosystemService, StoreService } from "../api/services";
import { BiomeDto, MonsterDto, PlanetDto, ItemResponseDTO, DeliveryPointResponseDTO } from "../types/api";
import { toast } from "sonner";

export function BiomesPage() {
    const [biomes, setBiomes] = useState<BiomeDto[]>([]);
    const [monsters, setMonsters] = useState<MonsterDto[]>([]);
    const [planets, setPlanets] = useState<Record<number, string>>({});
    const [resourcesMap, setResourcesMap] = useState<Record<number, ItemResponseDTO[]>>({});
    const [loading, setLoading] = useState(true);
    const [selectedBiome, setSelectedBiome] = useState<BiomeDto | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [planetList, setPlanetList] = useState<PlanetDto[]>([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [biomesData, monstersData, planetsData] = await Promise.all([
                EcosystemService.getAllBiomes(),
                EcosystemService.getAllMonsters(),
                EcosystemService.getAllPlanets(),
            ]);
            
            setBiomes(biomesData);
            setMonsters(monstersData);
            setPlanetList(planetsData);
            
            const pMap: Record<number, string> = {};
            planetsData.forEach((p: PlanetDto) => {
                if (p.id) pMap[p.id] = p.name || "Unknown";
            });
            setPlanets(pMap);

            // Fetch resources from store-service
            for (const biome of biomesData) {
                if (biome.deliveryPointId) {
                    try {
                        const responses: DeliveryPointResponseDTO[] = await StoreService.findItemsInDeliveryPoint(biome.deliveryPointId);
                        // Flatten items from all stores/delivery points returned
                        const allItems = responses.flatMap(r => r.data || []);
                        
                        if (allItems.length > 0) {
                            setResourcesMap(prev => ({
                                ...prev,
                                [biome.id!]: allItems
                            }));
                        }
                    } catch (err) {
                        console.error(`Failed to fetch resources for biome ${biome.id}`, err);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch biome data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getPlanetName = (id?: number) => id ? planets[id] || "Hoxxes IV" : "Hoxxes IV";
    
    const getBiomeFauna = (biomeId?: number) => 
        monsters.filter((m: MonsterDto) => m.biomeId === biomeId);

    const handleCreateBiome = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await EcosystemService.createBiome({
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                planetId: Number(formData.get("planetId")),
            });
            toast.success("Биом успешно создан");
            setShowCreateModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Ошибка при создании биома");
        }
    };

    const getBiomeResources = (biomeId?: number) => 
        biomeId ? resourcesMap[biomeId] || [] : [];

    return (
        <Layout currentPage="/biomes">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] mb-2 font-mono tracking-tight">Реестр Биомов</h1>
                        <p className="text-[#8B949E] text-sm italic">Каталог экосистем Hoxxes IV и других разведанных территорий</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} className="mr-2" />
                        Создать биом
                    </Button>
                </div>

                {/* Biomes Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-[#8B949E]">
                        <div className="animate-spin mb-4 text-[#FF6B35]">
                            <Globe size={48} />
                        </div>
                        <p className="font-mono">Сканирование поверхности...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {biomes.map((biome: BiomeDto) => (
                            <Card
                                key={biome.id}
                                onClick={() => setSelectedBiome(biome)}
                                className="group relative border-[#30363D] bg-[#161B22] hover:border-[#FF6B35]/50 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Globe className="text-[#FF6B35]" size={16} />
                                            <span className="text-[#8B949E] font-mono text-[10px] uppercase tracking-wider">
                                                ID: {biome.id}
                                            </span>
                                        </div>
                                        <Badge variant="info">{getPlanetName(biome.planetId)}</Badge>
                                    </div>
                                    <CardTitle className="text-[#C9D1D9] group-hover:text-[#FF6B35] transition-colors">
                                        {biome.name}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-[#8B949E] line-clamp-2 italic mb-4">
                                            {biome.description || "Описание заблокировано или отсутствует в базе данных."}
                                        </p>

                                        <div className="flex items-center gap-1.5 text-[11px] text-[#C9D1D9]">
                                            <Bug size={12} className="text-[#D32F2F]" />
                                            <span>{getBiomeFauna(biome.id).length} вида фауны</span>
                                        </div>

                                        {getBiomeResources(biome.id).length > 0 && (
                                            <div className="pt-3 border-t border-[#30363D]">
                                                <div className="flex flex-wrap gap-1">
                                                    {getBiomeResources(biome.id).slice(0, 3).map((res: ItemResponseDTO, i: number) => (
                                                        <Badge key={i} variant="default" className="text-[9px] py-0 px-1.5">
                                                            {res.itemName}
                                                        </Badge>
                                                    ))}
                                                    {getBiomeResources(biome.id).length > 3 && (
                                                        <span className="text-[9px] text-[#8B949E] ml-1">
                                                            +{getBiomeResources(biome.id).length - 3}
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
                
                {!loading && biomes.length === 0 && (
                     <div className="text-center py-24 border border-dashed border-[#30363D] rounded-xl">
                         <Info className="text-[#30363D] mx-auto mb-4" size={48} />
                         <p className="text-[#8B949E] font-mono">Данные о биомах не синхронизированы</p>
                     </div>
                )}

                {/* Biome Details Modal */}
                {selectedBiome && (
                    <Modal
                        isOpen={!!selectedBiome}
                        onClose={() => setSelectedBiome(null)}
                        title={`Биом: ${selectedBiome.name}`}
                        size="lg"
                    >
                        <div className="space-y-6 pt-2">
                            {/* Description Section */}
                            <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-lg">
                                <h4 className="text-[10px] font-mono text-[#FF6B35] uppercase mb-2 tracking-widest">Аналитическая сводка</h4>
                                <p className="text-[#C9D1D9] text-sm leading-relaxed whitespace-pre-wrap">
                                    {selectedBiome.description || "Детальное описание биома в данный момент недоступно."}
                                </p>
                            </div>

                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded text-center">
                                <div className="text-[#8B949E] text-[10px] uppercase font-mono mb-1">Планета</div>
                                <div className="text-[#C9D1D9] font-medium">{getPlanetName(selectedBiome.planetId)}</div>
                            </div>

                            {/* Resources */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="text-[#FF6B35]" size={18} />
                                    <div className="text-[#C9D1D9] text-sm font-bold uppercase tracking-wider font-mono">
                                        Доступные ресурсы
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getBiomeResources(selectedBiome.id).length > 0 ? (
                                        getBiomeResources(selectedBiome.id).map((res, i) => (
                                            <Badge key={i} variant="warning" className="font-mono">
                                                {res.itemName} {res.itemQuantity ? `x${res.itemQuantity}` : ""}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-[#8B949E] text-xs italic">Данные о ресурсах отсутствуют или скрыты</span>
                                    )}
                                </div>
                            </div>

                            {/* Fauna */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <Bug className="text-[#D32F2F]" size={18} />
                                    <div className="text-[#C9D1D9] text-sm font-bold uppercase tracking-wider font-mono">
                                        Фауна ({getBiomeFauna(selectedBiome.id).length})
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {getBiomeFauna(selectedBiome.id).length > 0 ? (
                                        getBiomeFauna(selectedBiome.id).map((m: MonsterDto) => (
                                            <div key={m.id} className="p-2.5 bg-[#0D1117] rounded-lg border border-[#D32F2F]/20 hover:border-[#D32F2F]/50 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[#C9D1D9] text-xs font-bold">{m.name}</span>
                                                    <span className="text-[9px] font-mono text-[#D32F2F]">LVL {m.dangerLevel}</span>
                                                </div>
                                                <p className="text-[10px] text-[#8B949E] line-clamp-2">{m.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[#8B949E] text-xs italic p-2 text-center">Территория свободна от угроз</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}

                {/* Create Biome Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Создание нового биома"
                >
                    <form onSubmit={handleCreateBiome} className="space-y-4">
                        <Input
                            name="name"
                            label="Название биома"
                            placeholder="Напр. Crystal Caves"
                            required
                        />
                        
                        <Select
                            name="planetId"
                            label="Планета"
                            options={planetList.map(p => ({ 
                                value: String(p.id), 
                                label: p.name || `ID: ${p.id}` 
                            }))}
                            required
                        />

                        <Textarea
                            name="description"
                            label="Описание"
                            placeholder="Опишите особенности экосистемы..."
                            rows={4}
                            required
                        />

                        <div className="flex gap-2 justify-end mt-6">
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
            </div>
        </Layout>
    );
}
