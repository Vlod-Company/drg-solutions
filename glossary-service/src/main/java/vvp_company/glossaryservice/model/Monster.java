package vvp_company.glossaryservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.glossaryservice.enm.ArmorType;
import vvp_company.glossaryservice.enm.MonsterType;

import java.util.HashSet;
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
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "danger_level")
    private Integer dangerLevel;

    @Column(name = "heritage")
    private String heritage;

    @Enumerated(EnumType.STRING)
    @Column(name = "monster_type")
    private MonsterType monsterType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "biome_id")
    private Biome biome;

    @Enumerated(EnumType.STRING)
    @Column(name = "armor_type")
    private ArmorType armorType;

    @ManyToMany
    @JoinTable(
            name = "monster_weaknesses",
            joinColumns = @JoinColumn(name = "monster_id"),
            inverseJoinColumns = @JoinColumn(name = "impact_type_id")
    )
    @Builder.Default
    private Set<ImpactType> weaknesses = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "monster_strengths",
            joinColumns = @JoinColumn(name = "monster_id"),
            inverseJoinColumns = @JoinColumn(name = "impact_type_id")
    )
    @Builder.Default
    private Set<ImpactType> strengths = new HashSet<>();
}