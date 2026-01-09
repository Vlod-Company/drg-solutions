package vvp_company.stationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.stationservice.client.RequestServiceClient;
import vvp_company.stationservice.client.dto.CreateRequestDTO;
import vvp_company.stationservice.client.dto.RequestDTO;
import vvp_company.stationservice.dto.AttackedDTO;
import vvp_company.stationservice.dto.ChangeStatusDTO;
import vvp_company.stationservice.enm.DeliveryPointType;
import vvp_company.stationservice.dto.CreateStationDTO;
import vvp_company.stationservice.enm.StationStatus;
import vvp_company.stationservice.mapper.StationMapper;
import vvp_company.stationservice.model.Station;
import vvp_company.stationservice.repository.StationRepository;

import java.util.List;

import static java.lang.String.format;
import static vvp_company.stationservice.enm.StationStatus.UNDER_ATTACK;

@Service
@RequiredArgsConstructor
public class StationService {

    private final String UNDER_ATTACK_MESSAGE = "Станция №%d под атакой\nНазвание станции: %s\nТип станции: %s\nОписание: %s";

    private final StationRepository stationRepository;
    private final StationMapper stationMapper;
    private final DeliveryPointService deliveryPointService;
    private final RequestServiceClient requestServiceClient;

    public List<Station> findAllStations() {
        return stationRepository.findAll();
    }

    public Station findStationById(Long id) {
        return stationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public void deleteStation(Long id) {
        var station = stationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var deliveryPointId = station.getDeliveryPointId();

        stationRepository.delete(station);

        deliveryPointService.removeDeliveryPointById(deliveryPointId);
    }

    @Transactional
    public Station addStation(CreateStationDTO createStationDTO) {
        var deliveryPoint = deliveryPointService.createDeliveryPoint(DeliveryPointType.STATION);

        var stationEntity = stationMapper.toEntityFromCreateRequest(createStationDTO);

        stationEntity.setDeliveryPointId(deliveryPoint.getId());

        return stationRepository.save(stationEntity);
    }

    @Transactional
    public RequestDTO setAttacked(Long id, AttackedDTO dto) {
        var station = stationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        station.setStatus(UNDER_ATTACK);
        var newStation = stationRepository.save(station);

        var desc = dto.description().orElse("Станция под атакой");

        var createRequestDTO = CreateRequestDTO.builder()
                .recipientDepartment("Maintenance")
                .requestCode("REQ-SA")
                .description(format(UNDER_ATTACK_MESSAGE, newStation.getId(), newStation.getName(), newStation.getType(), desc))
                .build();

        return requestServiceClient.createRequest(createRequestDTO);
    }

    @Transactional
    public void changeStatus(ChangeStatusDTO changeStatusDTO) {
        var station = stationRepository.findById(changeStatusDTO.id()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        station.setStatus(changeStatusDTO.status());
        stationRepository.save(station);
    }
}
