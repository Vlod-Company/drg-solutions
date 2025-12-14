package vvp_company.logisticsservice.dto.sendItem;

import vvp_company.logisticsservice.enm.SendItemType;

public record SendItemEquipment(
        String itemName,
        String identificationNumber
) implements SendItemDTO {
    @Override
    public String getTypeName() {
        return SendItemType.EQUIPMENT.name();
    }
}
