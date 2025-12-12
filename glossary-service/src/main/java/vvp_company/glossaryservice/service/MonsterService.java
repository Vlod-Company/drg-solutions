package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.glossaryservice.dto.MonsterDTO;
import vvp_company.glossaryservice.mapper.MonsterMapper;
import vvp_company.glossaryservice.model.Monster;
import vvp_company.glossaryservice.repository.MonsterRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonsterService {

    private final MonsterRepository repository;
    private final BiomeService biomeService;
    private final MonsterMapper mapper;

    public List<MonsterDTO> findAll() {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public List<MonsterDTO> findAllByBiome(Long biomeId) {
        var biome = biomeService.findBiomeById(biomeId);
        return repository.findAllByBiome(biome).stream().map(mapper::toDTO).collect(Collectors.toList());
    }
}
