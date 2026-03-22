package vvp_company.glossaryservice.dto;

import jakarta.persistence.*;
import lombok.Data;
import vvp_company.glossaryservice.enm.ArmorType;
import vvp_company.glossaryservice.enm.MonsterType;
import vvp_company.glossaryservice.model.Biome;
import vvp_company.glossaryservice.model.ImpactType;

import java.util.HashSet;
import java.util.Set;

@Data
public class MonsterDTO {

    private String name;

    private String description;

    private Integer dangerLevel;

    private String heritage;

    private MonsterType monsterType;

    private Biome biome;

    private ArmorType armorType;

    private Set<ImpactType> weaknesses = new HashSet<>();

    private Set<ImpactType> strengths = new HashSet<>();
}
