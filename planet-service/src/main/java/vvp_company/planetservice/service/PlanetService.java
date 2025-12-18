package vvp_company.planetservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.planetservice.dto.CreatePlanetRequest;
import vvp_company.planetservice.dto.PlanetDto;
import vvp_company.planetservice.exception.PlanetNotFoundException;
import vvp_company.planetservice.model.Planet;
import vvp_company.planetservice.repository.PlanetRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PlanetService {

    private final PlanetRepository planetRepo;

    public List<PlanetDto> getAllPlanets() {
        return planetRepo.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public PlanetDto getPlanetById(Long id) {
        Planet planet = planetRepo.findById(id)
                .orElseThrow(() -> new PlanetNotFoundException(id));
        return toDto(planet);
    }

    @Transactional
    public PlanetDto createPlanet(CreatePlanetRequest req) {
        if (planetRepo.existsByName(req.getName())) {
            throw new IllegalArgumentException("Planet exists: " + req.getName());
        }

        Planet planet = Planet.builder()
                .name(req.getName())
                .build();

        planet = planetRepo.save(planet);
        return toDto(planet);
    }

    @Transactional
    public PlanetDto updatePlanet(Long id, CreatePlanetRequest req) {
        Planet planet = planetRepo.findById(id)
                .orElseThrow(() -> new PlanetNotFoundException(id));

        if (!planet.getName().equals(req.getName()) && planetRepo.existsByName(req.getName())) {
            throw new IllegalArgumentException("Planet exists: " + req.getName());
        }

        planet.setName(req.getName());
        planet = planetRepo.save(planet);
        return toDto(planet);
    }

    @Transactional
    public void deletePlanet(Long id) {
        if (!planetRepo.existsById(id)) {
            throw new PlanetNotFoundException(id);
        }
        planetRepo.deleteById(id);
    }

    private PlanetDto toDto(Planet planet) {
        return new PlanetDto(planet.getId(), planet.getName());
    }
}
