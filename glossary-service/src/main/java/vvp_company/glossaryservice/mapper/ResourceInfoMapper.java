package vvp_company.glossaryservice.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vvp_company.glossaryservice.dto.ResourceInfoDTO;
import vvp_company.glossaryservice.model.ResourceInfo;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface ResourceInfoMapper {

    @Mapping(target = "id", ignore = true)
    ResourceInfo toEntity(ResourceInfoDTO dto);
    ResourceInfoDTO toDTO(ResourceInfo dto);
}
