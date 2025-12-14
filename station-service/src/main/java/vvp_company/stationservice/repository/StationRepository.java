package vvp_company.stationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.stationservice.model.Station;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {
}
