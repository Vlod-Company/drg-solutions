package vvp_company.authservice.security;

public class JwtSecurityConfigurer {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtSecurityConfigurer(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public JwtAuthenticationFilter jwtFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }
}
