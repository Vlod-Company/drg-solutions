package vvp_company.storeservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import vvp_company.storeservice.client.dto.DeliveryPointDTO;

@FeignClient(
        name = "delivery-point-service",
        url = "${services.delivery-point.base-url}"
)
public interface DeliveryPointClient {

    @GetMapping("{id}")
    DeliveryPointDTO getDeliveryPointById(@PathVariable("id") Long id);
}
