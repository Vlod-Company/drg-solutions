package vvp_company.authservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class TokenInfo {
    private Long user_id;
    private Long employee_id;
    private String username;
    private String post;
    private String department;
    private Set<String> roles;
}
