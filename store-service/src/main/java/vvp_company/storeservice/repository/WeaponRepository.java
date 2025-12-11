package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.model.Weapon;

@Repository
public interface WeaponRepository extends JpaRepository<Weapon, Long> {
}
