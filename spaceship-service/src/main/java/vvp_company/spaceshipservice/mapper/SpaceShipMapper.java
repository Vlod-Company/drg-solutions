package vvp_company.spaceshipservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.spaceshipservice.dto.CreateSpaceShipDTO;
import vvp_company.spaceshipservice.model.SpaceShip;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR, unmappedTargetPolicy = IGNORE)
public interface SpaceShipMapper {

    SpaceShip fromCreateSpaceShipRequest(CreateSpaceShipDTO dto);
}
