package vvp_company.missionservice.dto.request;

import vvp_company.missionservice.enm.MissionStatus;

import java.time.LocalDateTime;
import java.util.Optional;

public record UpdateMissionRequest(
        Optional<MissionStatus> newStatus,
        Optional<LocalDateTime> newMissionEnd
) {
}
