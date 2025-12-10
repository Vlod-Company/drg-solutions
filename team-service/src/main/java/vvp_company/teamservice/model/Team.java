package vvp_company.teamservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.teamservice.enm.TeamStatus;

@Entity
@Data
@Table("teams")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "cargo_id")
    private Long cargoId;

    @Column(name = "located_at")
    private Long locatedAtId;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TeamStatus status = TeamStatus.CREATED;
}