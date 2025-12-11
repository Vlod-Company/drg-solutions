package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.dto.EquipmentInfoDTO;
import vvp_company.glossaryservice.mapper.EquipmentInfoMapper;
import vvp_company.glossaryservice.repository.EquipmentInfoRepository;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class EquipmentInfoService {

    private final EquipmentInfoRepository repository;
    private final EquipmentInfoMapper mapper;

    public EquipmentInfoDTO getEquipmentInfoByName(String equipmentName) {
        return repository.findByName(equipmentName).map(mapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Информация по снаряжению не найдена"));
    }

    public List<EquipmentInfoDTO> getAllEquipmentInfos() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
