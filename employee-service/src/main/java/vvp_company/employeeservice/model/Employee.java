package vvp_company.employeeservice.model;

import jakarta.persistence.*;
import lombok.*;
import vvp_company.employeeservice.enm.EmployeeStatus;

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

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "post", nullable = false, length = 255)
    private String post;

    @Column(name = "department", nullable = false, length = 255)
    private String department;

    @Column(name = "experience", nullable = false)
    private Integer experience;

    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Column(name = "hired_date", nullable = false)
    private LocalDate hiredDate;

    @Column(name = "fired_date")
    private LocalDate firedDate;
}
