package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Equipment;

import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByIdentificationNumber(String identificationNumber);

    @Modifying
    @Query("update Equipment e set e.status = :status where e.cargoId = :cargo_id")
    void updateStatusForEquipmentWithCargoId(@Param("status") Status status, @Param("cargo_id") Long cargo_id);
}
