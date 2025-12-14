package vvp_company.logisticsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.logisticsservice.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
