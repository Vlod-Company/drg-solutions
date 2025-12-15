package vvp_company.stationservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.stationservice.dto.CreateStationDTO;
import vvp_company.stationservice.model.Station;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface StationMapper {

    Station toEntityFromCreateRequest(CreateStationDTO createStationDTO);
}
