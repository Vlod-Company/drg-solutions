package vvp_company.logisticsservice.dto.sendItem;

import vvp_company.logisticsservice.enm.SendItemType;

public record SendItemEquipment(
        String itemName,
        int quantity
) implements SendItemDTO {
    @Override
    public String getItemType() {
        return SendItemType.EQUIPMENT.name();
    }
}
