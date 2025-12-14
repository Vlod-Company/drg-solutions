package vvp_company.logisticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.logisticsservice.model.Team;
import vvp_company.logisticsservice.repository.TeamRepository;

@Service
@RequiredArgsConstructor
public class TeamToCargoService {

    private final TeamRepository teamRepository;

    public void assignCargoToTeam(Long teamId, Long cargoId) {
        Team team = teamRepository.findById(teamId).orElse(null);
        if (team == null) {
            return;
        }
        team.setCargoId(cargoId);
        teamRepository.save(team);
    }
}
