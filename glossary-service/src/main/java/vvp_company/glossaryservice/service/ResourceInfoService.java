package vvp_company.glossaryservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.glossaryservice.dto.CreateResourceInfoRequest;
import vvp_company.glossaryservice.dto.CreateWeaponInfoRequest;
import vvp_company.glossaryservice.dto.ResourceInfoDTO;
import vvp_company.glossaryservice.dto.WeaponInfoDTO;
import vvp_company.glossaryservice.mapper.ResourceInfoMapper;
import vvp_company.glossaryservice.model.ResourceInfo;
import vvp_company.glossaryservice.model.WeaponInfo;
import vvp_company.glossaryservice.repository.ResourceInfoRepository;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ResourceInfoService {

    private final ResourceInfoRepository repository;
    private final ResourceInfoMapper mapper;

    public ResourceInfoDTO getResourceInfoByName(String name) {
        return repository.findByName(name).map(mapper::toDTO)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Информация о ресурсе не найдена"));
    }

    public List<ResourceInfoDTO> getAllResourceInfos() {
        return repository.findAll().stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public ResourceInfoDTO createResourceInfo(CreateResourceInfoRequest request) {

        var entity = ResourceInfo.builder()
                .name(request.name())
                .description(request.description())
                .weightPerUnit(request.weightPerUnit())
                .build();
        return mapper.toDTO(entity);
    }

    public ResourceInfoDTO updateResourceInfo(Long id, CreateResourceInfoRequest request) {
        var resourceInfoEntity = repository.findById(id).orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Описание оружия не найдено"));

        var newName = isNull(request.name()) ? resourceInfoEntity.getName() : request.name();
        var newDescription = isNull(request.description()) ? resourceInfoEntity.getDescription() : request.description();
        var newWeight = isNull(request.weightPerUnit()) ? resourceInfoEntity.getWeightPerUnit() : request.weightPerUnit();

        var newResourceInfoEntity = ResourceInfo.builder()
                .id(id)
                .name(newName)
                .description(newDescription)
                .weightPerUnit(newWeight)
                .build();
        return mapper.toDTO(repository.save(newResourceInfoEntity));
    }
}
