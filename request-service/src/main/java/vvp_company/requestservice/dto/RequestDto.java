package vvp_company.requestservice.dto;

import vvp_company.requestservice.model.Request;

public record RequestDto(
        Long id,
        String status,
        String senderDepartment,
        String recipientDepartment,
        String requestCode,
        String description,
        String response,
        Long senderEmployeeId,
        Long recipientEmployeeId
) {
    public static RequestDto fromEntity(Request request) {
        return new RequestDto(
                request.getId(),
                request.getStatus(),
                request.getSenderDepartment(),
                request.getRecipientDepartment(),
                request.getRequestCode(),
                request.getDescription(),
                request.getResponse(),
                request.getSenderEmployeeId(),
                request.getRecipientEmployeeId()
        );
    }
}
