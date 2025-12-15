package vvp_company.spaceshipservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.spaceshipservice.dto.CreateSpaceShipDTO;
import vvp_company.spaceshipservice.model.SpaceShip;
import vvp_company.spaceshipservice.service.SpaceShipService;

import java.util.List;

@RestController
@RequestMapping("spaceship")
@RequiredArgsConstructor
public class SpaceShipController {

    private final SpaceShipService spaceShipService;

    @GetMapping
    public List<SpaceShip> getAllSpaceShips() {
        return spaceShipService.getAllSpaceShips();
    }

    @GetMapping("{id}")
    public SpaceShip getSpaceShipById(@PathVariable Long id) {
        return spaceShipService.getSpaceShipById(id);
    }

    @DeleteMapping
    public void deleteSpaceShipById(Long id) {
        spaceShipService.deleteSpaceShipById(id);
    }

    @PostMapping
    public SpaceShip createSpaceShip(@RequestBody CreateSpaceShipDTO dto) {
        return spaceShipService.createSpaceShip(dto);
    }
}
