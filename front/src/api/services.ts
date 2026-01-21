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
    // Endpoint found in Postman collection but not in OpenAPI (assumed to exist)
    getMyDepartmentRequests: async (): Promise<RequestDto[]> => {
        const response = await api.get(
            "/request-service/request/to-my-department"
        );
        return response.data;
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
    getAllPlanets: async (): Promise<PlanetDto[]> => {
        const response = await api.get("/ecosystem-service/planet");
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
};

