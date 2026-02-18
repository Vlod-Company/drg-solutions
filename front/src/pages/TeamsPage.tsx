import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import {
    Shield,
    Plus,
    Users,
    Activity,
    Box,
    CheckCircle2,
    Skull,
    Truck,
    Navigation,
    PackageCheck,
    AlertOctagon,
    Loader2,
    Settings2,
} from "lucide-react";
import { TeamService, EmployeeService } from "../api/services";
import { TeamDto, EmployeeResponseDto } from "../types/api";
import { toast } from "sonner";

export function TeamsPage() {
    const { user } = useAuth();
    const [teams, setTeams] = useState<TeamDto[]>([]);
    const [activeEmployees, setActiveEmployees] = useState<EmployeeResponseDto[]>([]);
    const [teamMembers, setTeamMembers] = useState<EmployeeResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMembers, setLoadingMembers] = useState(false);
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false);
    
    // Form states
    const [selectedTeam, setSelectedTeam] = useState<TeamDto | null>(null);
    const [cargoId, setCargoId] = useState<number | undefined>(undefined);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
    
    // Create form states
    const [newTeamName, setNewTeamName] = useState("");
    const [newLocatedAt, setNewLocatedAt] = useState<number | undefined>(undefined);
    
    const [activeTab, setActiveTab] = useState("ALL");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [teamsData, employeesData] = await Promise.all([
                TeamService.getAll(),
                EmployeeService.getAll()
            ]);
            setTeams(Array.isArray(teamsData) ? teamsData : []);
            
            // Filter only ACTIVE employees for team creation
            const active = (Array.isArray(employeesData) ? employeesData : [])
                .filter((emp: EmployeeResponseDto) => emp.status === "ACTIVE");
            setActiveEmployees(active);
        } catch (error) {
            console.error("Error fetching teams/employees:", error);
            toast.error("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchTeamMembers = async (teamId: number) => {
        setLoadingMembers(true);
        try {
            const response = await TeamService.getTeamMembers(teamId);
            if (response.employeeId && response.employeeId.length > 0) {
                const members = await EmployeeService.getByIds(response.employeeId);
                setTeamMembers(members);
            } else {
                setTeamMembers([]);
            }
        } catch (error) {
            console.error("Error fetching team members:", error);
            setTeamMembers([]);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTeamName.trim()) {
            toast.error("Введите название команды");
            return;
        }
        if (!newLocatedAt) {
            toast.error("Укажите ID локации");
            return;
        }
        if (selectedEmployeeIds.length === 0) {
            toast.error("Выберите хотя бы одного сотрудника");
            return;
        }

        setIsSubmitting(true);
        try {
            await TeamService.create({
                teamName: newTeamName,
                employeeIds: selectedEmployeeIds,
                locatedAt: newLocatedAt
            });
            toast.success("Команда успешно сформирована");
            resetForm();
            setShowCreateModal(false);
            fetchData();
        } catch (error) {
            console.error("Error creating team:", error);
            toast.error("Ошибка при создании команды");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateParams = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedTeam?.id) return;

        setIsSubmitting(true);
        try {
            await TeamService.updateStatus(selectedTeam.id, selectedTeam.status!, cargoId);
            toast.success("Параметры сохранены");
            fetchData();
        } catch (error) {
            console.error("Error updating team params:", error);
            toast.error("Ошибка при сохранении");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setCargoId(undefined);
        setSelectedEmployeeIds([]);
        setSelectedTeam(null);
        setTeamMembers([]);
        setNewTeamName("");
        setNewLocatedAt(undefined);
    };

    const handleOpenManage = (team: TeamDto) => {
        setSelectedTeam(team);
        setCargoId(team.cargoId);
        setShowManageModal(true);
        if (team.id) {
            fetchTeamMembers(team.id);
        }
    };

    const handleUpdateStatus = (id: number, status: string) => {
        // Only update local state for feedback in modal
        if (selectedTeam && selectedTeam.id === id) {
            setSelectedTeam({...selectedTeam, status});
        }
    };

    const getStatusVariant = (status: string | undefined): "info" | "warning" | "success" | "danger" | "default" => {
        switch (status?.toUpperCase()) {
            case "CREATED": return "info";
            case "ASSIGNED": return "info";
            case "ON_MISSION": return "warning";
            case "DELIVERED": return "success";
            case "ON_THE_WAY": return "warning";
            case "KILLED": return "danger";
            case "DEFORMED": return "danger";
            default: return "default";
        }
    };

    const getStatusLabel = (status: string | undefined) => {
        switch (status?.toUpperCase()) {
            case "CREATED": return "Создана";
            case "ASSIGNED": return "Назначена";
            case "ON_MISSION": return "На миссии";
            case "DELIVERED": return "Доставлена";
            case "ON_THE_WAY": return "В пути";
            case "KILLED": return "Погибла";
            case "DEFORMED": return "Деформирована";
            default: return status || "Неизвестно";
        }
    };

    const getStatusIcon = (status: string | undefined) => {
        switch (status?.toUpperCase()) {
            case "CREATED": return <Plus size={14} />;
            case "ASSIGNED": return <CheckCircle2 size={14} />;
            case "ON_MISSION": return <Navigation size={14} className="animate-pulse" />;
            case "DELIVERED": return <PackageCheck size={14} />;
            case "ON_THE_WAY": return <Truck size={14} />;
            case "KILLED": return <Skull size={14} />;
            case "DEFORMED": return <AlertOctagon size={14} />;
            default: return <Activity size={14} />;
        }
    };

    const STATUS_TABS = [
        { id: "ALL", label: "Все", icon: <Shield size={14} /> },
        { id: "CREATED", label: "Созданы", icon: <Plus size={14} /> },
        { id: "ON_MISSION", label: "На миссии", icon: <Navigation size={14} /> },
        { id: "DELIVERED", label: "Завершены", icon: <PackageCheck size={14} /> },
        { id: "KILLED", label: "Потери", icon: <Skull size={14} /> },
    ];

    const filteredTeams = activeTab === "ALL" 
        ? teams 
        : teams.filter(t => {
            if (activeTab === "CREATED") return t.status === "CREATED" || t.status === "ASSIGNED";
            if (activeTab === "ON_MISSION") return t.status === "ON_MISSION" || t.status === "ON_THE_WAY";
            if (activeTab === "KILLED") return t.status === "KILLED" || t.status === "DEFORMED";
            return t.status === activeTab;
        });

    const toggleEmployee = (id: number) => {
        setSelectedEmployeeIds((prev: number[]) => 
            prev.includes(id) ? prev.filter((eid: number) => eid !== id) : [...prev, id]
        );
    };

    const canManageTeams = user?.roles.some((r: string) => 
        ["ROLE_ADMIN", "ROLE_LAUNCH_CONTROL_EMPLOYEE", "ROLE_MISSION_CONTROL_EMPLOYEE"].includes(r)
    );

    return (
        <Layout currentPage="/teams">
            <div className="max-w-7xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-[#C9D1D9] flex items-center gap-2">
                            <Shield className="text-[#FF6B35]" />
                            Команды
                        </h1>
                        <p className="text-[#8B949E] text-sm"> Управление оперативными группами Deep Rock Galactic </p>
                    </div>
                    {canManageTeams && (
                        <Button onClick={() => { resetForm(); setShowCreateModal(true); }}>
                            <Plus size={18} className="mr-2" />
                            Сформировать отряд
                        </Button>
                    )}
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 p-1 bg-[#161B22] border border-[#30363D] rounded-xl w-fit">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20"
                                    : "text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D]/50"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="ml-1 px-1.5 py-0.5 bg-black/20 rounded text-[10px]">
                                    {filteredTeams.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-[#8B949E]">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        <span>Синхронизация данных...</span>
                    </div>
                ) : filteredTeams.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Shield size={48} className="text-[#30363D] mx-auto mb-4" />
                            <h3 className="text-[#C9D1D9] text-xl font-bold mb-2">Отряды не найдены</h3>
                            <p className="text-[#8B949E] mb-6">Для выбранного фильтра нет подходящих оперативных групп.</p>
                            {canManageTeams && activeTab === "ALL" && (
                                <Button variant="ghost" onClick={() => { resetForm(); setShowCreateModal(true); }}>
                                    Сформировать первый отряд
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTeams.map((team: TeamDto) => (
                            <Card 
                                key={team.id} 
                                className="group hover:border-[#FF6B35] transition-all border-[#30363D] overflow-hidden cursor-pointer h-full flex flex-col"
                                onClick={() => handleOpenManage(team)}
                            >
                                <CardHeader className="pb-2 bg-[#161B22]/50 border-b border-[#30363D]/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <CardTitle className="text-[#C9D1D9] flex items-center gap-2">
                                                <Users size={18} className="text-[#FF6B35]" />
                                                {team.name}
                                            </CardTitle>
                                            <div className="text-[10px] font-mono text-[#8B949E] mt-1 uppercase tracking-wider">
                                                Unit ID: {team.id}
                                            </div>
                                        </div>
                                        <Badge variant={getStatusVariant(team.status)} className="flex items-center gap-1">
                                            {getStatusIcon(team.status)}
                                            {getStatusLabel(team.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 flex-grow">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
                                            <div className="text-[10px] text-[#8B949E] uppercase mb-1">ID Груза</div>
                                            <div className="flex items-center gap-2 text-[#C9D1D9]">
                                                <Box size={14} className="text-[#FF6B35]" />
                                                <span className="text-sm font-mono truncate">{team.cargoId ? `#${team.cargoId}` : "NONE"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg">
                                            <div className="text-[10px] text-[#8B949E] uppercase mb-1">ID Локации</div>
                                            <div className="flex items-center gap-2 text-[#C9D1D9]">
                                                <Navigation size={14} className="text-[#56C271]" />
                                                <span className="text-sm font-mono">{team.locatedAtId || "NONE"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="p-3 bg-[#161B22]/30 text-[10px] text-center text-[#8B949E] border-t border-[#30363D]/30 opacity-60 group-hover:opacity-100 transition-opacity">
                                    Открыть терминал управления
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Team Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => !isSubmitting && setShowCreateModal(false)}
                    title="Формирование оперативной группы"
                    className="max-w-2xl"
                >
                    <form onSubmit={handleCreateTeam} className="space-y-6">
                        <div className="p-4 bg-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-lg text-[#FF6B35] text-sm">
                             Внимание: выбор сотрудников для команды является окончательным. Только персонал со статусом «ACTIVE».
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Название команды"
                                value={newTeamName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTeamName(e.target.value)}
                                placeholder="Например: Squad Alpha"
                                required
                            />
                            <Input
                                label="ID Локации (Старт)"
                                type="number"
                                value={newLocatedAt || ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLocatedAt(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="ID станции или планеты"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#8B949E]">Доступный персонал ({selectedEmployeeIds.length} выбрано)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {activeEmployees.map((emp: EmployeeResponseDto) => (
                                    <div 
                                        key={emp.id}
                                        onClick={() => emp.id && toggleEmployee(emp.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                                            selectedEmployeeIds.includes(emp.id!) 
                                                ? "bg-[#FF6B35]/20 border-[#FF6B35] text-[#C9D1D9]" 
                                                : "bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]/50"
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{emp.name}</span>
                                            <span className="text-xs opacity-70">{emp.post} | {emp.department}</span>
                                        </div>
                                        {selectedEmployeeIds.includes(emp.id!) && <CheckCircle2 size={16} className="text-[#FF6B35]" />}
                                    </div>
                                ))}
                                {activeEmployees.length === 0 && (
                                    <div className="col-span-2 text-center py-4 text-[#8B949E] text-sm border border-dashed border-[#30363D] rounded-lg">
                                        Нет активных сотрудников для назначения
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-4 border-t border-[#30363D]">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowCreateModal(false)}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={isSubmitting || selectedEmployeeIds.length === 0}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Сформировать"}
                            </Button>
                        </div>
                    </form>
                </Modal>

                {/* Unified Management Modal */}
                <Modal
                    isOpen={showManageModal}
                    onClose={() => !isSubmitting && setShowManageModal(false)}
                    title={`Терминал управления: ${selectedTeam?.name}`}
                    className="max-w-3xl"
                >
                    {selectedTeam && (
                        <div className="space-y-6">
                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl">
                                    <div className="text-[10px] text-[#8B949E] uppercase mb-1 font-bold">Статус</div>
                                    <Badge variant={getStatusVariant(selectedTeam.status)} className="w-full justify-center py-1.5 text-xs">
                                        {getStatusIcon(selectedTeam.status)}
                                        <span className="ml-1.5">{getStatusLabel(selectedTeam.status)}</span>
                                    </Badge>
                                </div>
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl">
                                    <div className="text-[10px] text-[#8B949E] uppercase mb-1 font-bold">ID Локации</div>
                                    <div className="text-[#C9D1D9] font-mono flex items-center gap-2">
                                        <Navigation size={18} className="text-[#56C271]" />
                                        {selectedTeam.locatedAtId || "NONE"}
                                    </div>
                                </div>
                                <div className="p-4 bg-[#0D1117] border border-[#30363D] rounded-xl">
                                    <div className="text-[10px] text-[#8B949E] uppercase mb-1 font-bold">ID Груза</div>
                                    <div className="text-[#C9D1D9] font-mono flex items-center gap-2">
                                        <Box size={18} className="text-[#FF6B35]" />
                                        {selectedTeam.cargoId || "NONE"}
                                    </div>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-[#8B949E] uppercase flex items-center gap-2">
                                    <Users size={14} />
                                    Состав отряда
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {loadingMembers ? (
                                        [1, 2].map((i: number) => (
                                            <div key={i} className="h-12 bg-[#0D1117] animate-pulse rounded-lg border border-[#30363D]" />
                                        ))
                                    ) : teamMembers.length > 0 ? (
                                        teamMembers.map((member: EmployeeResponseDto) => (
                                            <div key={member.id} className="p-3 bg-[#0D1117] border border-[#30363D] rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
                                                    <Users size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-[#C9D1D9]">{member.name}</div>
                                                    <div className="text-[10px] text-[#8B949E]">{member.post}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-4 text-[#8B949E] text-xs border border-dashed border-[#30363D] rounded-lg">
                                            Участники не назначены или отсутствуют в базе
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Protocol Management */}
                            {canManageTeams && (
                                <div className="p-5 bg-[#161B22] border border-[#30363D] rounded-xl">
                                    <h3 className="text-xs font-bold text-[#C9D1D9] uppercase mb-4 flex items-center gap-2">
                                        <Settings2 size={16} className="text-[#FF6B35]" />
                                        Командный протокол (Изменение статуса)
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {["CREATED", "ASSIGNED", "ON_MISSION", "DELIVERED", "ON_THE_WAY", "KILLED", "DEFORMED"].map((st: string) => (
                                            <Button 
                                                key={st}
                                                variant={selectedTeam.status === st ? "primary" : "ghost"}
                                                size="sm" 
                                                className={`flex flex-col items-center justify-center text-[9px] min-h-[44px] w-full p-1 bg-[#0D1117] border border-[#30363D] hover:border-[#FF6B35]/50 transition-all leading-none ${
                                                    selectedTeam.status === st ? "ring-2 ring-[#FF6B35]/50 border-[#FF6B35] !bg-[#FF6B35]/10" : "opacity-70 hover:opacity-100"
                                                }`}
                                                onClick={() => handleUpdateStatus(selectedTeam.id!, st)}
                                            >
                                                <div className="mb-1">{getStatusIcon(st)}</div>
                                                <span className="text-center break-words font-bold">{getStatusLabel(st)}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Technical Configuration (Editing) */}
                            {canManageTeams && (
                                <div className="pt-4 border-t border-[#30363D]">
                                    <form onSubmit={handleUpdateParams} className="flex gap-2 items-end max-w-md pb-4">
                                        <div className="flex-1">
                                            <Input
                                                label="ID Груза"
                                                type="number"
                                                value={cargoId || ""}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCargoId(e.target.value ? Number(e.target.value) : undefined)}
                                                placeholder="Введите ID"
                                                className="mb-0"
                                            />
                                        </div>
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting || (
                                                cargoId === teams.find(t => t.id === selectedTeam.id)?.cargoId && 
                                                selectedTeam.status === teams.find(t => t.id === selectedTeam.id)?.status
                                            )}
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Сохранить"}
                                        </Button>
                                    </form>
                                </div>
                            )}

                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
}
