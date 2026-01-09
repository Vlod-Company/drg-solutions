package vvp_company.ecosystemservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.ecosystemservice.dto.BiomeDto;
import vvp_company.ecosystemservice.dto.CreateBiomeDto;
import vvp_company.ecosystemservice.enm.DeliveryPointType;
import vvp_company.ecosystemservice.model.Biome;
import vvp_company.ecosystemservice.model.DeliveryPoint;
import vvp_company.ecosystemservice.repository.BiomeRepository;
import vvp_company.ecosystemservice.repository.DeliveryPointRepository;

import java.util.List;

import static vvp_company.ecosystemservice.enm.DeliveryPointType.BIOME;

@Service
@RequiredArgsConstructor
public class BiomeService {

    private final BiomeRepository biomeRepository;
    private final DeliveryPointRepository deliveryPointRepository;

    @Transactional
    public BiomeDto create(CreateBiomeDto dto) {
        var deliveryPoint = deliveryPointRepository.save(DeliveryPoint.builder().deliveryType(BIOME).build());

        Biome biome = Biome.builder()
                .name(dto.name())
                .description(dto.description())
                .planetId(dto.planetId())
                .deliveryPointId(deliveryPoint.getId())
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
        biome.setDeliveryPointId(biome.getDeliveryPointId());
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
