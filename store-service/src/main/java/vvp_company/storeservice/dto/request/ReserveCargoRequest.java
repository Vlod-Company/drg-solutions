package vvp_company.storeservice.dto.request;

import lombok.Data;
import vvp_company.storeservice.dto.nested.sendItem.SendItemDTO;

import java.util.List;

@Data
public class ReserveCargoRequest {

    private Long cargoId;
    private Long locatedAt;
    private List<SendItemDTO> data;
}
