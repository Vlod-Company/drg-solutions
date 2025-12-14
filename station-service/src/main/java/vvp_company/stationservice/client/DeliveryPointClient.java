package vvp_company.stationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import vvp_company.stationservice.client.dto.DeliveryPointDTO;
import vvp_company.stationservice.client.enm.DeliveryPointType;

@FeignClient(name = "deliver-point-service", path = "deliveryPoint")
public interface DeliveryPointClient {

    @PostMapping
    DeliveryPointDTO createDeliveryPoint(DeliveryPointType deliveryType);

    @DeleteMapping("{id}")
    void deleteDeliveryPoint(@PathVariable("id") Long id);
}
