package vvp_company.logisticsservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import vvp_company.logisticsservice.client.dto.CreateRequestDTO;
import vvp_company.logisticsservice.client.dto.RequestDTO;

@FeignClient(
        name = "request-service",
        path = "request-service"
)
public interface RequestServiceClient {

    @PostMapping("request")
    RequestDTO createRequest(@RequestBody CreateRequestDTO dto);
}