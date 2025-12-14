package vvp_company.stationservice.client.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.stationservice.client.enm.DeliveryPointType;

@Data
@NoArgsConstructor
public class DeliveryPointDTO {

    private Long id;

    private DeliveryPointType deliveryType;
}
