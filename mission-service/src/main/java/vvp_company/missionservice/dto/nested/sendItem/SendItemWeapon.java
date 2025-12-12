package vvp_company.missionservice.dto.nested.sendItem;

import vvp_company.missionservice.enm.SendItemType;

public record SendItemWeapon(
        SendItemType itemType,
        String itemName,
        Integer quantity
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return itemType.name();
    }
}
