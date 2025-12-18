package vvp_company.authservice.dto;

public record RegistrationRequest(
        String name,
        String password,
        Long employee_id
) {}
