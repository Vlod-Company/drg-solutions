package vvp_company.storeservice.dto.nested.sendItem;

import vvp_company.storeservice.enm.ItemType;

public record SendItemWeapon(
        String itemName,
        String identificationNumber
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return ItemType.WEAPON.name();
    }
}
