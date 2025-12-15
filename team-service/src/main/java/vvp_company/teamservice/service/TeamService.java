package vvp_company.teamservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.teamservice.dto.TeamDto;
import vvp_company.teamservice.enm.TeamStatus;
import vvp_company.teamservice.mapper.TeamMapper;
import vvp_company.teamservice.model.Team;
import vvp_company.teamservice.repository.TeamRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMapper teamMapper;

    public TeamDto createTeam(String teamName) {
        var team = Team.builder()
                .name(teamName)
                .build();
        return teamMapper.toTeamDto(teamRepository.save(team));
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

    public void updateTeamStatus(Long teamId, TeamStatus status) {
        var team = teamRepository.findById(teamId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        team.setStatus(status);
        teamRepository.save(team);
    }
}
