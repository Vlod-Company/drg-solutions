package vvp_company.glossaryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.glossaryservice.model.Biome;
import vvp_company.glossaryservice.model.Monster;

import java.util.List;

@Repository
public interface MonsterRepository extends JpaRepository<Monster, Long> {

    List<Monster> findAllByBiome(Biome biome);
}
