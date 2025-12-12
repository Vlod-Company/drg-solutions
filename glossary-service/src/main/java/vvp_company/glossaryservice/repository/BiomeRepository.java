package vvp_company.glossaryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.glossaryservice.model.Biome;

@Repository
public interface BiomeRepository extends JpaRepository<Biome, Long> {
}
