package vvp_company.stationservice.model;

import lombok.Data;
import jakarta.persistence.*;
import vvp_company.stationservice.enm.StationStatus;
import vvp_company.stationservice.enm.StationType;

@Data
@Entity
@Table(name = "stations")
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "planet_id", nullable = false)
    private Long planetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private StationType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StationStatus status = StationStatus.DESIGNED;

    @Column(name = "delivery_point_id")
    private Long deliveryPointId;
}