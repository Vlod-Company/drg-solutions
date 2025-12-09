package vvp_company.missionservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.missionservice.dto.CreateMissionRequest;
import vvp_company.missionservice.dto.MissionDto;
import vvp_company.missionservice.mapper.MissionMapper;
import vvp_company.missionservice.model.Mission;
import vvp_company.missionservice.repository.MissionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final MissionMapper missionMapper;

    public List<MissionDto> findAll() {
        return missionRepository.findAll().stream().map(missionMapper::toMissionDto).toList();
    }

    public MissionDto findById(Long id) {
        return missionRepository.findById(id).map(missionMapper::toMissionDto).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Миссия не найдена"));
    }

    public MissionDto createNewMission(CreateMissionRequest createMissionRequest) {
        Mission mission = missionMapper.fromCreateMissionRequest(createMissionRequest);
        return missionMapper.toMissionDto(missionRepository.save(mission));
    }

    public void delete(Long id) {
        missionRepository.deleteById(id);
    }
}
