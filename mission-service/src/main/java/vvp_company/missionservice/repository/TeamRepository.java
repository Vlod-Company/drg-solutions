package vvp_company.missionservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.missionservice.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
