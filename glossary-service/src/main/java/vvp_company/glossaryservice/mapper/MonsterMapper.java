package vvp_company.glossaryservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vvp_company.glossaryservice.dto.MonsterDTO;
import vvp_company.glossaryservice.model.Monster;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface MonsterMapper {

    @Mapping(target = "id", ignore = true)
    Monster toEntity(MonsterDTO dto);
    MonsterDTO toDTO(Monster monster);
}
