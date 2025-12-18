package vvp_company.ecosystemservice.dto;

public record BiomeDto(
        Integer id,
        String name,
        String description,
        Integer planetId,
        Long deliveryPointId
) {}
