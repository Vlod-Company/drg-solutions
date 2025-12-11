package vvp_company.storeservice.dto.nested.sendItem;

import vvp_company.storeservice.enm.SendItemType;

public record SendItemResource(
        SendItemType itemType,
        String itemName,
        Integer quantity
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return itemType.name();
    }
}
