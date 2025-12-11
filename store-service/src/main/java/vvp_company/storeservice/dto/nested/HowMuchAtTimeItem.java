package vvp_company.storeservice.dto.nested;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import vvp_company.storeservice.enm.ItemType;

@Data
public class HowMuchAtTimeItem {

    @JsonProperty("item_type")
    private ItemType itemType;

    @JsonProperty("info_name")
    private String infoName;

    @JsonProperty("total_count")
    private Integer totalCount;
}
