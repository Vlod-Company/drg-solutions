package vvp_company.stationservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.stationservice.client.dto.RequestDTO;
import vvp_company.stationservice.dto.AttackedDTO;
import vvp_company.stationservice.dto.ChangeStatusDTO;
import vvp_company.stationservice.dto.CreateStationDTO;
import vvp_company.stationservice.model.Station;
import vvp_company.stationservice.service.StationService;

import java.util.List;

@RestController
@RequestMapping("station")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;

    @GetMapping
    public List<Station> getAllStations(){
        return stationService.findAllStations();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @DeleteMapping
    public void deleteStationById(Long id){
        stationService.deleteStation(id);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @PostMapping
    public Station addStation(CreateStationDTO station){
        return stationService.addStation(station);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE')")
    @PostMapping("setAttacked")
    public RequestDTO setAttacked(AttackedDTO attacked){
        return stationService.setAttacked(attacked);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_MAINTENANCE_EMPLOYEE') "+
            "or hasRole('ROLE_MANAGEMENT_EMPLOYEE')")
    @PostMapping("changeStatus")
    public void changeStatus(ChangeStatusDTO changeStatusDTO) {stationService.changeStatus(changeStatusDTO);}
}
