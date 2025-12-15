package vvp_company.storeservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vvp_company.storeservice.dto.nested.HowMuchAtTimeItem;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Warehouse;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    @Query(value = "select * from how_much_at_time(:id, :cur_time)", nativeQuery = true)
    List<HowMuchAtTimeItem> howMuchAtTimeInDeliveryPoint(@Param("id") Long id, @Param("cur_time") LocalDateTime time);
}
