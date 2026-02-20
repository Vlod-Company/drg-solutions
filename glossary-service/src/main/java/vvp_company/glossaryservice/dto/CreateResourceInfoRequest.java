package vvp_company.glossaryservice.dto;

public record CreateResourceInfoRequest(
        String name,
        String description,
        Double weightPerUnit
) {
}
