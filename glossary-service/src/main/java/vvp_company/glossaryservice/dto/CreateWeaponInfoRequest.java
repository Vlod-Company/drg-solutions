package vvp_company.glossaryservice.dto;

public record CreateWeaponInfoRequest(
        String name,
        String description,
        Double weight,
        Long impactTypeId
) {
}
