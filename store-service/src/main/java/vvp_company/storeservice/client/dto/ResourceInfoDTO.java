package vvp_company.storeservice.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceInfoDTO {

    private String name;

    private String description;

    private Integer weightPerUnit;
}