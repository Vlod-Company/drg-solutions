package vvp_company.storeservice.dto.nested;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.storeservice.enm.ItemType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemResponseDTO {
    private ItemType itemType;
    private String itemName;
    private Double itemWeight;
    private Long itemQuantity;
}