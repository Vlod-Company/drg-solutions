package vvp_company.stationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.stationservice.enm.DeliveryPointType;
import vvp_company.stationservice.dto.CreateStationDTO;
import vvp_company.stationservice.mapper.StationMapper;
import vvp_company.stationservice.model.Station;
import vvp_company.stationservice.repository.StationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {

    private final StationRepository stationRepository;
    private final StationMapper stationMapper;
    private final DeliveryPointService deliveryPointService;

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
}
