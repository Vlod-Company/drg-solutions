package vvp_company.employeeservice.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.*;
import vvp_company.employeeservice.enm.EmployeeStatus;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    private String name;

    @NotBlank(message = "Post is required")
    @Size(min = 2, max = 255, message = "Post must be between 2 and 255 characters")
    private String post;

    @NotBlank(message = "Department is required")
    @Size(min = 2, max = 255, message = "Department must be between 2 and 255 characters")
    private String department;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;

    @PastOrPresent(message = "Hired date cannot be in the future")
    private LocalDate hiredDate;

    @PastOrPresent(message = "Fired date can be only in the future")
    private LocalDate firedDate;
}
