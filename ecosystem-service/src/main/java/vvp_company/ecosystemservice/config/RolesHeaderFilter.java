package vvp_company.ecosystemservice.config;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RolesHeaderFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String rolesHeader = request.getHeader("Roles");
        String employeeIdHeader = request.getHeader("Employee-Id");
        String departmentHeader = request.getHeader("Department");

        if (rolesHeader != null && employeeIdHeader != null) {
            CustomPrincipal principal = new CustomPrincipal(employeeIdHeader, departmentHeader);

            List<SimpleGrantedAuthority> authorities = Arrays.stream(rolesHeader.split(","))
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    principal, null, authorities
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
