package vvp_company.missionservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import vvp_company.missionservice.enm.MissionStatus;
import vvp_company.missionservice.model.Team;

@Data
public class CreateMissionRequest {

    @NotNull
    @Size(min=3, max=100)
    private String name;

    @NotNull
    private Long biomeId;

    private String description;

    @NotNull
    private Team team;

    @Min(value=0)
    private Integer requiredExperience = 0;

    private MissionStatus status = MissionStatus.CREATED;
}
