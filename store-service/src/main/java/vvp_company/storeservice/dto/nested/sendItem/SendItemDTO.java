package vvp_company.storeservice.dto.nested.sendItem;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "itemType"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = SendItemEquipment.class, name = "EQUIPMENT"),
        @JsonSubTypes.Type(value = SendItemWeapon.class, name = "WEAPON"),
        @JsonSubTypes.Type(value = SendItemResource.class, name = "RESOURCE"),
        @JsonSubTypes.Type(value = SendItemTeam.class, name = "TEAM"),
})
public interface SendItemDTO {

    String getTypeName();
}
