package vvp_company.planetservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "planets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Planet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
}
