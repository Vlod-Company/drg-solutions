package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.enm.TeamStatus;
import vvp_company.storeservice.model.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    @Modifying
    @Query("update Team r set r.status = :status where r.cargoId = :cargo_id")
    void updateStatusForTeamWithCargoId(@Param("status") TeamStatus status, @Param("cargo_id") Long cargo_id);
}
