package vvp_company.deliverpointservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.deliverpointservice.enm.DeliveryPointType;
import vvp_company.deliverpointservice.model.DeliveryPoint;
import vvp_company.deliverpointservice.service.DeliveryPointService;

import java.util.List;

@RestController
@RequestMapping("deliveryPoint")
@RequiredArgsConstructor
public class DeliveryPointController {

    private final DeliveryPointService deliveryPointService;

    @GetMapping("{id}")
    public DeliveryPoint getDeliveryPoint(@PathVariable("id") Long id) {
        return deliveryPointService.findById(id);
    }

    @GetMapping
    public List<DeliveryPoint> getAllDeliveryPoints() {
        return deliveryPointService.findAll();
    }
}
