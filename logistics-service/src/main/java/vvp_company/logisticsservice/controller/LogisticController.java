package vvp_company.logisticsservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.logisticsservice.dto.UpdateLogisticRequest;
import vvp_company.logisticsservice.model.Logistic;
import vvp_company.logisticsservice.service.LogisticService;


@RestController
@RequestMapping("logistics")
@RequiredArgsConstructor
public class LogisticController {

    private final LogisticService logisticService;

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PutMapping("{id}")
    public Logistic updateLogisticStatusAndDate(@PathVariable Long id, @RequestBody @Valid UpdateLogisticRequest req) {
        return logisticService.updateLogistic(id, req);
    }

    @GetMapping("{id}")
    public Logistic getLogistic(@PathVariable Long id) {
        return logisticService.getLogisticById(id);
    }
}
