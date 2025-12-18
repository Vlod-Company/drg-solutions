package vvp_company.requestservice.dto;

import jakarta.persistence.Column;
import vvp_company.requestservice.enm.RequestStatus;
import vvp_company.requestservice.model.Request;

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
