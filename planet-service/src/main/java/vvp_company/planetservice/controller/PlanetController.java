package vvp_company.planetservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vvp_company.planetservice.dto.CreatePlanetRequest;
import vvp_company.planetservice.dto.PlanetDto;
import vvp_company.planetservice.service.PlanetService;

import java.util.List;

@RestController
@RequestMapping("/api/planets")
@RequiredArgsConstructor
public class PlanetController {

    private final PlanetService planetService;

    @GetMapping
    public List<PlanetDto> getAll() {
        return planetService.getAllPlanets();
    }

    @GetMapping("/{id}")
    public PlanetDto getById(@PathVariable Long id) {
        return planetService.getPlanetById(id);
    }

    @PostMapping
    public PlanetDto create(@RequestBody CreatePlanetRequest req) {
        return planetService.createPlanet(req);
    }

    @PutMapping("/{id}")
    public PlanetDto update(@PathVariable Long id, @RequestBody CreatePlanetRequest req) {
        return planetService.updatePlanet(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planetService.deletePlanet(id);
        return ResponseEntity.noContent().build();
    }
}
