package vvp_company.logisticsservice.controller;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PutMapping("{id}")
    public Logistic updateLogisticStatusAndDate(@PathVariable Long id, @NotNull @RequestParam("newStatus") LogisticStatus newStatus, @RequestParam("newDate") LocalDateTime newDate) {
        return logisticService.updateLogistic(id, newStatus, newDate);
    }

    @GetMapping("{id}")
    public Logistic getLogistic(@PathVariable Long id) {
        return logisticService.getLogisticById(id);
    }
}
