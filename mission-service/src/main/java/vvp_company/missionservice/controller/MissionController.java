package vvp_company.missionservice.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.missionservice.client.dto.RequestDTO;
import vvp_company.missionservice.dto.nested.SendItemDTO;
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

    @GetMapping
    public PagedResponse<MissionDto> getAllMissions(@NotNull @RequestParam Integer pageNumber, @NotNull @RequestParam Integer pageSize) {
        return missionService.findAllPaged(pageNumber, pageSize);
    }

    @GetMapping("/{id}")
    public MissionDto getMissionById(@PathVariable("id") Long id) {
        return missionService.findById(id);
    }

    @PostMapping
    public MissionDto createMission(@Valid @RequestBody CreateMissionRequest createMissionRequest) {
        return missionService.createNewMission(createMissionRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteMissionById(@PathVariable("id") Long id) {
        missionService.delete(id);
    }

    @GetMapping("/{id}/getRecommendedWeapons")
    public void getRecommendedWeaponsForMission(@PathVariable("id") Long id) {
        missionService.getRecommendedWeaponsForMission(id);
    }

    @PostMapping("/send/{missionId}")
    public RequestDTO createSendMissionRequestInRequestService(@NotNull @PathVariable("missionId") Long missionId, @Valid @RequestBody List<SendItemDTO> sendItemDTOList) {
        return missionService.createSendMissionRequestInRequestService(missionId, sendItemDTOList);
    }
}
