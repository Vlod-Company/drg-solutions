package vvp_company.missionservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMissionRequest {

    @NotNull
    @Size(min=3, max=100)
    private String name;

    @NotNull
    private Long biomeId;

    private String description;

    @NotNull
    private Long teamId;

    @Min(value=0)
    private Integer requiredExperience = 0;

    @NotNull
    private LocalDateTime missionStart;
}
