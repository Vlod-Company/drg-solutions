package vvp_company.glossaryservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.glossaryservice.dto.WeaponInfoDTO;
import vvp_company.glossaryservice.model.WeaponInfo;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface WeaponInfoMapper {

    WeaponInfo toEntity(WeaponInfoDTO dto);
    WeaponInfoDTO toDto(WeaponInfo entity);
}
