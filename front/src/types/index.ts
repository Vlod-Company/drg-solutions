export type Role =
    | "ROLE_ADMIN"
    | "ROLE_MANAGEMENT_EMPLOYEE"
    | "ROLE_MISSION_CONTROL_EMPLOYEE"
    | "ROLE_SCANCOM_EMPLOYEE"
    | "ROLE_RND_EMPLOYEE"
    | "ROLE_SCIENCE_DEPARTMENT_EMPLOYEE"
    | "ROLE_LAUNCH_CONTROL_EMPLOYEE"
    | "ROLE_MAINTENANCE_EMPLOYEE"
    | "ROLE_MINER_EMPLOYEE"
    | "ROLE_USER";

export interface User {
    id: string;
    username: string;
    name: string;
    roles: Role[];
    department: string;
    employeeId?: number;
    avatar?: string;
}

export type RequestStatus = "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Request {
    id: string;
    type: string;
    title: string;
    description: string;
    from: string;
    to: string;
    status: RequestStatus;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    createdAt: string;
    updatedAt: string;
}

export type MissionStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "FAILED";

export interface Mission {
    id: string;
    name: string;
    type: "MINING" | "RESEARCH" | "RESCUE" | "DEFENSE";
    biome: string;
    planet: string;
    teamSize: number;
    maxTeamSize: number;
    dangerLevel: number;
    objective: string;
    status: MissionStatus;
    startDate?: string;
    endDate?: string;
}

export type StationStatus =
    | "PLANNED"
    | "UNDER_CONSTRUCTION"
    | "OPERATIONAL"
    | "UNDER_ATTACK"
    | "DECOMMISSIONED";

export interface Station {
    id: string;
    name: string;
    type: string;
    planet: string;
    status: StationStatus;
    capacity: number;
    currentCrew: number;
    resources: string[];
    lastInspection?: string;
}

export interface Biome {
    id: string;
    name: string;
    planet: string;
    type: string;
    dangerLevel: number;
    resources: string[];
    flora: string[];
    fauna: string[];
    discovered: string;
}

export interface Employee {
    id: string;
    name: string;
    role: Role;
    department: string;
    qualification: string;
    missionsCompleted: number;
    status: "ACTIVE" | "ON_MISSION" | "RESTING" | "INJURED";
    joinedAt: string;
}
