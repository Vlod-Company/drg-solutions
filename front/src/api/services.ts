import { api } from "./client";
import {
    AuthResponse,
    LoginRequest,
    TokenInfo,
    UserDto,
    EmployeeResponseDto,
    MissionDto,
    PagedResponseMissionDto,
    RequestDto,
    CreateRequestDto,
    Station,
    BiomeDto,
    CreateMissionRequest,
    CreateStationDTO,
    ChangeStatusDTO,
    AttackedDTO,
    PlanetDto,
    TeamDto,
    GlossaryBiome,
    EquipmentInfoDTO,
    ResourceInfoDTO,
    MonsterDto,
    WeaponInfoDTO,
    DeliveryPointResponseDTO,
    ItemResponseDTO,
    CreateTeamDto,
    UpdateTeamDto,
    TeamMembersResponse,
} from "../types/api";

export const AuthService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post("/auth-service/auth/login", data);
        return response.data;
    },
    getMe: async (): Promise<TokenInfo> => {
        const response = await api.get("/auth-service/auth/me");
        return response.data;
    },
};

export const EmployeeService = {
    getAll: async (): Promise<EmployeeResponseDto[]> => {
        const response = await api.get("/employee-service/employees");
        return response.data;
    },
    getById: async (id: number): Promise<EmployeeResponseDto> => {
        const response = await api.get(`/employee-service/employees/${id}`);
        return response.data;
    },
    getByIds: async (ids: number[]): Promise<EmployeeResponseDto[]> => {
        const response = await api.get("/employee-service/employees/byIds", {
            params: { ids: ids.join(",") }
        });
        return response.data;
    },
    create: async (data: any): Promise<EmployeeResponseDto> => {
        const response = await api.post("/employee-service/employees", data);
        return response.data;
    },
    update: async (id: number, data: any): Promise<EmployeeResponseDto> => {
        const response = await api.put(`/employee-service/employees/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/employee-service/employees/${id}`);
    },
};

export const MissionService = {
    getAll: async (
        pageNumber: number = 0,
        pageSize: number = 10
    ): Promise<PagedResponseMissionDto> => {
        const response = await api.get("/mission-service/mission", {
            params: { pageNumber, pageSize },
        });
        return response.data;
    },
    getById: async (id: number): Promise<MissionDto> => {
        const response = await api.get(`/mission-service/mission/${id}`);
        return response.data;
    },
    create: async (data: CreateMissionRequest): Promise<MissionDto> => {
        const response = await api.post("/mission-service/mission", data);
        return response.data;
    },
    update: async (id: number, data: any): Promise<MissionDto> => {
        const response = await api.put(`/mission-service/mission/${id}`, data);
        return response.data;
    },
    delete: async (id: number): Promise<void> => {
        await api.delete(`/mission-service/mission/${id}`);
    },
};

export const RequestService = {
    create: async (data: CreateRequestDto): Promise<RequestDto> => {
        const response = await api.post("/request-service/request", data);
        return response.data;
    },
    getById: async (id: number): Promise<RequestDto> => {
        const response = await api.get(`/request-service/request/${id}`);
        return response.data;
    },
    update: async (id: number, data: any): Promise<RequestDto> => {
        const response = await api.put(`/request-service/request/${id}`, data);
        return response.data;
    },
    // Endpoint found in Postman collection but not in OpenAPI (assumed to exist)
    getMyDepartmentRequests: async (): Promise<RequestDto[]> => {
        const response = await api.get(
            "/request-service/request/to-my-department"
        );
        // Handle paged response or direct array
        return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    },
    getFromMyDepartmentRequests: async (): Promise<RequestDto[]> => {
        const response = await api.get(
            "/request-service/request/from-my-department"
        );
        // Handle paged response or direct array
        return Array.isArray(response.data) ? response.data : (response.data?.data || []);
    },
};

export const StationService = {
    getAll: async (): Promise<Station[]> => {
        const response = await api.get("/station-service/station");
        return response.data;
    },
    create: async (data: CreateStationDTO): Promise<Station> => {
        const response = await api.post("/station-service/station", data);
        return response.data;
    },
    setAttacked: async (id: number, data: AttackedDTO): Promise<void> => {
        await api.post(`/station-service/station/${id}/setAttacked`, data);
    },
    changeStatus: async (id: number, data: ChangeStatusDTO): Promise<Station> => {
        const response = await api.put(
            `/station-service/station/${id}/changeStatus`,
            data
        );
        return response.data;
    },
};

export const EcosystemService = {
    getAllBiomes: async (): Promise<BiomeDto[]> => {
        const response = await api.get("/ecosystem-service/biome");
        return response.data;
    },
    getAllMonsters: async (): Promise<MonsterDto[]> => {
        const response = await api.get("/ecosystem-service/monster");
        return response.data;
    },
    getAllPlanets: async (): Promise<PlanetDto[]> => {
        const response = await api.get("/planet-service/api/planets");
        return response.data;
    },
    updateBiome: async (id: number, data: any): Promise<BiomeDto> => {
        const response = await api.put(`/ecosystem-service/biome/${id}`, data);
        return response.data;
    },
    updatePlanet: async (id: number, data: any): Promise<PlanetDto> => {
        const response = await api.put(`/planet-service/api/planets/${id}`, data);
        return response.data;
    },
    createBiome: async (data: CreateBiomeDto): Promise<BiomeDto> => {
        const response = await api.post("/ecosystem-service/biome", data);
        return response.data;
    },
};

export const DeliveryPointService = {
    getById: async (id: number): Promise<any> => {
        const response = await api.get(`/delivery-point-service/deliveryPoint/${id}`);
        return response.data;
    },
};

export const StoreService = {
    findItemsInDeliveryPoint: async (deliveryPointId: number): Promise<DeliveryPointResponseDTO[]> => {
        const response = await api.post(`/store-service/items/${deliveryPointId}/all`);
        return response.data;
    },
};

export const GlossaryService = {
    getBiomes: async (): Promise<GlossaryBiome[]> => {
        const response = await api.get("/glossary-service/biome/all");
        return response.data;
    },
    getEquipment: async (): Promise<EquipmentInfoDTO[]> => {
        const response = await api.get("/glossary-service/equipmentInfo/all");
        return response.data;
    },
    getResources: async (): Promise<ResourceInfoDTO[]> => {
        const response = await api.get("/glossary-service/resourceInfo/all");
        return response.data;
    },
    getWeapons: async (): Promise<WeaponInfoDTO[]> => {
        const response = await api.get("/glossary-service/weaponInfo/all");
        return response.data;
    },
};

export const TeamService = {
    getAll: async (): Promise<TeamDto[]> => {
        const response = await api.get("/team-service/team");
        return response.data;
    },
    getById: async (id: number): Promise<TeamDto> => {
        const response = await api.get(`/team-service/team/${id}`);
        return response.data;
    },
    create: async (data: CreateTeamDto): Promise<TeamDto> => {
        const response = await api.post("/team-service/team", data);
        return response.data;
    },
    update: async (id: number, data: Partial<TeamDto>): Promise<TeamDto> => {
        const response = await api.put(`/team-service/team/${id}`, data);
        return response.data;
    },
    getTeamMembers: async (id: number): Promise<TeamMembersResponse> => {
        const response = await api.get(`/team-service/team/${id}/getTeamMembers`);
        return response.data;
    },
    updateStatus: async (id: number, status: string, cargoId?: number): Promise<void> => {
        const data: UpdateTeamDto = {
            teamStatus: status,
            cargoId: cargoId
        };
        await api.put(`/team-service/team/${id}`, data);
    },
};

