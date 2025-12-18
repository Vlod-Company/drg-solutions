package vvp_company.ecosystemservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vvp_company.ecosystemservice.dto.CreateMonsterDto;
import vvp_company.ecosystemservice.dto.MonsterDto;
import vvp_company.ecosystemservice.mapper.MonsterMapper;
import vvp_company.ecosystemservice.model.ImpactType;
import vvp_company.ecosystemservice.model.Monster;
import vvp_company.ecosystemservice.repository.ImpactTypeRepository;
import vvp_company.ecosystemservice.repository.MonsterRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonsterService {

    private final MonsterRepository monsterRepository;
    private final ImpactTypeRepository impactTypeRepository;
    private final MonsterMapper monsterMapper;

    @Transactional
    public MonsterDto create(CreateMonsterDto dto) {
        Monster monster = monsterMapper.toEntity(dto);

        if (dto.weaknessIds() != null && !dto.weaknessIds().isEmpty()) {
            Set<ImpactType> weaknesses = impactTypeRepository.findAllById(dto.weaknessIds())
                    .stream().collect(Collectors.toSet());
            monster.setWeaknesses(weaknesses);
        }

        if (dto.strengthIds() != null && !dto.strengthIds().isEmpty()) {
            Set<ImpactType> strengths = impactTypeRepository.findAllById(dto.strengthIds())
                    .stream().collect(Collectors.toSet());
            monster.setStrengths(strengths);
        }

        Monster saved = monsterRepository.save(monster);
        return monsterMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public MonsterDto getById(Long id) {
        return monsterRepository.findById(id)
                .map(monsterMapper::toDto)
                .orElseThrow(); // свой NotFoundException
    }

    @Transactional(readOnly = true)
    public List<MonsterDto> getAll() {
        return monsterRepository.findAll().stream()
                .map(monsterMapper::toDto)
                .toList();
    }

    @Transactional
    public MonsterDto update(Long id, CreateMonsterDto dto) {
        Monster monster = monsterRepository.findById(id).orElseThrow();

        // обновляем простые поля через mapper
        monsterMapper.updateMonsterFromDto(dto, monster);

        // заново проставляем weaknesses/strengths по id
        if (dto.weaknessIds() != null) {
            Set<ImpactType> weaknesses = impactTypeRepository
                    .findAllById(dto.weaknessIds())
                    .stream().collect(java.util.stream.Collectors.toSet());
            monster.setWeaknesses(weaknesses);
        }

        if (dto.strengthIds() != null) {
            Set<ImpactType> strengths = impactTypeRepository
                    .findAllById(dto.strengthIds())
                    .stream().collect(java.util.stream.Collectors.toSet());
            monster.setStrengths(strengths);
        }

        Monster saved = monsterRepository.save(monster);
        return monsterMapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        monsterRepository.deleteById(id);
    }
}
