package vvp_company.ecosystemservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import vvp_company.ecosystemservice.client.dto.PlanetDTO;

import java.util.List;

@FeignClient(
        name = "planet-service",
        path = "planet-service/planet"
)
public interface PlanetServiceClient {

    @GetMapping("{id}")
    PlanetDTO getPlanetById(@PathVariable("id") Integer id);

    @GetMapping
    List<PlanetDTO> getPlanets();
}
