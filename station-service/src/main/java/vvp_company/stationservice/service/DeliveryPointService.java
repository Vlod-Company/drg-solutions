package vvp_company.stationservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.stationservice.enm.DeliveryPointType;
import vvp_company.stationservice.model.DeliveryPoint;
import vvp_company.stationservice.repository.DeliveryPointRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DeliveryPointService {

    private final DeliveryPointRepository deliveryPointRepository;

    public Optional<DeliveryPoint> findById(Long id) {
        return deliveryPointRepository.findById(id);
    }

    public void removeDeliveryPointById(Long id) {
        deliveryPointRepository.deleteById(id);
    }

    public DeliveryPoint createDeliveryPoint(DeliveryPointType deliveryPointType) {
        DeliveryPoint deliveryPoint = new DeliveryPoint();
        deliveryPoint.setDeliveryType(deliveryPointType);
        return deliveryPointRepository.save(deliveryPoint);
    }
}
