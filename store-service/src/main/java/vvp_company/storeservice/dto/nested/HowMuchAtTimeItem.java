package vvp_company.storeservice.dto.nested;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.storeservice.enm.ItemType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HowMuchAtTimeItem {

    @JsonProperty("item_type")
    private ItemType itemType;

    @JsonProperty("info_name")
    private String infoName;

    @JsonProperty("total_count")
    private Integer totalCount;
}
