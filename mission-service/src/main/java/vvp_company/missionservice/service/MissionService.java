package vvp_company.missionservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.missionservice.dto.CreateMissionRequest;
import vvp_company.missionservice.dto.MissionDto;
import vvp_company.missionservice.dto.PagedResponse;
import vvp_company.missionservice.dto.RecommendedWeaponDto;
import vvp_company.missionservice.mapper.MissionMapper;
import vvp_company.missionservice.mapper.TeamMapper;
import vvp_company.missionservice.model.Mission;
import vvp_company.missionservice.repository.MissionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final MissionMapper missionMapper;
    private final TeamService teamService;
    private final TeamMapper teamMapper;

    public PagedResponse<MissionDto> findAllPaged(int pageNo, int pageSize) {
        var missions = missionRepository.findAll(Pageable.ofSize(pageSize));
        return PagedResponse.<MissionDto>builder()
                .pageSize(pageSize)
                .pageNumber(pageNo)
                .total((int)missions.getTotalElements())
                .data(missions.map(missionMapper::toMissionDto).toList())
                .build();
    }

    public List<MissionDto> findAll() {
        return missionRepository.findAll().stream().map(missionMapper::toMissionDto).toList();
    }

    public MissionDto findById(Long id) {
        return missionRepository.findById(id).map(missionMapper::toMissionDto).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Миссия не найдена"));
    }

    public MissionDto createNewMission(CreateMissionRequest createMissionRequest) {
        var team = teamService.findTeam(createMissionRequest.getTeamId());
        if (team == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Команда не найдена");
        }
        var teamEntity = teamMapper.toTeam(team);

        var mission = missionMapper.fromCreateMissionRequest(createMissionRequest);
        mission.setTeam(teamEntity);
        return missionMapper.toMissionDto(missionRepository.save(mission));
    }

    public void delete(Long id) {
        missionRepository.deleteById(id);
    }

    public List<RecommendedWeaponDto> getRecommendedWeaponsForMission(Long missionId) {
        return missionRepository.getRecommendedWeapons(missionId);
    }
}
