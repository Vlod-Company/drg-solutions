package vvp_company.storeservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import vvp_company.storeservice.client.dto.DeliveryPointDTO;

import java.util.List;

@FeignClient(
        name = "delivery-point-service",
        path = "delivery-point-service/deliveryPoint"
)
public interface DeliveryPointClient {

    @GetMapping("{id}")
    DeliveryPointDTO getDeliveryPointById(@PathVariable("id") Long id);

    @GetMapping
    List<DeliveryPointDTO> getDeliveryPoints();
}
