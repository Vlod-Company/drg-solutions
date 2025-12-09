package vvp_company.missionservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.missionservice.model.Mission;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {

    @Query(value = "select * from get_recommended_weapons(:missionId)", nativeQuery = true)
    List<Object> getRecommendedWeapons(@Param("missionId") Long missionId);
}
