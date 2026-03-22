package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Equipment;
import vvp_company.storeservice.model.Weapon;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> getEquipmentByIdentificationNumber(String identificationNumber);

    @Modifying
    @Query("update Equipment e set e.status = :status where e.cargoId = :cargo_id")
    void updateStatusForEquipmentWithCargoId(@Param("status") Status status, @Param("cargo_id") Long cargo_id);

    @Query("select e from Equipment e where e.locatedAt = :located_at and e.name = :name and " +
            "e.identificationNumber not in (select ee.identificationNumber from Equipment ee where ee.locatedAt = :located_at and ee.name = :name and ee.status != :status)")
    List<Equipment> getEquipmentByLocatedAtAndNameAndNotStatus(@Param("located_at") Long locatedAt, @Param("name") String name, @Param("status") Status status);

    List<Equipment> getEquipmentByCargoId(Long cargoId);
}
