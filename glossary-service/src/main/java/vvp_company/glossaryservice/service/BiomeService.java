package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.model.Biome;
import vvp_company.glossaryservice.repository.BiomeRepository;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class BiomeService {

    private final BiomeRepository repository;

    public Biome findBiomeById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Биоме не найден"));
    }

    public List<Biome> findAll() {
        return repository.findAll();
    }
}
