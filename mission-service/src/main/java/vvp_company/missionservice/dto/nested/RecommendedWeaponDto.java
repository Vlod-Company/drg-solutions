package vvp_company.missionservice.dto.nested;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecommendedWeaponDto {

    private Long weaponId;
    private String weaponName;
    private String impactTypeName;
}
