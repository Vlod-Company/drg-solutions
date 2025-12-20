package vvp_company.requestservice.dto;

public record RequestFilter(
        String code,
        String senderDepartment,
        String recipientDepartment,
        String status
) {}
