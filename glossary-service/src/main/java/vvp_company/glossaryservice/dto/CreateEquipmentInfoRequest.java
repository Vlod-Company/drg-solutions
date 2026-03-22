package vvp_company.glossaryservice.dto;

public record CreateEquipmentInfoRequest(
        String name,
        String description,
        Double weight
) {
}
