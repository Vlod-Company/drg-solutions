package vvp_company.teamservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.teamservice.dto.TeamDto;
import vvp_company.teamservice.model.Team;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface TeamMapper {

    Team toTeam(TeamDto teamDto);
    TeamDto toTeamDto(Team team);
}
