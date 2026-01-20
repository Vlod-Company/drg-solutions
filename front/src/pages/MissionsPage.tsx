import React, { useState } from "react";
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
} from "lucide-react";
import { mockMissions } from "../data/mockData";
import { Mission } from "../types";

export function MissionsPage() {
    const [missions] = useState<Mission[]>(mockMissions);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(
        null,
    );
    const [filter, setFilter] = useState<
        "ALL" | "PLANNED" | "ACTIVE" | "COMPLETED"
    >("ALL");

    const filteredMissions = missions.filter(
        (m) => filter === "ALL" || m.status === filter,
    );

    const getDangerStars = (level: number) => {
        return "⚠️".repeat(level);
    };

    const getMissionIcon = (type: Mission["type"]) => {
        switch (type) {
            case "MINING":
                return "⛏️";
            case "RESEARCH":
                return "🔬";
            case "RESCUE":
                return "🚑";
            case "DEFENSE":
                return "🛡️";
            default:
                return "🎯";
        }
    };

    return (
        <Layout currentPage="/missions">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-[#C9D1D9] mb-2">Управление миссиями</h1>
                    <p className="text-[#8B949E]">
                        Планирование и мониторинг операций на Hoxxes IV
                    </p>
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
                        ),
                    )}
                </div>

                {/* Missions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMissions.map((mission) => (
                        <Card
                            key={mission.id}
                            onClick={() => setSelectedMission(mission)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">
                                            {getMissionIcon(mission.type)}
                                        </span>
                                        <span className="text-[#C9D1D9] font-mono text-sm">
                                            {mission.id}
                                        </span>
                                    </div>
                                    <Badge
                                        variant={
                                            mission.status === "ACTIVE"
                                                ? "warning"
                                                : mission.status === "COMPLETED"
                                                  ? "success"
                                                  : "info"
                                        }
                                    >
                                        {mission.status}
                                    </Badge>
                                </div>
                                <CardTitle>{mission.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin
                                            size={14}
                                            className="text-[#8B949E]"
                                        />
                                        <span className="text-[#C9D1D9]">
                                            {mission.biome}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users
                                            size={14}
                                            className="text-[#8B949E]"
                                        />
                                        <span className="text-[#C9D1D9]">
                                            Команда: {mission.teamSize}/
                                            {mission.maxTeamSize}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <AlertTriangle
                                            size={14}
                                            className="text-[#8B949E]"
                                        />
                                        <span className="text-[#C9D1D9]">
                                            Опасность:{" "}
                                            {getDangerStars(
                                                mission.dangerLevel,
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-2 bg-[#0D1117] rounded border border-[#30363D]">
                                    <div className="text-[#8B949E] text-xs mb-1">
                                        Цель:
                                    </div>
                                    <div className="text-[#C9D1D9] text-sm">
                                        {mission.objective}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

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
                                        {getMissionIcon(selectedMission.type)}
                                    </span>
                                    <div>
                                        <h3 className="text-[#C9D1D9] text-xl">
                                            {selectedMission.name}
                                        </h3>
                                        <p className="text-[#8B949E]">
                                            {selectedMission.type}
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
                                        {selectedMission.biome}
                                    </div>
                                    <div className="text-[#8B949E] text-sm mt-1">
                                        {selectedMission.planet}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Уровень опасности
                                    </div>
                                    <div className="text-2xl">
                                        {getDangerStars(
                                            selectedMission.dangerLevel,
                                        )}
                                    </div>
                                    <div className="text-[#8B949E] text-sm mt-1">
                                        Уровень {selectedMission.dangerLevel}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Команда
                                    </div>
                                    <div className="text-[#C9D1D9] text-xl">
                                        {selectedMission.teamSize}/
                                        {selectedMission.maxTeamSize}
                                    </div>
                                    <div className="text-[#8B949E] text-sm mt-1">
                                        Шахтеров
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] text-sm mb-2">
                                        Статус
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
                                    >
                                        {selectedMission.status}
                                    </Badge>
                                </div>
                            </div>

                            {/* Objective */}
                            <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                <div className="text-[#8B949E] mb-2">
                                    Цель миссии
                                </div>
                                <div className="text-[#C9D1D9]">
                                    {selectedMission.objective}
                                </div>
                            </div>

                            {/* Timeline */}
                            {(selectedMission.startDate ||
                                selectedMission.endDate) && (
                                <div className="p-4 bg-[#161B22] border border-[#30363D] rounded">
                                    <div className="text-[#8B949E] mb-3">
                                        Временная шкала
                                    </div>
                                    <div className="space-y-2">
                                        {selectedMission.startDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-[#56C271]"
                                                />
                                                <span className="text-[#C9D1D9] text-sm">
                                                    Начало:{" "}
                                                    {new Date(
                                                        selectedMission.startDate,
                                                    ).toLocaleString("ru-RU")}
                                                </span>
                                            </div>
                                        )}
                                        {selectedMission.endDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar
                                                    size={16}
                                                    className="text-[#D32F2F]"
                                                />
                                                <span className="text-[#C9D1D9] text-sm">
                                                    Завершение:{" "}
                                                    {new Date(
                                                        selectedMission.endDate,
                                                    ).toLocaleString("ru-RU")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                                {selectedMission.status === "PLANNED" && (
                                    <Button variant="success">
                                        <Rocket size={18} className="mr-2" />
                                        Запустить миссию
                                    </Button>
                                )}
                                {selectedMission.status === "ACTIVE" && (
                                    <>
                                        <Button variant="warning">
                                            <AlertTriangle
                                                size={18}
                                                className="mr-2"
                                            />
                                            Запросить помощь
                                        </Button>
                                        <Button variant="info">
                                            <Target
                                                size={18}
                                                className="mr-2"
                                            />
                                            Мониторинг
                                        </Button>
                                    </>
                                )}
                                <Button variant="ghost">Подробности</Button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
}
