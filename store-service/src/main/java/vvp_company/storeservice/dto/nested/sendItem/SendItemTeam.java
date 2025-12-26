package vvp_company.storeservice.dto.nested.sendItem;

import vvp_company.storeservice.enm.ItemType;

public record SendItemTeam(
        Long teamId
) implements SendItemDTO{
    @Override
    public String getTypeName() {
        return ItemType.TEAM.name();
    }
}
