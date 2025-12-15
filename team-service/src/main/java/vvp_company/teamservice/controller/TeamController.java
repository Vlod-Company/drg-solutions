package vvp_company.teamservice.controller;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.teamservice.dto.TeamDto;
import vvp_company.teamservice.enm.TeamStatus;
import vvp_company.teamservice.service.TeamService;

import java.util.List;

@RestController
@RequestMapping("/team")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public TeamDto createTeam(@NotBlank @RequestParam String teamName) {
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

    @PutMapping("/{id}")
    public void updateTeam(@PathVariable Long id, @NotBlank @RequestParam("status") TeamStatus status, @RequestParam("cargoId") Long cargoId) {
        teamService.updateTeamStatus(id, status, cargoId);
    }
}
