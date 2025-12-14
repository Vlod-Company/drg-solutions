package vvp_company.logisticsservice.client.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateRequestDTO {

    String recipientDepartment;

    String requestCode;

    String description;
}
