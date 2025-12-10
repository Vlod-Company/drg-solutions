package vvp_company.missionservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class PagedResponse<T> {

    List<T> data;
    int total;
    int pageNumber;
    int pageSize;
}
