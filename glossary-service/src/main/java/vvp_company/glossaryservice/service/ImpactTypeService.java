package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.model.ImpactType;
import vvp_company.glossaryservice.repository.ImpactTypeRepository;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ImpactTypeService {

    private final ImpactTypeRepository impactTypeRepository;

    public ImpactType getImpactType(Long impactTypeId) {
        return impactTypeRepository.findById(impactTypeId).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Тип урона не найден"));
    }

    public List<ImpactType> findAll() {
        return impactTypeRepository.findAll();
    }
}
