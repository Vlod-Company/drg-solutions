package vvp_company.employeeservice.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDto {

    private Long id;
    private String name;
    private String post;
    private String department;
    private Integer experience;
    private String status;
    private LocalDate hiredDate;
    private LocalDate firedDate;
}
