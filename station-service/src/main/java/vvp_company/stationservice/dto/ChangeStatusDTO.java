package vvp_company.stationservice.dto;

import vvp_company.stationservice.enm.StationStatus;

public record ChangeStatusDTO(
        Long id,
        StationStatus status
) {}
