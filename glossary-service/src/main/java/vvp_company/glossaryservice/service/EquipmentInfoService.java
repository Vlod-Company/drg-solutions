package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.dto.CreateEquipmentInfoRequest;
import vvp_company.glossaryservice.dto.CreateResourceInfoRequest;
import vvp_company.glossaryservice.dto.EquipmentInfoDTO;
import vvp_company.glossaryservice.dto.ResourceInfoDTO;
import vvp_company.glossaryservice.mapper.EquipmentInfoMapper;
import vvp_company.glossaryservice.model.EquipmentInfo;
import vvp_company.glossaryservice.model.ResourceInfo;
import vvp_company.glossaryservice.repository.EquipmentInfoRepository;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
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

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public EquipmentInfoDTO createResourceInfo(CreateEquipmentInfoRequest request) {
        var entity = EquipmentInfo.builder()
                .name(request.name())
                .description(request.description())
                .weight(request.weight())
                .build();
        return mapper.toDto(repository.save(entity));
    }

    public EquipmentInfoDTO updateResourceInfo(Long id, CreateEquipmentInfoRequest request) {
        var equipmentInfoEntity = repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Описание оружия не найдено"));

        var newName = isNull(request.name()) ? equipmentInfoEntity.getName() : request.name();
        var newDescription = isNull(request.description()) ? equipmentInfoEntity.getDescription() : request.description();
        var newWeight = isNull(request.weight()) ? equipmentInfoEntity.getWeight() : request.weight();

        var newEquipmentInfoEntity = EquipmentInfo.builder()
                .id(id)
                .name(newName)
                .description(newDescription)
                .weight(newWeight)
                .build();
        return mapper.toDto(repository.save(newEquipmentInfoEntity));
    }
}
