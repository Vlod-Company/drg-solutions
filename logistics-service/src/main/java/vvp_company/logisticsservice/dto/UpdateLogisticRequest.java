package vvp_company.logisticsservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import vvp_company.logisticsservice.enm.LogisticStatus;

import java.time.LocalDateTime;

@Data
public class UpdateLogisticRequest {

    @NotNull
    private LogisticStatus newStatus;

    private LocalDateTime newDate;
}
