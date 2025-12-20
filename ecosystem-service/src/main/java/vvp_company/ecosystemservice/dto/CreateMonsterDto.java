package vvp_company.ecosystemservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record CreateMonsterDto(
        @NotBlank String name,
        String description,
        @NotNull Integer dangerLevel,
        @NotBlank String heritage,
        @NotBlank String monsterType,
        @NotNull Integer biomeId,
        @NotBlank String armorType,
        Set<Long> weaknessIds,
        Set<Long> strengthIds
) {}
