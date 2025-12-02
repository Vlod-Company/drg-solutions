package vvp_company.missionservice.repository;

import org.springframework.data.repository.CrudRepository;
import vvp_company.missionservice.model.Team;

public interface TeamRepository extends CrudRepository<Team, Long> {
}
