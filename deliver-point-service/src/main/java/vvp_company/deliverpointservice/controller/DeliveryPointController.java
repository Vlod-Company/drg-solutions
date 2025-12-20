package vvp_company.deliverpointservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCANCOM_EMPLOYEE')")
    @GetMapping("{id}")
    public DeliveryPoint getDeliveryPoint(@PathVariable("id") Long id) {
        return deliveryPointService.findById(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MISSION_CONTROL_EMPLOYEE') " +
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCIENCE_DEPARTMENT_EMPLOYEE') " +
            "or hasRole('ROLE_SCANCOM_EMPLOYEE')")
    @GetMapping
    public List<DeliveryPoint> getAllDeliveryPoints() {
        return deliveryPointService.findAll();
    }
}
