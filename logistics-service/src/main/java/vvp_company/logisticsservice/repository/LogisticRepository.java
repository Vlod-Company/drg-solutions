package vvp_company.logisticsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.logisticsservice.model.Logistic;

@Repository
public interface LogisticRepository extends JpaRepository<Logistic, Long> {
}
