package vvp_company.missionservice.dto.nested.sendItem;

import vvp_company.missionservice.enm.SendItemType;

public record SendItemTeam(
        Long teamId
) implements SendItemDTO{
    @Override
    public String getTypeName() {
        return SendItemType.TEAM.name();
    }
}
