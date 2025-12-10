package vvp_company.glossaryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.glossaryservice.model.WeaponInfo;

import java.util.Optional;

@Repository
public interface WeaponInfoRepository extends JpaRepository<WeaponInfo, Long> {

    Optional<WeaponInfo> findByName(String name);
}
