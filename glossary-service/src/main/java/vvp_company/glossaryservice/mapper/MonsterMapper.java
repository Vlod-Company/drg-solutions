package vvp_company.glossaryservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.glossaryservice.dto.MonsterDTO;
import vvp_company.glossaryservice.model.Monster;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface MonsterMapper {

    Monster toEntity(MonsterDTO dto);
    MonsterDTO toDTO(Monster monster);
}
