package vvp_company.planetservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vvp_company.planetservice.model.Planet;
import java.util.Optional;

public interface PlanetRepository extends JpaRepository<Planet, Long> {
    Optional<Planet> findByName(String name);
    boolean existsByName(String name);
}
