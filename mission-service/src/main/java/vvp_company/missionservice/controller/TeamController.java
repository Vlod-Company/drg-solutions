package vvp_company.missionservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.missionservice.dto.TeamDto;
import vvp_company.missionservice.service.TeamService;

import java.util.List;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public TeamDto createTeam(@RequestParam String teamName) {
        return teamService.createTeam(teamName);
    }

    @GetMapping
    public List<TeamDto> getAllTeams() {
        return teamService.findAllTeams();
    }

    @GetMapping("/{id}")
    public TeamDto getTeam(@PathVariable Long id) {
        return teamService.findTeam(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }
}
