package vvp_company.storeservice.client.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeaponInfoDTO {

    private String name;

    private String description;

    private Integer weight;

    private ImpactType impactType;
}