package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.ResourceStatus;
import vvp_company.storeservice.model.Resource;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findFirstByLocatedAtAndNameAndStatusOrderByDateDesc(Long locatedAt, String name, ResourceStatus status);
}
