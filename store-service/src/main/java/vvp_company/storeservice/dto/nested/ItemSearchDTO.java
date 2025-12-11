package vvp_company.storeservice.dto.nested;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.storeservice.enm.SendItemType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemSearchDTO {
    private String itemName;
    private SendItemType itemType;
}