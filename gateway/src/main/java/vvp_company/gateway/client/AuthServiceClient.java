package vvp_company.gateway.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import vvp_company.gateway.client.dto.TokenInfo;
import vvp_company.gateway.client.dto.ValidatieTokenRequest;

@FeignClient(
        name = "auth-service",
        path = "/auth"
)
public interface AuthServiceClient {

    @PostMapping("validate")
    TokenInfo validate(@RequestBody ValidatieTokenRequest validatieTokenRequest);
}
