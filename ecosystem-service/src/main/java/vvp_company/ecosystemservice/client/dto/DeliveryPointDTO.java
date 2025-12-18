package vvp_company.ecosystemservice.client.dto;

import lombok.Data;
import vvp_company.ecosystemservice.enm.DeliveryPointType;

@Data
public class DeliveryPointDTO {
    private Long id;
    private DeliveryPointType deliveryType;
}