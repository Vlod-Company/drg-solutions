package vvp_company.missionservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.missionservice.dto.TeamDto;
import vvp_company.missionservice.model.Team;

@Mapper(componentModel = "spring")
public interface TeamMapper {

    Team toTeam(TeamDto teamDto);
    TeamDto toTeamDto(Team team);
}
