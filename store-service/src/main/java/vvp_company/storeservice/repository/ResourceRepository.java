package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.enm.ResourceStatus;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Resource;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findFirstByLocatedAtAndNameAndStatusOrderByDateDesc(Long locatedAt, String name, ResourceStatus status);

    Optional<Resource> findFirstByNameAndLocatedAtAndStatusOrderByDateDesc(String name, Long locatedAt, ResourceStatus status);

    @Modifying
    @Query("update Resource r set r.status = :status where r.cargoId = :cargo_id")
    void updateStatusForResourceWithCargoId(@Param("status") ResourceStatus status, @Param("cargo_id") Long cargo_id);

    List<Resource> getResourcesByCargoId(Long cargoId);
}
