package vvp_company.ecosystemservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "biomes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Biome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "planet_id", nullable = false)
    private Integer planetId;

    @Column(name = "delivery_point_id")
    private Long deliveryPointId;
}
