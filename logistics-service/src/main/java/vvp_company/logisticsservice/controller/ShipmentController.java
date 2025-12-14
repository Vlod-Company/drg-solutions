package vvp_company.logisticsservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vvp_company.logisticsservice.dto.CreateShipmentRequest;
import vvp_company.logisticsservice.service.ShipmentService;

@RestController
@RequestMapping("shipment")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public void createShipment(@Valid @RequestBody CreateShipmentRequest createShipmentRequest) {
        shipmentService.createShipment(createShipmentRequest);
    }
}
