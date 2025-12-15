package vvp_company.spaceshipservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.spaceshipservice.model.SpaceShip;

@Repository
public interface SpaceShipRepository extends JpaRepository<SpaceShip, Long> {
}
