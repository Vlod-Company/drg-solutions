package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Weapon;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Long> {

    List<Weapon> getWeaponsByIdentificationNumber(String identificationNumber);

    @Modifying
    @Query("update Weapon w set w.status = :status where w.cargoId = :cargo_id")
    void updateStatusForWeaponsWithCargoId(@Param("status") Status status, @Param("cargo_id") Long cargo_id);

    @Query("select w from Weapon w where w.locatedAt = :located_at and w.name = :name and " +
            "w.identificationNumber not in (select ww.identificationNumber from Weapon ww where ww.locatedAt = :located_at and ww.name = :name and ww.status != :status)")
    List<Weapon> getWeaponsByLocatedAtAndNameAndNotStatus(@Param("located_at") Long locatedAt, @Param("name") String name, @Param("status") Status status);

    List<Weapon> getWeaponsByCargoId(Long cargoId);
}
