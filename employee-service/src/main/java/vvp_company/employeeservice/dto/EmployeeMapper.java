package vvp_company.employeeservice.dto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vvp_company.employeeservice.model.Employee;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    EmployeeResponseDto toResponseDto(Employee employee);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "firedDate", ignore = true)
    Employee toEntity(EmployeeRequestDto dto);
}

