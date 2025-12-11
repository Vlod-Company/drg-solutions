package vvp_company.storeservice.client.dto;

import lombok.Data;
import vvp_company.storeservice.enm.DeliveryPointType;

@Data
public class DeliveryPointDTO {

    Long id;
    DeliveryPointType deliveryType;
}
