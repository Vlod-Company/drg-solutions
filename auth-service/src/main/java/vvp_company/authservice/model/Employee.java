package vvp_company.authservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String post;

    private String department;

    private Integer experience;

    private String status;

    private LocalDate hiredDate;

    private LocalDate firedDate;
}
