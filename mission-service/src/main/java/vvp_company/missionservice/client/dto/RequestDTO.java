package vvp_company.missionservice.client.dto;

public record RequestDTO(
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
}
