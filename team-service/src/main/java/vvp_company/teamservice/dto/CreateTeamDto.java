package vvp_company.teamservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CreateTeamDto {

    @NotBlank
    String teamName;
    @Size(min = 1, max = 4)
    List<Long> employeeIds;
    @Positive
    Long locatedAt;
}
