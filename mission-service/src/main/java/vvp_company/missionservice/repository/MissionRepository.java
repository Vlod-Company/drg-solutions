package vvp_company.missionservice.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import vvp_company.missionservice.model.Mission;

@Repository
public interface MissionRepository extends CrudRepository<Mission, Long> {
}
