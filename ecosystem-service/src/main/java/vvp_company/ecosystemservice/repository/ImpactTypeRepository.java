package vvp_company.ecosystemservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vvp_company.ecosystemservice.model.ImpactType;

public interface ImpactTypeRepository extends JpaRepository<ImpactType, Long> {
}
