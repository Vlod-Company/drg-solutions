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
    private ItemType itemType;

    @JsonProperty("info_name")
    private String infoName;

    @JsonProperty("total_count")
    private Long totalCount;

    public HowMuchAtTimeItem(String itemType, String infoName, Long totalCount) {
        this.itemType = ItemType.valueOf(itemType.toUpperCase());
        this.infoName = infoName;
        this.totalCount = totalCount;
    }
}
