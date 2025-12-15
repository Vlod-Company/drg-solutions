package vvp_company.stationservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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

    @DeleteMapping
    public void deleteStationById(Long id){
        stationService.deleteStation(id);
    }

    @PostMapping
    public Station addStation(CreateStationDTO station){
        return stationService.addStation(station);
    }

    @PostMapping("setAttacked/{id}")
    public void setAttacked(@PathVariable("id") Long id){
        stationService.setAttacked(id);
    }
}
