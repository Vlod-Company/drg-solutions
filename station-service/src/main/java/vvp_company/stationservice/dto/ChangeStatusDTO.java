package vvp_company.stationservice.dto;

import jakarta.validation.constraints.NotNull;
import vvp_company.stationservice.enm.StationStatus;

public record ChangeStatusDTO(
        @NotNull StationStatus status
) {}
