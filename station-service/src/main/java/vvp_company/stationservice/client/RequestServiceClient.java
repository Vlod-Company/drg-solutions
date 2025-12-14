package vvp_company.stationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import vvp_company.stationservice.client.dto.CreateRequestDTO;
import vvp_company.stationservice.client.dto.RequestDTO;

@FeignClient(
        name = "request-service",
        path = "request"
)
public interface RequestServiceClient {

    @PostMapping
    RequestDTO createRequest(@RequestBody CreateRequestDTO dto);
}
