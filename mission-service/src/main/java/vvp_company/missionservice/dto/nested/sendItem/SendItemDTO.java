package vvp_company.missionservice.dto.nested.sendItem;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "typeName"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = SendItemEquipment.class, name = "EQUIPMENT"),
        @JsonSubTypes.Type(value = SendItemWeapon.class, name = "WEAPON"),
        @JsonSubTypes.Type(value = SendItemTeam.class, name = "TEAM")
})
public interface SendItemDTO {

    String getTypeName();
}
