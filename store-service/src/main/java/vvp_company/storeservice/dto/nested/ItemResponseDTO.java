package vvp_company.storeservice.dto.nested;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.storeservice.enm.SendItemType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDTO {
    private SendItemType itemType;
    private String itemName;
    private Integer itemWeight;
    private Integer itemQuantity;
}