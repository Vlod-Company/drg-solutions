package vvp_company.storeservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import vvp_company.storeservice.enm.ResourceStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "located_at")
    private Long locatedAt;

    @Column(name = "cargo_id")
    private Long cargoId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ResourceStatus status;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @PrePersist
    protected void onCreate() {
        if (date == null) {
            date = LocalDateTime.now();
        }
        if (status == null) {
            status = ResourceStatus.STORED;
        }
        if (quantity == null) {
            quantity = 1;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
    }
}