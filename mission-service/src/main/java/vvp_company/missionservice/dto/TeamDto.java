package vvp_company.missionservice.dto;

import lombok.Builder;
import lombok.Data;
import vvp_company.missionservice.enm.TeamStatus;

@Data
@Builder
public class TeamDto {

    private Long id;

    private String name;

    private Long cargoId;

    private Long locatedAtId;

    private TeamStatus status = TeamStatus.CREATED;
}
