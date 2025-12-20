package vvp_company.requestservice.dto;
import java.util.List;

public record PagedRequestDto(
        List<RequestDto> data,
        int pageNumber,
        int pageSize,
        int totalPages,
        long totalElements
) {}
