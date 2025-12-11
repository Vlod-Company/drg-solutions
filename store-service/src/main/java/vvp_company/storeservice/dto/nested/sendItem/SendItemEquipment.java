package vvp_company.storeservice.dto.nested.sendItem;

import vvp_company.storeservice.enm.SendItemType;

public record SendItemEquipment(
        SendItemType itemType,
        String itemName,
        String identificationNumber
) implements SendItemDTO{
    @Override
    public String getTypeName() {
        return itemType.name();
    }
}
