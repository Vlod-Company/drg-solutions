package vvp_company.teamservice.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE')")
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE')")
    @DeleteMapping("/{id}")
    public void deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE')")
    @PutMapping("/{id}")
    public void updateTeam(@PathVariable Long id, @NotNull @RequestParam("status") TeamStatus status, @RequestParam("cargoId") Long cargoId) {
        teamService.updateTeamStatus(id, status, cargoId);
    }
}
