package vvp_company.ecosystemservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.ecosystemservice.dto.BiomeDto;
import vvp_company.ecosystemservice.dto.CreateBiomeDto;
import vvp_company.ecosystemservice.model.Biome;
import vvp_company.ecosystemservice.repository.BiomeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BiomeService {

    private final BiomeRepository biomeRepository;

    @Transactional
    public BiomeDto create(CreateBiomeDto dto) {
        Biome biome = Biome.builder()
                .name(dto.name())
                .description(dto.description())
                .planetId(dto.planetId())
                .deliveryPointId(dto.deliveryPointId())
                .build();
        Biome saved = biomeRepository.save(biome);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public BiomeDto getById(Integer id) {
        return biomeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow();
    }

    @Transactional(readOnly = true)
    public List<BiomeDto> getAll() {
        return biomeRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public BiomeDto update(Integer id, CreateBiomeDto dto) {
        Biome biome = biomeRepository.findById(id).orElseThrow();
        biome.setName(dto.name());
        biome.setDescription(dto.description());
        biome.setPlanetId(dto.planetId());
        biome.setDeliveryPointId(dto.deliveryPointId());
        Biome saved = biomeRepository.save(biome);
        return toDto(saved);
    }

    @Transactional
    public void delete(Integer id) {
        biomeRepository.deleteById(id);
    }

    private BiomeDto toDto(Biome b) {
        return new BiomeDto(
                b.getId(),
                b.getName(),
                b.getDescription(),
                b.getPlanetId(),
                b.getDeliveryPointId()
        );
    }
}
