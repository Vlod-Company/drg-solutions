package vvp_company.missionservice.dto.nested;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import vvp_company.missionservice.enm.SendItemType;

public record SendItemDTO(
    @NotNull
    SendItemType itemType,

    @NotBlank
    String itemName,

    @NotNull
    @Positive
    Integer quantity
) {
}
