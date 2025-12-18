package vvp_company.authservice.dto;

public record LoginRequest(
        String name,
        String password
) {}
