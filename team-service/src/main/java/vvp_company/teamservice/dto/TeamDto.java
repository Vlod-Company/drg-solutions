package vvp_company.teamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.teamservice.enm.TeamStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamDto {

    private Long id;

    private String name;

    private Long cargoId;

    private Long locatedAtId;

    @Builder.Default
    private TeamStatus status = TeamStatus.CREATED;
}
