package vvp_company.storeservice.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(
        url = "${services.glossary.base-url}",
        name = "glossary-service"
)
public class GlossaryServiceClient {
    
}
