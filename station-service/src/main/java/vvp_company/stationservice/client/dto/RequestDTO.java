package vvp_company.stationservice.client.dto;

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
