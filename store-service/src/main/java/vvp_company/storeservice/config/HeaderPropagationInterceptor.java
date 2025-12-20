package vvp_company.storeservice.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class HeaderPropagationInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomPrincipal principal) {
            template.header("Employee-Id", principal.employeeId.toString());
            template.header("Department", principal.department);
        }

        // Передаём роли
        if (auth != null) {
            String roles = auth.getAuthorities().stream()
                    .map(Object::toString)
                    .collect(Collectors.joining(","));
            template.header("Roles", roles);
        }
    }
}
