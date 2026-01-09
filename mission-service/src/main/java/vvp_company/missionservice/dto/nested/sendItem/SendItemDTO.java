package vvp_company.missionservice.dto.nested.sendItem;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "itemType"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = SendItemEquipment.class, name = "EQUIPMENT"),
        @JsonSubTypes.Type(value = SendItemWeapon.class, name = "WEAPON")
})
public interface SendItemDTO {

    String getTypeName();
}
