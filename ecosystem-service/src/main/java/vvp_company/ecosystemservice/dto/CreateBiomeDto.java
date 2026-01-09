package vvp_company.ecosystemservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBiomeDto(
        @NotBlank String name,
        @NotBlank String description,
        @NotNull Integer planetId
) {}
