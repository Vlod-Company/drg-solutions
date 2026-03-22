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
    CreateBiomeDto,
    RecommendedWeaponDto,
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

export const WeaponInfoService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get("/glossary-service/weaponInfo/all");
        return response.data;
    },

    getByName: async (name: string): Promise<any> => {
        const response = await api.get("/glossary-service/weaponInfo", { params: { weaponName: name } });
        return response.data;
    },

    create: async (data: { name: string; description: string; weight: number; impactTypeId: number }): Promise<any> => {
        const response = await api.post("/glossary-service/weaponInfo", data);
        return response.data;
    },

    update: async (id: number, data: { name: string; description: string; weight: number; impactTypeId: number }): Promise<any> => {
        const response = await api.put(`/glossary-service/weaponInfo/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/glossary-service/weaponInfo/${id}`);
    },
};

export const ResourceInfoService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get("/glossary-service/resourceInfo/all");
        return response.data;
    },

    getByName: async (name: string): Promise<any> => {
        const response = await api.get("/glossary-service/resourceInfo", { params: { resourceName: name } });
        return response.data;
    },

    create: async (data: { name: string; description: string; weightPerUnit: number }): Promise<any> => {
        const response = await api.post("/glossary-service/resourceInfo", data);
        return response.data;
    },

    update: async (id: number, data: { name: string; description: string; weightPerUnit: number }): Promise<any> => {
        const response = await api.put(`/glossary-service/resourceInfo/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/glossary-service/resourceInfo/${id}`);
    },
};

export const EquipmentInfoService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get("/glossary-service/equipmentInfo/all");
        return response.data;
    },

    getByName: async (name: string): Promise<any> => {
        const response = await api.get("/glossary-service/equipmentInfo", { params: { equipmentName: name } });
        return response.data;
    },

    create: async (data: { name: string; description: string; weight: number }): Promise<any> => {
        const response = await api.post("/glossary-service/equipmentInfo", data);
        return response.data;
    },

    update: async (id: number, data: { name: string; description: string; weight: number }): Promise<any> => {
        const response = await api.put(`/glossary-service/equipmentInfo/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/glossary-service/equipmentInfo/${id}`);
    },
};

export const ImpactTypeService = {
    getAll: async(): Promise<any> => {
        const response = await api.get("/glossary-service/impactTypes");
        return response.data;
    }
}

export const EmployeeService = {
    getAll: async (pageNumber: number = 0, pageSize: number = 20): Promise<any> => {
        const response = await api.get("/employee-service/employees", {
            params: { pageNumber, pageSize }
        });
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
    getAll: async (pageNumber: number = 0, pageSize: number = 10): Promise<any> => {
        const response = await api.get("/mission-service/mission", {
            params: { pageNumber, pageSize }
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
    createSendMissionRequest: async (missionId: number, items: any[]): Promise<RequestDto> => {
        const response = await api.post(`/mission-service/mission/send/${missionId}`, items);
        return response.data;
    },
    getRecommendedWeapons: async (id: number): Promise<RecommendedWeaponDto[]> => {
        const response = await api.get(`/mission-service/mission/${id}/getRecommendedWeapons`);
        return response.data;
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
    getMyDepartmentRequests: async (pageNumber: number = 0, pageSize: number = 10): Promise<any> => {
        const response = await api.get(
            "/request-service/request/to-my-department",
            { params: { pageNumber, pageSize } }
        );
        return response.data;
    },
    getFromMyDepartmentRequests: async (pageNumber: number = 0, pageSize: number = 10): Promise<any> => {
        const response = await api.get(
            "/request-service/request/from-my-department",
            { params: { pageNumber, pageSize } }
        );
        return response.data;
    },
    getFiltered: async (pageNumber: number = 0, pageSize: number = 10, filter: RequestFilter): Promise<any> => {
        const response = await api.post("/request-service/request/filters", filter, {
            params: { pageNumber, pageSize }
        });
        return response.data;
    },
};

export interface RequestFilter {
    code?: string;
    senderDepartment?: string;
    recipientDepartment?: string;
    status?: string;
    isMine?: boolean;
    isRecipient?: boolean;
}

export const StationService = {
    getAll: async (): Promise<any[]> => {
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

export const LogisticsService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get("/logistics-service/logistics");
        return response.data;
    },
    getById: async (id: number): Promise<any> => {
        const response = await api.get(`/logistics-service/logistics/${id}`);
        return response.data;
    },
    update: async (id: number, data: any): Promise<any> => {
        const response = await api.put(`/logistics-service/logistics/${id}`, data);
        return response.data;
    },
    createShipment: async (data: any): Promise<void> => {
        await api.post("/logistics-service/shipment", data);
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
    getMonsterById: async (id: number): Promise<any> => {
        const response = await api.get(`/ecosystem-service/monster/${id}`);
        return response.data;
    },

    createMonster: async (data: {
        name: string;
        description: string;
        dangerLevel: number;
        heritage: string;
        monsterType: string;
        biomeId: number;
        armorType: string;
        weaknesses: number[];
        strengths: number[];
    }): Promise<any> => {
        const response = await api.post("/ecosystem-service/monster", data);
        return response.data;
    },

    updateMonster: async (id: number, data: {
        name: string;
        description: string;
        dangerLevel: number;
        heritage: string;
        monsterType: string;
        biomeId: number;
        armorType: string;
        weaknesses: number[];
        strengths: number[];
    }): Promise<any> => {
        const response = await api.put(`/ecosystem-service/monster/${id}`, data);
        return response.data;
    },

    deleteMonster: async (id: number): Promise<void> => {
        await api.delete(`/ecosystem-service/monster/${id}`);
    },
};

export const DeliveryPointService = {
    getById: async (id: number): Promise<any> => {
        const response = await api.get(`/delivery-point-service/deliveryPoint/${id}`);
        return response.data;
    },
};

export const CargoService = {
    getById: async (id: number): Promise<any> => {
        const response = await api.get(`/logistics-service/cargo/${id}`);
        return response.data;
    },
};

export const UserService = {
    getAll: async (): Promise<any> => {
        const response = await api.get("/auth-service/auth/users");
        return response.data;
    },

    getById: async (userId: number): Promise<any> => {
        const response = await api.get(`/auth-service/auth/users/${userId}`);
        return response.data;
    },

    register: async (data: { name: string; password: string; employee_id: number }): Promise<any> => {
        const response = await api.post("/auth-service/auth/register", data);
        return response.data;
    },

    addRole: async (userId: number, data: { roleName: string }): Promise<any> => {
        const response = await api.post(`/auth-service/auth/users/${userId}/roles/add`, data);
        return response.data;
    },

    removeRole: async (userId: number, data: { roleName: string }): Promise<any> => {
        const response = await api.post(`/auth-service/auth/users/${userId}/roles/remove`, data);
        return response.data;
    },
};

export const StoreService = {
    findItemsInDeliveryPoint: async (deliveryPointId: number): Promise<DeliveryPointResponseDTO[]> => {
        const response = await api.post(`/store-service/items/${deliveryPointId}/all`);
        return response.data;
    },
    getCargoItems: async (cargoId: number): Promise<any[]> => {
        const response = await api.get(`/store-service/items/getCargoItems/${cargoId}`);
        return response.data;
    },
    getWeaponIds: async (deliveryPointId: number, name: string): Promise<string[]> => {
        const response = await api.get(`/store-service/items/${deliveryPointId}/getWeaponIds`, {
            params: { name }
        });
        return response.data;
    },
    getEquipmentIds: async (deliveryPointId: number, name: string): Promise<string[]> => {
        const response = await api.get(`/store-service/items/${deliveryPointId}/getEquipmentIds`, {
            params: { name }
        });
        return response.data;
    },
    reserveForCargo: async (data: any): Promise<void> => {
        await api.post("/store-service/items/reserveCargo", data);
    },
    addItemsToDeliveryPoint: async (deliveryPointId: number, items: any[]) => {
        const response = await api.post(`/store-service/items/add/${deliveryPointId}`, items);
        return response.data;
    },
};

export const SpaceShipService = {
    getAll: async (): Promise<any[]> => {
        const response = await api.get("/spaceship-service/spaceship");
        return response.data;
    },
    getById: async (id: number): Promise<any> => {
        const response = await api.get(`/spaceship-service/spaceship/${id}`);
        return response.data;
    },
    create: async (data: any): Promise<any> => {
        const response = await api.post("/spaceship-service/spaceship", data);
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
    getAll: async (pageNumber: number = 0, pageSize: number = 20): Promise<any> => {
        const response = await api.get("/team-service/team", {
            params: { pageNumber, pageSize }
        });
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
