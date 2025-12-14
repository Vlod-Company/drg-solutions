package vvp_company.logisticsservice.dto.sendItem;

import vvp_company.logisticsservice.enm.SendItemType;

public record SendItemWeapon(
        String itemName,
        String identificationNumber
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return SendItemType.WEAPON.name();
    }
}
