package vvp_company.logisticsservice.dto.sendItem;

import vvp_company.logisticsservice.enm.SendItemType;

public record SendItemTeam(
        Long teamId
) implements SendItemDTO{
    @Override
    public String getTypeName() {
        return SendItemType.TEAM.name();
    }
}
