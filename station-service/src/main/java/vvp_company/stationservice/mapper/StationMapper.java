package vvp_company.stationservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.stationservice.dto.CreateStationDTO;
import vvp_company.stationservice.model.Station;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR, unmappedTargetPolicy = IGNORE)
public interface StationMapper {

    Station toEntityFromCreateRequest(CreateStationDTO createStationDTO);
}
