package vvp_company.glossaryservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "impact_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImpactType {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String name;
}
