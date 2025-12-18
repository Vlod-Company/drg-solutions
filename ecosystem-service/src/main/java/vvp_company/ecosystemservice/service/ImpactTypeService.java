package vvp_company.ecosystemservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.ecosystemservice.dto.CreateImpactTypeDto;
import vvp_company.ecosystemservice.dto.ImpactTypeDto;
import vvp_company.ecosystemservice.model.ImpactType;
import vvp_company.ecosystemservice.repository.ImpactTypeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImpactTypeService {

    private final ImpactTypeRepository impactTypeRepository;

    @Transactional
    public ImpactTypeDto create(CreateImpactTypeDto dto) {
        ImpactType impactType = ImpactType.builder()
                .name(dto.name())
                .description(dto.description())
                .build();
        ImpactType saved = impactTypeRepository.save(impactType);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public ImpactTypeDto getById(Long id) {
        return impactTypeRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(); // можешь подставить свой NotFoundException
    }

    @Transactional(readOnly = true)
    public List<ImpactTypeDto> getAll() {
        return impactTypeRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ImpactTypeDto update(Long id, CreateImpactTypeDto dto) {
        ImpactType impactType = impactTypeRepository.findById(id).orElseThrow();
        impactType.setName(dto.name());
        impactType.setDescription(dto.description());
        ImpactType saved = impactTypeRepository.save(impactType);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        impactTypeRepository.deleteById(id);
    }

    private ImpactTypeDto toDto(ImpactType it) {
        return new ImpactTypeDto(
                it.getId(),
                it.getName(),
                it.getDescription()
        );
    }
}
