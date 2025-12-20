package vvp_company.missionservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.missionservice.client.RequestServiceClient;
import vvp_company.missionservice.client.dto.CreateRequestDTO;
import vvp_company.missionservice.client.dto.RequestDTO;
import vvp_company.missionservice.dto.nested.sendItem.SendItemDTO;
import vvp_company.missionservice.dto.nested.sendItem.SendItemTeam;
import vvp_company.missionservice.dto.request.CreateMissionRequest;
import vvp_company.missionservice.dto.nested.MissionDto;
import vvp_company.missionservice.dto.response.PagedResponse;
import vvp_company.missionservice.dto.nested.RecommendedWeaponDto;
import vvp_company.missionservice.enm.MissionStatus;
import vvp_company.missionservice.enm.SendItemType;
import vvp_company.missionservice.mapper.MissionMapper;
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

    public RequestDTO createSendMissionRequestInRequestService(Long missionId, List<SendItemDTO> sendItemDTOList) throws JsonProcessingException {
        var mission = missionRepository.findById(missionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Не найдена миссия"));

        if (mission.getStatus() != MissionStatus.CREATED) {
            throw new ResponseStatusException(BAD_REQUEST, "Миссия не в статусе CREATED");
        }

        var teamSendItem = new SendItemTeam(SendItemType.TEAM, mission.getTeamId());
        sendItemDTOList.add(teamSendItem);

        var objectMapper = new ObjectMapper();
        var description = objectMapper.writeValueAsString(sendItemDTOList);

        var createRequestDTO = CreateRequestDTO.builder()
                .description(description)
                .requestCode("101")
                .recipientDepartment("logistics")
                .build();

        return requestServiceClient.createRequest(createRequestDTO);
    }
}
