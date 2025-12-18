package vvp_company.ecosystemservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import vvp_company.ecosystemservice.dto.BiomeDto;
import vvp_company.ecosystemservice.dto.CreateBiomeDto;
import vvp_company.ecosystemservice.service.BiomeService;

import java.util.List;

@RestController
@RequestMapping("biome")
@RequiredArgsConstructor
public class BiomeController {

    private final BiomeService biomeService;

    @PostMapping
    public ResponseEntity<BiomeDto> create(@Valid @RequestBody CreateBiomeDto dto) {
        BiomeDto created = biomeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("{id}")
    public BiomeDto get(@PathVariable Integer id) {
        return biomeService.getById(id);
    }

    @GetMapping
    public List<BiomeDto> getAll() {
        return biomeService.getAll();
    }

    @PutMapping("{id}")
    public BiomeDto update(@PathVariable Integer id, @Valid @RequestBody CreateBiomeDto dto) {
        return biomeService.update(id, dto);
    }

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        biomeService.delete(id);
    }
}
