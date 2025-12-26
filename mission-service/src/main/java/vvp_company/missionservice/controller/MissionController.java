package vvp_company.missionservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.missionservice.client.dto.RequestDTO;
import vvp_company.missionservice.dto.nested.RecommendedWeaponDto;
import vvp_company.missionservice.dto.nested.sendItem.SendItemDTO;
import vvp_company.missionservice.dto.request.CreateMissionRequest;
import vvp_company.missionservice.dto.nested.MissionDto;
import vvp_company.missionservice.dto.response.PagedResponse;
import vvp_company.missionservice.service.MissionService;

import java.util.List;

@RestController
@RequestMapping("/mission")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @GetMapping
    public PagedResponse<MissionDto> getAllMissions(@NotNull @RequestParam Integer pageNumber, @NotNull @RequestParam Integer pageSize) {
        return missionService.findAllPaged(pageNumber, pageSize);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MINER_EMPLOYEE')")
    @GetMapping("/{id}")
    public MissionDto getMissionById(@PathVariable("id") Long id) {
        return missionService.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping
    public MissionDto createMission(@Valid @RequestBody CreateMissionRequest createMissionRequest) {
        return missionService.createNewMission(createMissionRequest);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @DeleteMapping("/{id}")
    public void deleteMissionById(@PathVariable("id") Long id) {
        missionService.delete(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') "+
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE')")
    @GetMapping("/{id}/getRecommendedWeapons")
    public List<RecommendedWeaponDto> getRecommendedWeaponsForMission(@PathVariable("id") Long id) {
        return missionService.getRecommendedWeaponsForMission(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE')")
    @PostMapping("/send/{missionId}")
    public RequestDTO createSendMissionRequestInRequestService(@NotNull @PathVariable("missionId") Long missionId, @Valid @RequestBody List<SendItemDTO> sendItemDTOList) throws JsonProcessingException {
        return missionService.createSendMissionRequestInRequestService(missionId, sendItemDTOList);
    }
}
