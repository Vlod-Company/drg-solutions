package vvp_company.spaceshipservice.mapper;

import org.mapstruct.Mapper;
import vvp_company.spaceshipservice.dto.CreateSpaceShipDTO;
import vvp_company.spaceshipservice.model.SpaceShip;

import static org.mapstruct.InjectionStrategy.CONSTRUCTOR;
import static org.mapstruct.MappingConstants.ComponentModel.SPRING;

@Mapper(componentModel = SPRING, injectionStrategy = CONSTRUCTOR)
public interface SpaceShipMapper {

    SpaceShip fromCreateSpaceShipRequest(CreateSpaceShipDTO dto);
}
