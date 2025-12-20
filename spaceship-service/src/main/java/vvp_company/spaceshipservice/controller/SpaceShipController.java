package vvp_company.spaceshipservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_ROLE_MANAGEMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @DeleteMapping
    public void deleteSpaceShipById(Long id) {
        spaceShipService.deleteSpaceShipById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') "+
            "or hasRole('ROLE_ROLE_MANAGEMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @PostMapping
    public SpaceShip createSpaceShip(@RequestBody CreateSpaceShipDTO dto) {
        return spaceShipService.createSpaceShip(dto);
    }
}
