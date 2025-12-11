package vvp_company.storeservice.dto.nested.sendItem;

import vvp_company.storeservice.enm.ItemType;

public record SendItemResource(
        ItemType itemType,
        String itemName,
        Integer quantity
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return itemType.name();
    }
}
