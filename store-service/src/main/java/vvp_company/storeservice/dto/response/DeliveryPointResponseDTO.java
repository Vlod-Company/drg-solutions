package vvp_company.storeservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.storeservice.dto.nested.ItemResponseDTO;
import vvp_company.storeservice.enm.DeliveryPointType;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryPointResponseDTO {
    private DeliveryPointType deliveryPointType;
    private Long deliveryPointId;
    private List<ItemResponseDTO> data;
}