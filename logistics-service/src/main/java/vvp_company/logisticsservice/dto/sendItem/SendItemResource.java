package vvp_company.logisticsservice.dto.sendItem;

import vvp_company.logisticsservice.enm.SendItemType;

public record SendItemResource(
        String itemName,
        Integer quantity
) implements SendItemDTO{

    @Override
    public String getItemType() {
        return SendItemType.RESOURCE.name();
    }
}
