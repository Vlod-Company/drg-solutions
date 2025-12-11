package vvp_company.deliverpointservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.deliverpointservice.enm.DeliveryPointType;
import vvp_company.deliverpointservice.model.DeliveryPoint;
import vvp_company.deliverpointservice.repository.DeliveryPointRepository;

@Service
@RequiredArgsConstructor
public class DeliveryPointService {

    private final DeliveryPointRepository deliveryPointRepository;

    public DeliveryPoint createDeliveryPoint(DeliveryPointType deliveryPointType) {
        var deliveryPoint = DeliveryPoint.builder().deliveryType(deliveryPointType).build();
        return deliveryPointRepository.save(deliveryPoint);
    }

    public DeliveryPoint findById(Long id) {
        return deliveryPointRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public void removeDeliveryPoint(Long id) {
        deliveryPointRepository.deleteById(id);
    }
}
