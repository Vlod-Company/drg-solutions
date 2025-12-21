package vvp_company.requestservice.dto;

import vvp_company.requestservice.enm.RequestStatus;

import java.time.LocalDateTime;

public record UpdateRequestDTO(
        RequestStatus status,
        String response,
        Long recipientEmployeeId,
        LocalDateTime closedAt
) {
}
