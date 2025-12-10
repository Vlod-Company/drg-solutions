package vvp_company.glossaryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.glossaryservice.model.EquipmentInfo;

import java.util.Optional;

@Repository
public interface EquipmentInfoRepository extends JpaRepository<EquipmentInfo, Long> {

    Optional<EquipmentInfo> findByName(String name);
}
