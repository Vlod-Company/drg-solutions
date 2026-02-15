export interface AuthResponse {
    token?: string;
    tokenType?: string;
}

export interface TokenInfo {
    username?: string;
    user_id?: number;
    employee_id?: number;
    post?: string;
    department?: string;
    roles?: string[];
}

export interface UserDto {
    id?: number;
    employeeId?: number;
    username?: string;
    active?: boolean;
    createdAt?: string;
    roles?: string[];
}

export interface DeliveryPoint {
    id?: number;
    name?: string;
    type?: string;
}

export interface EmployeeResponseDto {
    id?: number;
    name?: string;
    post?: string;
    department?: string;
    experience?: number;
    status?: string | "ACTIVE" | "FIRED" | "ON_VACATION";
    hiredDate?: string;
    firedDate?: string;
}

export interface EmployeeRequestDto {
    name?: string;
    post?: string;
    department?: string;
    experience?: number;
    status?: "ACTIVE" | "FIRED" | "ON_VACATION";
    hiredDate?: string;
}

export interface BiomeDto {
    id?: number;
    name?: string;
    description?: string;
    planetId?: number;
    deliveryPointId?: number;
}

export interface CreateBiomeDto {
    name?: string;
    description?: string;
    planetId?: number;
}

export interface MonsterDto {
    id?: number;
    name?: string;
    description?: string;
    dangerLevel?: number;
    heritage?: string;
    monsterType?: string;
    biomeId?: number;
    armorType?: string;
    weaknesses?: ImpactTypeShortDto[];
    strengths?: ImpactTypeShortDto[];
}

export interface CreateMonsterDto {
    name?: string;
    description?: string;
    dangerLevel?: number;
    heritage?: string;
    monsterType?: string;
    biomeId?: number;
    armorType?: string;
    weaknessIds?: number[];
    strengthIds?: number[];
}

export interface ImpactTypeDto {
    id?: number;
    name?: string;
    description?: string;
}

export interface CreateImpactTypeDto {
    name?: string;
    description?: string;
}

export interface ImpactTypeShortDto {
    id?: number;
    name?: string;
}

export interface GlossaryBiome {
    id?: number;
    name?: string;
    description?: string;
}

export interface EquipmentInfoDTO {
    name?: string;
    description?: string;
    weight?: number;
}

export interface ResourceInfoDTO {
    name?: string;
    description?: string;
    weightPerUnit?: number;
}

export interface WeaponInfoDTO {
    name?: string;
    description?: string;
    weight?: number;
    impactType?: ImpactTypeDto;
}

export interface Logistic {
    id?: number;
    sendTime?: string;
    cargoId?: number;
    spaceShipId?: number;
    status?: string;
}

export interface UpdateLogisticRequest {
    newStatus?: string;
    newDate?: string;
}

export interface CreateShipmentRequest {
    spaceShipId?: number;
    shipToDate?: string;
    shipToPoint?: number;
    data?: SendItemDTO[];
}

export interface MissionDto {
    id?: number;
    name?: string;
    biomeId?: number;
    description?: string;
    teamId?: number;
    requiredExperience?: number;
    status?: string;
    missionStart?: string;
    missionEnd?: string;
}

export interface CreateMissionRequest {
    name?: string;
    biomeId?: number;
    description?: string;
    teamId?: number;
    requiredExperience?: number;
    missionStart?: string;
}

export interface PagedResponseMissionDto {
    data?: MissionDto[];
    total?: number;
    pageNumber?: number;
    pageSize?: number;
}

export interface PlanetDto {
    id?: number;
    name?: string;
}

export interface CreatePlanetRequest {
    name?: string;
}

export interface RequestDto {
    id?: number;
    status?: string;
    senderDepartment?: string;
    recipientDepartment?: string;
    requestCode?: string;
    description?: string;
    response?: string;
    senderEmployeeId?: number;
    recipientEmployeeId?: number;
    createdAt?: string;
    closedAt?: string;
}

export interface CreateRequestDto {
    recipientDepartment?: string;
    requestCode?: string;
    description?: string;
}

export interface SpaceShip {
    id?: number;
    name?: string;
    liftingCapacity?: number;
}

export interface CreateSpaceShipDTO {
    name?: string;
    liftingCapacity?: number;
}

export interface Station {
    id?: number;
    name?: string;
    planetId?: number;
    type?: string;
    status?: string;
    deliveryPointId?: number;
}

export interface CreateStationDTO {
    name?: string;
    planetId?: number;
    type?: string;
}

export interface AttackedDTO {
    description?: string;
}

export interface ChangeStatusDTO {
    status?: string;
}

export interface ItemSearchDTO {
    itemName?: string;
    itemType?: string;
}

export interface ItemResponseDTO {
    itemType?: string;
    itemName?: string;
    itemWeight?: number;
    itemQuantity?: number;
}

export interface DeliveryPointResponseDTO {
    deliveryPointType?: string;
    deliveryPointId?: number;
    data?: ItemResponseDTO[];
}

export interface ReserveCargoRequest {
    cargoId?: number;
    locatedAt?: number;
    data?: SendItemDTO[];
}

export interface SendItemDTO {
    itemType?: string;
    name?: string;
}

export interface RoleRequest {
    roleName?: string;
}

export interface SetRolesRequest {
    roleNames?: string[];
}

export interface UpdateMissionRequest {
    newStatus?: string;
    newMissionEnd?: string;
}

export interface RecommendedWeaponDto {
    weaponId?: number;
    weaponName?: string;
    impactTypeName?: string;
}

export interface TeamDto {
    id?: number;
    name?: string;
    cargoId?: number;
    locatedAtId?: number;
    status?: string;
}

export interface RegistrationRequest {
    name?: string;
    password?: string;
    employee_id?: number;
}

export interface LoginRequest {
    name?: string;
    password?: string;
}

export interface ValidateTokenRequest {
    token?: string;
}

export interface CreateTeamDto {
    teamName: string;
    employeeIds: number[];
    locatedAt: number;
}

export interface UpdateTeamDto {
    teamStatus: string;
    cargoId?: number;
}

export interface TeamMembersResponse {
    employeeId: number[];
}
