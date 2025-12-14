package vvp_company.logisticsservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "cargos")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "weight", nullable = false)
    private Integer weight;

    @Column(name = "ship_to_date", nullable = false)
    private LocalDate shipToDate;

    @Column(name = "ship_to_point", nullable = false)
    private Long shipToPoint;
}