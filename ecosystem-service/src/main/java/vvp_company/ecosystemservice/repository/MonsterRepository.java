package vvp_company.ecosystemservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vvp_company.ecosystemservice.model.Monster;

public interface MonsterRepository extends JpaRepository<Monster, Long> {
}
