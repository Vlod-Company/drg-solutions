package vvp_company.missionservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import vvp_company.missionservice.client.dto.CreateRequestDTO;
import vvp_company.missionservice.client.dto.RequestDTO;

@FeignClient(
        name = "request-service"
)
public interface RequestServiceClient {

    @PostMapping
    RequestDTO createRequest(@RequestBody CreateRequestDTO dto);
}