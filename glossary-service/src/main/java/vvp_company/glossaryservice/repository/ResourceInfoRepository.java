package vvp_company.glossaryservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.glossaryservice.model.ResourceInfo;

import java.util.Optional;

@Repository
public interface ResourceInfoRepository extends JpaRepository<ResourceInfo, Long> {

    Optional<ResourceInfo> findByName(String name);
}
