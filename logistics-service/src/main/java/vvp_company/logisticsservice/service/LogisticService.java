package vvp_company.logisticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.logisticsservice.enm.LogisticStatus;
import vvp_company.logisticsservice.model.Logistic;
import vvp_company.logisticsservice.repository.CargoRepository;
import vvp_company.logisticsservice.repository.LogisticRepository;

import java.time.LocalDateTime;

import static vvp_company.logisticsservice.enm.LogisticStatus.CREATED;

@Service
@RequiredArgsConstructor
public class LogisticService {

    private final String RESOLVE_LOGISTIC = """
            Разрулите логистику
            """;

    private final LogisticRepository repository;
    private final CargoRepository cargoRepository;

    public Logistic createLogistic(Long cargoId, Long spaceShipId) {
        var logistic = Logistic.builder()
                .cargoId(cargoId)
                .spaceShipId(spaceShipId)
                .status(CREATED)
                .build();
        return repository.save(logistic);
    }

    public Logistic updateLogistic(Long id, LogisticStatus newStatus, LocalDateTime newDate) {
        var logistic = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        cargoRepository.recalculateCargo(logistic.getCargoId());
        logistic.setStatus(newStatus);
        logistic.setSendTime(newDate == null ? logistic.getSendTime() : newDate);
        return repository.save(logistic);
    }

    public Logistic getLogisticById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
