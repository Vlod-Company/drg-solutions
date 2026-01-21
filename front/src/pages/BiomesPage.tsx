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
import { Globe, AlertTriangle, Flower2, Bug, Package } from "lucide-react";
import { EcosystemService } from "../api/services";
import { BiomeDto } from "../types/api";

export function BiomesPage() {
    const [biomes, setBiomes] = useState<BiomeDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBiome, setSelectedBiome] = useState<BiomeDto | null>(null);

    const fetchBiomes = async () => {
        try {
            const data = await EcosystemService.getAllBiomes();
            setBiomes(data);
        } catch (error) {
            console.error("Failed to fetch biomes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBiomes();
    }, []);

    const getDangerStars = (level: number) => {
        return "⚠️".repeat(level);
    };

    // Helper to safely access properties that might differ in DTO
    // DTO likely has less info than mock
    const getType = (b: BiomeDto) => (b as any).type || "Неизвестный тип";
    const getPlanet = (b: BiomeDto) => (b as any).planet || "Hoxxes IV";
    const getDangerLevel = (b: BiomeDto) => (b as any).dangerLevel || 1;
    const getResources = (b: BiomeDto) => (b as any).resources || [];
    const getFlora = (b: BiomeDto) => (b as any).flora || ["Неизвестная флора"];
    const getFauna = (b: BiomeDto) => (b as any).fauna || ["Неизвестная фауна"];
    const getDiscovered = (b: BiomeDto) => (b as any).discovered || new Date().toISOString();

    return (
        <Layout currentPage="/biomes">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[#C9D1D9] mb-2">Каталог биомов</h1>
                    <p className="text-[#8B949E]">
                        Исследованные биомы и экосистемы планет
                    </p>
                </div>

                {/* Biomes Grid */}
                {loading ? (
                    <div className="text-[#C9D1D9]">Загрузка биомов...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {biomes.map((biome) => (
                            <Card
                                key={biome.id}
                                onClick={() => setSelectedBiome(biome)}
                                className="cursor-pointer hover:border-[#4FC3F7] transition-colors"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Globe
                                                className="text-[#4FC3F7]"
                                                size={18}
                                            />
                                            <span className="text-[#C9D1D9] font-mono text-sm">
                                                ID: {biome.id}
                                            </span>
                                        </div>
                                        <Badge variant="info">{getPlanet(biome)}</Badge>
                                    </div>
                                    <CardTitle className="truncate">{biome.name}</CardTitle>
                                    <div className="text-[#8B949E] text-sm">
                                        {getType(biome)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <AlertTriangle
                                                size={14}
                                                className="text-[#8B949E]"
                                            />
                                            <span className="text-[#C9D1D9]">
                                                Опасность:{" "}
                                                {getDangerStars(getDangerLevel(biome))}
                                            </span>
                                        </div>

                                        {getResources(biome).length > 0 && (
                                            <div className="mt-3">
                                                <div className="text-[#8B949E] text-xs mb-1">
                                                    Ресурсы:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {getResources(biome)
                                                        .slice(0, 2)
                                                        .map((resource: string) => (
                                                            <Badge
                                                                key={resource}
                                                                variant="default"
                                                            >
                                                                {resource}
                                                            </Badge>
                                                        ))}
                                                    {getResources(biome).length > 2 && (
                                                        <Badge variant="default">
                                                            +
                                                            {getResources(biome).length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-4 mt-3 text-xs text-[#8B949E]">
                                            <div className="flex items-center gap-1">
                                                <Flower2 size={12} />
                                                <span>
                                                    {getFlora(biome).length} флора
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bug size={12} />
                                                <span>
                                                    {getFauna(biome).length} фауна
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                
                {!loading && biomes.length === 0 && (
                     <div className="text-center py-12 text-[#8B949E]">
                         Биомы не найдены
                     </div>
                )}

                {/* Biome Details Modal */}
                {selectedBiome && (
                    <Modal
                        isOpen={!!selectedBiome}
                        onClose={() => setSelectedBiome(null)}
                        title={selectedBiome.name}
                        size="lg"
                    >
                        <div className="space-y-6">
                            {/* Biome Header */}
                            <div className="flex items-center gap-3">
                                <Globe className="text-[#4FC3F7]" size={32} />
                                <div className="flex-1">
                                    <h3 className="text-[#C9D1D9] text-xl">
                                        {selectedBiome.name}
                                    </h3>
                                    <p className="text-[#8B949E]">
                                        {getType(selectedBiome)}
                                    </p>
                                </div>
                                <Badge variant="info">
                                    {getPlanet(selectedBiome)}
                                </Badge>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        ID биома
                                    </div>
                                    <div className="text-[#C9D1D9] font-mono">
                                        {selectedBiome.id}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Уровень опасности
                                    </div>
                                    <div className="text-2xl">
                                        {getDangerStars(
                                            getDangerLevel(selectedBiome),
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded col-span-2">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Дата открытия
                                    </div>
                                    <div className="text-[#C9D1D9]">
                                        {new Date(
                                            getDiscovered(selectedBiome),
                                        ).toLocaleDateString("ru-RU")}
                                    </div>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package
                                        className="text-[#FF6B35]"
                                        size={18}
                                    />
                                    <div className="text-[#C9D1D9]">
                                        Ресурсы
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {getResources(selectedBiome).length > 0 ? getResources(selectedBiome).map((resource: string) => (
                                        <Badge key={resource} variant="warning">
                                            {resource}
                                        </Badge>
                                    )) : <span className="text-[#8B949E] text-sm">Нет данных</span>}
                                </div>
                            </div>

                            {/* Flora */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <Flower2
                                        className="text-[#56C271]"
                                        size={18}
                                    />
                                    <div className="text-[#C9D1D9]">
                                        Флора ({getFlora(selectedBiome).length})
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {getFlora(selectedBiome).map((plant: string, index: number) => (
                                        <div
                                            key={index}
                                            className="p-2 bg-[#0D1117] rounded text-[#C9D1D9] text-sm"
                                        >
                                            • {plant}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fauna */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="flex items-center gap-2 mb-3">
                                    <Bug className="text-[#D32F2F]" size={18} />
                                    <div className="text-[#C9D1D9]">
                                        Фауна ({getFauna(selectedBiome).length})
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {getFauna(selectedBiome).map(
                                        (creature: string, index: number) => (
                                            <div
                                                key={index}
                                                className="p-2 bg-[#0D1117] rounded text-[#C9D1D9] text-sm flex items-center gap-2"
                                            >
                                                <AlertTriangle
                                                    size={14}
                                                    className="text-[#D32F2F]"
                                                />
                                                {creature}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Danger Warning */}
                            {getDangerLevel(selectedBiome) >= 4 && (
                                <div className="p-4 bg-[#D32F2F] bg-opacity-10 border border-[#D32F2F] rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle
                                            className="text-[#D32F2F]"
                                            size={20}
                                        />
                                        <div className="text-[#D32F2F]">
                                            ВЫСОКИЙ УРОВЕНЬ ОПАСНОСТИ! Требуется
                                            опытная команда и специальное
                                            снаряжение.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
