package vvp_company.missionservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vvp_company.missionservice.dto.request.CreateMissionRequest;
import vvp_company.missionservice.dto.nested.MissionDto;
import vvp_company.missionservice.model.Mission;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface MissionMapper {

    MissionDto toMissionDto(Mission m);
    Mission toMission(MissionDto m);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "missionEnd", ignore = true)
    Mission fromCreateMissionRequest(CreateMissionRequest createMissionRequest);
}
