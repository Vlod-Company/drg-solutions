package vvp_company.glossaryservice.model;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "resource_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "weight_per_unit", nullable = false, precision = 10, scale = 3)
    private Double weightPerUnit;
}