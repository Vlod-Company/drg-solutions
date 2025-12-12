package vvp_company.glossaryservice.model;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "weapon_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeaponInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "weight", nullable = false)
    private Double weight;

    @ManyToOne
    @JoinColumn(name = "impact_type")
    private ImpactType impactType;
}