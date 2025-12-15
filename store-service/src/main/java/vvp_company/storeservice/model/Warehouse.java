package vvp_company.storeservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Warehouse{

    @Id
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
}