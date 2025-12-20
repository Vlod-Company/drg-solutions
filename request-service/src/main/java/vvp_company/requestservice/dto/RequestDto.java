package vvp_company.requestservice.dto;

import vvp_company.requestservice.enm.RequestStatus;

import java.time.LocalDateTime;

public record RequestDto(
        Long id,
        RequestStatus status,
        String senderDepartment,
        String recipientDepartment,
        String requestCode,
        String description,
        String response,
        Long senderEmployeeId,
        Long recipientEmployeeId,
        LocalDateTime createdAt,
        LocalDateTime closedAt
) {}
