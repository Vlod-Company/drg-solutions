package vvp_company.logisticsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.logisticsservice.model.Cargo;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {

    @Query(value = "select * from recalculate_cargo_weight(:id)", nativeQuery = true)
    void recalculateCargo(@Param("id") Long cargoId);
}
