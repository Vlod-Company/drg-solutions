package vvp_company.ecosystemservice.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateImpactTypeDto(
        @NotBlank String name,
        String description
) {}
