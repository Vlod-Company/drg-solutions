package vvp_company.stationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.stationservice.client.DeliveryPointClient;
import vvp_company.stationservice.client.enm.DeliveryPointType;
import vvp_company.stationservice.dto.CreateStationDTO;
import vvp_company.stationservice.mapper.StationMapper;
import vvp_company.stationservice.model.Station;
import vvp_company.stationservice.repository.StationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StationService {

    private final StationRepository repository;
    private final StationMapper mapper;
    private final DeliveryPointClient deliveryPointClient;

    public List<Station> findAllStations() {
        return repository.findAll();
    }

    public Station findStationById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public void deleteStation(Long id) {
        var station = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var deliveryPointId = station.getDeliveryPointId();

        deliveryPointClient.deleteDeliveryPoint(deliveryPointId);

        repository.delete(station);
    }

    @Transactional
    public Station addStation(CreateStationDTO createStationDTO) {
        var deliveryPoint = deliveryPointClient.createDeliveryPoint(DeliveryPointType.STATION);

        var stationEntity = mapper.toEntityFromCreateRequest(createStationDTO);

        stationEntity.setDeliveryPointId(deliveryPoint.getId());

        return repository.save(stationEntity);
    }
}
