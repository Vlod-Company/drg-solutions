package vvp_company.glossaryservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vvp_company.glossaryservice.dto.EquipmentInfoDTO;
import vvp_company.glossaryservice.model.EquipmentInfo;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface EquipmentInfoMapper {

    @Mapping(target = "id", ignore = true)
    EquipmentInfo toEntity(EquipmentInfoDTO dto);
    EquipmentInfoDTO toDto(EquipmentInfo dto);
}
