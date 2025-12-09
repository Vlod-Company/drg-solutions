package vvp_company.missionservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.missionservice.dto.CreateMissionRequest;
import vvp_company.missionservice.dto.MissionDto;
import vvp_company.missionservice.model.Mission;

@Mapper(componentModel = "spring")
public interface MissionMapper {

    MissionDto toMissionDto(Mission m);
    Mission toMission(MissionDto m);
    Mission fromCreateMissionRequest(CreateMissionRequest createMissionRequest);
}
