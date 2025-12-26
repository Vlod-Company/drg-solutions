package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
