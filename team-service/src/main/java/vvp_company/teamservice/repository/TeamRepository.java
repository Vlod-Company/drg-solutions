package vvp_company.teamservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.teamservice.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
