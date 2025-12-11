package vvp_company.storeservice.dto.nested.sendItem;

import vvp_company.storeservice.enm.ItemType;

public record SendItemWeapon(
        ItemType itemType,
        String itemName,
        String identificationNumber
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return itemType.name();
    }
}
