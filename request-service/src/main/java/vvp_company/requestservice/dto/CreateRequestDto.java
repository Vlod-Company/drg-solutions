package vvp_company.requestservice.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateRequestDto(
        @NotBlank(message = "recipientDepartment обязателен")
        String recipientDepartment,

        @NotBlank(message = "requestCode обязателен")
        String requestCode,

        String description
) {}