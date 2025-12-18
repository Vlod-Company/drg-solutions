package vvp_company.authservice.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtPrincipal {
    private Long id;
    private String username;
    private String post;
    private String department;
}
