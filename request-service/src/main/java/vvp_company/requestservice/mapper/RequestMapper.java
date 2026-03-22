package vvp_company.requestservice.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import vvp_company.requestservice.dto.RequestDto;
import vvp_company.requestservice.dto.CreateRequestDto;
import vvp_company.requestservice.model.Employee;
import vvp_company.requestservice.model.Request;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR, unmappedTargetPolicy = IGNORE)
public interface RequestMapper {
    @Mapping(target = "status", constant = "CREATED")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    Request toEntityFromCreateRequest(CreateRequestDto createRequestDto, @Context Employee employee);


    RequestDto toDTOFromEntity(Request request);

}

