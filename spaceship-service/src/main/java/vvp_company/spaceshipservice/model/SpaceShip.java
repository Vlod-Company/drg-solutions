package vvp_company.spaceshipservice.model;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "space_ship")
public class SpaceShip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "lifting_capacity", nullable = false)
    private Integer liftingCapacity;
}