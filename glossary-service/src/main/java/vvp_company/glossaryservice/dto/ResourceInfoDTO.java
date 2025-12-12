package vvp_company.glossaryservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceInfoDTO {

    private String name;

    private String description;

    private Double weightPerUnit;
}