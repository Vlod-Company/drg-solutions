package vvp_company.ecosystemservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "impact_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImpactType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}
