package vvp_company.logisticsservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.logisticsservice.enm.LogisticStatus;
import vvp_company.logisticsservice.model.Logistic;
import vvp_company.logisticsservice.service.LogisticService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("logistics")
@RequiredArgsConstructor
public class LogisticController {

    private final LogisticService logisticService;

    @PutMapping("{id}")
    public Logistic updateLogisticStatus(@PathVariable Long id, @RequestParam("newStatus") LogisticStatus newStatus, @RequestParam("newDate") LocalDateTime newDate) {
        return logisticService.updateLogistic(id, newStatus, newDate);
    }
}
