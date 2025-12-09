package vvp_company.missionservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.missionservice.dto.CreateMissionRequest;
import vvp_company.missionservice.dto.MissionDto;
import vvp_company.missionservice.service.MissionService;

import java.util.List;

@RestController
@RequestMapping("/mission")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;

    @GetMapping
    public List<MissionDto> getAllMissions() {
        return missionService.findAll();
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
}
