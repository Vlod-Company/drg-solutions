package vvp_company.logisticsservice.dto.sendItem;

import vvp_company.logisticsservice.enm.SendItemType;

public record SendItemWeapon(
        String itemName,
        int quantity
) implements SendItemDTO {
    @Override
    public String getItemType() {
        return SendItemType.WEAPON.name();
    }
}
