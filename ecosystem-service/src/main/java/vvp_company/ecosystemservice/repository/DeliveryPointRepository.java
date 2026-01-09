package vvp_company.ecosystemservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.ecosystemservice.model.DeliveryPoint;

@Repository
public interface DeliveryPointRepository extends JpaRepository<DeliveryPoint, Long> {
}
