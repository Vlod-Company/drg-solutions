package vvp_company.spaceshipservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.spaceshipservice.dto.CreateSpaceShipDTO;
import vvp_company.spaceshipservice.mapper.SpaceShipMapper;
import vvp_company.spaceshipservice.model.SpaceShip;
import vvp_company.spaceshipservice.repository.SpaceShipRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpaceShipService {

    private final SpaceShipRepository repository;
    private final SpaceShipMapper mapper;

    public List<SpaceShip> getAllSpaceShips() {
        return repository.findAll();
    }

    public SpaceShip getSpaceShipById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public void deleteSpaceShipById(Long id) {
        repository.deleteById(id);
    }

    public SpaceShip createSpaceShip(CreateSpaceShipDTO dto) {
        var spaceShipEntity = mapper.fromCreateSpaceShipRequest(dto);

        return repository.save(spaceShipEntity);
    }
}
