package vvp_company.teamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TeamMembersResponse {

    List<Long> employeeId;
}
