package vvp_company.logisticsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.logisticsservice.model.Cargo;
import vvp_company.logisticsservice.repository.CargoRepository;

import java.time.LocalDate;

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
}
