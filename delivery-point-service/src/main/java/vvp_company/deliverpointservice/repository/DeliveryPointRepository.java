package vvp_company.deliverpointservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.deliverpointservice.model.DeliveryPoint;

@Repository
public interface DeliveryPointRepository extends JpaRepository<DeliveryPoint, Long> {
}
