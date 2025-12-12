package vvp_company.missionservice.model;

import jakarta.persistence.*;
import lombok.Data;
import vvp_company.missionservice.enm.MissionStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "missions")
@Data
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "biome_id", nullable = false)
    private Long biomeId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "teamId")
    private Long teamId;

    @Column(name = "required_experience", nullable = false)
    private Integer requiredExperience = 0;

    @Column(nullable = false)
    private MissionStatus status = MissionStatus.CREATED;

    @Column(name = "mission_start", nullable = false)
    private LocalDateTime missionStart;

    @Column(name = "mission_end", nullable = false)
    private LocalDateTime missionEnd;
}