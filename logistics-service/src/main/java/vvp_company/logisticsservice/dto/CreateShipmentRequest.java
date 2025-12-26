package vvp_company.logisticsservice.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vvp_company.logisticsservice.dto.sendItem.SendItemDTO;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateShipmentRequest {

    @NotNull
    private Long spaceShipId;

    @NotNull
    private LocalDate shipToDate;

    @NotNull
    private Long shipToPoint;

    private List<SendItemDTO> data;
}
