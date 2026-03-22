package vvp_company.teamservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.teamservice.dto.CreateTeamDto;
import vvp_company.teamservice.dto.TeamDto;
import vvp_company.teamservice.dto.TeamMembersResponse;
import vvp_company.teamservice.enm.TeamStatus;
import vvp_company.teamservice.mapper.TeamMapper;
import vvp_company.teamservice.model.Team;
import vvp_company.teamservice.model.TeamMember;
import vvp_company.teamservice.repository.TeamMemberRepository;
import vvp_company.teamservice.repository.TeamRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMapper teamMapper;
    private final TeamMemberRepository teamMemberRepository;

    public TeamDto createTeam(CreateTeamDto dto) {
        var team = Team.builder()
                .name(dto.getTeamName())
                .locatedAtId(dto.getLocatedAt())
                .build();
        var teamEntity = teamRepository.save(team);

        dto.getEmployeeIds().forEach(id -> teamMemberRepository.save(TeamMember.builder().employeeId(id).teamId(teamEntity.getId()).build()));
        return teamMapper.toTeamDto(teamEntity);
    }

    public TeamMembersResponse getTeamMembers(Long teamId) {
        return new TeamMembersResponse(teamMemberRepository.findAllByTeamId(teamId).stream().map(TeamMember::getEmployeeId).toList());
    }

    public List<TeamDto> findAllTeams() {
        return teamRepository.findAll().stream().map(teamMapper::toTeamDto).toList();
    }

    public TeamDto findTeam(Long teamId) {
        return teamMapper.toTeamDto(teamRepository.findById(teamId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Команда не найдена")));
    }

    public void deleteTeam(Long teamId) {
        teamRepository.deleteById(teamId);
    }

    public void updateTeamStatus(Long teamId, TeamStatus status, Long cargoId) {
        var team = teamRepository.findById(teamId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        team.setStatus(status != null ? status : team.getStatus());
        team.setCargoId(cargoId != null ? cargoId : team.getCargoId());

        teamRepository.save(team);
    }
}
