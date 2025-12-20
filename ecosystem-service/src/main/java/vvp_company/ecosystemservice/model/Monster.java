package vvp_company.ecosystemservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "monsters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Monster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "danger_level", nullable = false)
    private Integer dangerLevel;

    @Column(nullable = false)
    private String heritage;

    @Column(name = "monster_type", nullable = false)
    private String monsterType;

    @Column(name = "biome_id", nullable = false)
    private Integer biomeId; // связь по id, сам biome в другом объекте

    @Column(name = "armor_type", nullable = false)
    private String armorType;

    @ManyToMany
    @JoinTable(
            name = "monster_weaknesses",
            joinColumns = @JoinColumn(name = "monster_id"),
            inverseJoinColumns = @JoinColumn(name = "impact_type_id")
    )
    private Set<ImpactType> weaknesses;

    @ManyToMany
    @JoinTable(
            name = "monster_strengths",
            joinColumns = @JoinColumn(name = "monster_id"),
            inverseJoinColumns = @JoinColumn(name = "impact_type_id")
    )
    private Set<ImpactType> strengths;
}
