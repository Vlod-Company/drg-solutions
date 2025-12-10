package vvp_company.teamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.missionservice.enm.TeamStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto {

    private Long id;

    private String name;

    private Long cargoId;

    private Long locatedAtId;

    private TeamStatus status = TeamStatus.CREATED;
}
