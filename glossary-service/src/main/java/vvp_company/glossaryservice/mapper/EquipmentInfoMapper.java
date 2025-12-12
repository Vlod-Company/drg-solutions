package vvp_company.glossaryservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.glossaryservice.dto.EquipmentInfoDTO;
import vvp_company.glossaryservice.model.EquipmentInfo;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface EquipmentInfoMapper {

    EquipmentInfo toEntity(EquipmentInfoDTO dto);
    EquipmentInfoDTO toDto(EquipmentInfo dto);
}
