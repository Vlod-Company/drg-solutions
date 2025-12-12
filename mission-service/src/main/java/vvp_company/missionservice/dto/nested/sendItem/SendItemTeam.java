package vvp_company.missionservice.dto.nested.sendItem;

import vvp_company.missionservice.enm.SendItemType;

public record SendItemTeam(
        SendItemType itemType,
        Long teamId
) implements SendItemDTO{
    @Override
    public String getTypeName() {
        return itemType.name();
    }
}
