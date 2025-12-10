package vvp_company.glossaryservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeaponInfoDTO {

    private String name;

    private String description;

    private Double weight;

    private Long impactType;
}