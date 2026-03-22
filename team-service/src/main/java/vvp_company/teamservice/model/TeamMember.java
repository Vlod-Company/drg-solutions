package vvp_company.teamservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "team_members")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamMember {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "employee_id")
    private Long employeeId;
}
