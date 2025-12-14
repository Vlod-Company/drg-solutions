package vvp_company.logisticsservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "team")
@Data
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cargo_id")
    private Long cargoId;
}
