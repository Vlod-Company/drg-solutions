package vvp_company.missionservice.dto.nested.sendItem;

import vvp_company.missionservice.enm.SendItemType;

public record SendItemWeapon(
        String itemName,
        Integer quantity
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return SendItemType.WEAPON.name();
    }
}
