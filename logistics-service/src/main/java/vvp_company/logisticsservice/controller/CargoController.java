package vvp_company.logisticsservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.logisticsservice.model.Cargo;
import vvp_company.logisticsservice.service.CargoService;

@RestController
@RequestMapping("cargo")
@RequiredArgsConstructor
public class CargoController {

    private final CargoService cargoService;

    @GetMapping("{id}")
    public Cargo findById(@PathVariable Long id) {
        return cargoService.getCargoById(id);
    }
}
