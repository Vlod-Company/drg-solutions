package vvp_company.missionservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;
import vvp_company.missionservice.client.RequestServiceClient;
import vvp_company.missionservice.client.dto.RequestDTO;
import vvp_company.missionservice.dto.nested.SendItemDTO;
import vvp_company.missionservice.dto.request.CreateMissionRequest;
import vvp_company.missionservice.dto.nested.MissionDto;
import vvp_company.missionservice.dto.response.PagedResponse;
import vvp_company.missionservice.dto.nested.RecommendedWeaponDto;
import vvp_company.missionservice.enm.MissionStatus;
import vvp_company.missionservice.mapper.MissionMapper;
import vvp_company.missionservice.mapper.TeamMapper;
import vvp_company.missionservice.repository.MissionRepository;

import java.util.List;

import static java.util.Objects.isNull;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final MissionMapper missionMapper;
    private final RequestServiceClient requestServiceClient;

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
        var mission = missionMapper.fromCreateMissionRequest(createMissionRequest);
        return missionMapper.toMissionDto(missionRepository.save(mission));
    }

    public void delete(Long id) {
        missionRepository.deleteById(id);
    }

    public List<RecommendedWeaponDto> getRecommendedWeaponsForMission(Long missionId) {
        return missionRepository.getRecommendedWeapons(missionId);
    }

    public RequestDTO createSendMissionRequestInRequestService(Long missionId, List<SendItemDTO> sendItemDTOList) {
        var mission = missionRepository.findById(missionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Не найдена миссия"));

        if (mission.getStatus() != MissionStatus.CREATED) {
            throw new ResponseStatusException(BAD_REQUEST, "Миссия не в статусе CREATED");
        }

        var description = String.format("%s\n", mission.getTeamId());
        var objectMapper = new ObjectMapper();
        description = description + objectMapper.writeValueAsString(sendItemDTOList);
        System.out.println(description);
        return null;
    }
}
