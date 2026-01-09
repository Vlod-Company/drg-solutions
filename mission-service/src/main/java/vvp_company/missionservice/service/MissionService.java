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
import vvp_company.missionservice.dto.request.UpdateMissionRequest;
import vvp_company.missionservice.dto.response.PagedResponse;
import vvp_company.missionservice.dto.nested.RecommendedWeaponDto;
import vvp_company.missionservice.enm.MissionStatus;
import vvp_company.missionservice.mapper.MissionMapper;
import vvp_company.missionservice.repository.MissionRepository;

import java.util.List;

import static java.lang.String.format;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final String LOGISTIC_DEPARTMENT_REQUEST = "Отправить в biome, ID: %d\nДата отправки: %s\nДобавить cargo:\n%s";

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
        return missionRepository.findById(id).map(missionMapper::toMissionDto).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Миссия не найдена"));
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
        var mission = missionRepository.findById(missionId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Не найдена миссия"));

        if (mission.getStatus() != MissionStatus.CREATED) {
            throw new ResponseStatusException(BAD_REQUEST, "Миссия не в статусе CREATED");
        }

        var teamSendItem = new SendItemTeam(mission.getTeamId());
        sendItemDTOList.add(teamSendItem);

        var objectMapper = new ObjectMapper();
        var objects = objectMapper.writeValueAsString(sendItemDTOList);

        var createRequestDTO = CreateRequestDTO.builder()
                .description(format(LOGISTIC_DEPARTMENT_REQUEST, mission.getBiomeId(), mission.getMissionStart(), objects))
                .requestCode("REQ-LG")
                .recipientDepartment("Launch Control")
                .build();

        return requestServiceClient.createRequest(createRequestDTO);
    }

    public MissionDto updateMission(Long id, UpdateMissionRequest dto) {
        var mission = missionRepository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));

        System.out.println(dto);
        var status = dto.newStatus().orElse(mission.getStatus());
        var missionEnd = dto.newMissionEnd().orElse(mission.getMissionEnd());

        mission.setMissionEnd(missionEnd);
        mission.setStatus(status);
        return missionMapper.toMissionDto(missionRepository.save(mission));
    }
}
