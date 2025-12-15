package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Weapon;

import java.util.Optional;

@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Long> {

    Optional<Weapon> findByIdentificationNumber(String identificationNumber);

    @Modifying
    @Query("update Weapon w set w.status = :status where w.cargoId = :cargo_id")
    void updateStatusForWeaponsWithCargoId(@Param("status") Status status, @Param("cargo_id") Long cargo_id);
}
