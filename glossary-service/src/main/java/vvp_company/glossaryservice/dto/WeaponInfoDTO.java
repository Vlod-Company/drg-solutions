package vvp_company.glossaryservice.dto;

import lombok.*;
import vvp_company.glossaryservice.model.ImpactType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeaponInfoDTO {

    private String name;

    private String description;

    private Double weight;

    private ImpactType impactType;
}