package vvp_company.logisticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.logisticsservice.model.Cargo;
import vvp_company.logisticsservice.repository.CargoRepository;

import java.time.LocalDate;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CargoService {

    private final CargoRepository cargoRepository;

    public Cargo createCargo(Integer weight, LocalDate shipToDate, Long shipToPoint) {
        var cargo = Cargo.builder()
                .weight(weight)
                .shipToDate(shipToDate)
                .shipToPoint(shipToPoint)
                .build();
        return cargoRepository.save(cargo);
    }

    public Cargo getCargoById(Long cargoId) {
        return cargoRepository.findById(cargoId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
    }
}
