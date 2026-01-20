package vvp_company.authservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserDto {
    private Long id;
    private Long employeeId;
    private String username;
    private Boolean active;
    private LocalDateTime createdAt;
    private Set<String> roles;
}
