package vvp_company.logisticsservice.model;

import jakarta.persistence.*;
import lombok.*;
import vvp_company.logisticsservice.enm.LogisticStatus;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "logistics")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Logistic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "send_time")
    private LocalDateTime sendTime;

    @Column(name = "cargo_id", nullable = false)
    private Long cargoId;

    @Column(name = "space_ship_id")
    private Long spaceShipId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LogisticStatus status;
}