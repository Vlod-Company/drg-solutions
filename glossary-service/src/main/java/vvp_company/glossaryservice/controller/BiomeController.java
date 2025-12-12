package vvp_company.glossaryservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.glossaryservice.model.Biome;
import vvp_company.glossaryservice.service.BiomeService;

import java.util.List;

@RestController
@RequestMapping("biome")
@RequiredArgsConstructor
public class BiomeController {

    private final BiomeService biomeService;

    @GetMapping("all")
    public List<Biome> getAllBiomes() {
        return biomeService.findAll();
    }
}
