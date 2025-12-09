package vvp_company.missionservice.dto;

import lombok.Data;
import vvp_company.missionservice.enm.MissionStatus;
import vvp_company.missionservice.model.Team;

import java.time.LocalDateTime;

@Data
public class MissionDto {

    private Long id;

    private String name;

    private Long biomeId;

    private String description;

    private Team team;

    private Integer requiredExperience = 0;

    private MissionStatus status = MissionStatus.CREATED;

    private LocalDateTime missionStart;

    private LocalDateTime missionEnd;
}
