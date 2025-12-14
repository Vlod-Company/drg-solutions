package vvp_company.stationservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vvp_company.stationservice.enm.DeliveryPointType;

@Entity
@Table(name = "delivery_point")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeliveryPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_type")
    private DeliveryPointType deliveryType;
}