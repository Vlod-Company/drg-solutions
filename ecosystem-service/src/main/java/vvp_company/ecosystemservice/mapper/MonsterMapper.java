package vvp_company.ecosystemservice.mapper;

import org.mapstruct.*;
import vvp_company.ecosystemservice.dto.CreateMonsterDto;
import vvp_company.ecosystemservice.dto.ImpactTypeShortDto;
import vvp_company.ecosystemservice.dto.MonsterDto;
import vvp_company.ecosystemservice.model.ImpactType;
import vvp_company.ecosystemservice.model.Monster;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface MonsterMapper {

    @Mapping(target = "weaknesses", expression = "java(toShortDtos(monster.getWeaknesses()))")
    @Mapping(target = "strengths", expression = "java(toShortDtos(monster.getStrengths()))")
    MonsterDto toDto(Monster monster);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "weaknesses", ignore = true)
    @Mapping(target = "strengths", ignore = true)
    Monster toEntity(CreateMonsterDto dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "weaknesses", ignore = true)
    @Mapping(target = "strengths", ignore = true)
    void updateMonsterFromDto(CreateMonsterDto dto, @MappingTarget Monster monster);

    default Set<ImpactTypeShortDto> toShortDtos(Set<ImpactType> impactTypes) {
        if (impactTypes == null) {
            return null;
        }
        return impactTypes.stream()
                .map(it -> new ImpactTypeShortDto(it.getId(), it.getName()))
                .collect(Collectors.toSet());
    }
}
