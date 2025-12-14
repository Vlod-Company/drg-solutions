package vvp_company.stationservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.stationservice.enm.StationType;

@Data
@NoArgsConstructor
public class CreateStationDTO {

    private String name;

    private Long planetId;

    private StationType type;
}
