package vvp_company.teamservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import vvp_company.teamservice.enm.TeamStatus;

@Data
public class UpdateTeamDto {

    TeamStatus teamStatus;

    @Positive
    Long cargoId;
}
