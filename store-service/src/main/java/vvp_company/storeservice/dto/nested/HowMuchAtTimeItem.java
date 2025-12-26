package vvp_company.storeservice.dto.nested;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.storeservice.enm.ItemType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HowMuchAtTimeItem {

    @JsonProperty("item_type")
    private String itemType;

    @JsonProperty("info_name")
    private String infoName;

    @JsonProperty("total_count")
    private Long totalCount;
}
