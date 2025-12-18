package vvp_company.ecosystemservice.dto;

import java.util.Set;

public record MonsterDto(
        Long id,
        String name,
        String description,
        Integer dangerLevel,
        String heritage,
        String monsterType,
        Integer biomeId,
        String armorType,
        Set<ImpactTypeShortDto> weaknesses,
        Set<ImpactTypeShortDto> strengths
) {}
