package vvp_company.missionservice.dto.nested;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.missionservice.enm.MissionStatus;
import vvp_company.missionservice.model.Team;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
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
