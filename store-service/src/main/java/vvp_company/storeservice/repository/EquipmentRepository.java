package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.model.Equipment;

import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    Optional<Equipment> findByIdentificationNumber(String identificationNumber);
}
