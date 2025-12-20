package vvp_company.planetservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_SCANCOM_EMPLOYEE') "+
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @PostMapping
    public PlanetDto create(@RequestBody CreatePlanetRequest req) {
        return planetService.createPlanet(req);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_SCANCOM_EMPLOYEE') "+
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @PutMapping("/{id}")
    public PlanetDto update(@PathVariable Long id, @RequestBody CreatePlanetRequest req) {
        return planetService.updatePlanet(id, req);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_SCANCOM_EMPLOYEE') "+
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planetService.deletePlanet(id);
        return ResponseEntity.noContent().build();
    }
}
